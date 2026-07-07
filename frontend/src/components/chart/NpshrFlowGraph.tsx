import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ScatterChart,
  LabelList,
  Tooltip,
  Scatter,
} from "recharts";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";

export interface NpshrFlowGraphProps {
  chartData: FactoryCurveDataResponse[];
  format?: string | null;
  scatter?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}

export const NpshrFlowGraph = ({
  chartData,
  format,
  scatter,
  isError,
  isLoading,
}: NpshrFlowGraphProps) => {

  const XAxisDefaultProps = {
    dataKey: "flow",
    label: {
      value: "Flow (m3/hr)",
      position: "insideBottomRight",
      offset: -2,
      style: { fontSize: 12 },
    },
    type: "number" as const,
    style: { fontSize: 12 },
  };

  const YAxisDefaultProps = {
    dataKey: "npshr",
    label: {
      value: format === "KOP9163"? "Head (m)" :"NPSHR (m)",
      angle: -90,
      position: "insideLeft",
      inset: -2,
      style: { fontSize: 12 },
    },
    type: "number" as const,
    style: { fontSize: 12 },
  };

  const error = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const colors = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];

  switch (format) {
    case "KDIN": {
      const filteredChartData = chartData
        .filter(
          (point) =>
            point.npshr !== null && point.npshr !== "" && point.flow !== "",
        )
        .sort((a, b) => Number(a.flow) - Number(b.flow));
      const transformedData = filteredChartData.map((point) => ({
        flow: Number(point.flow),
        npshr: Number(point.npshr),
      }));
      const maxFlow = Math.max(...transformedData.map((p) => p.flow));
      const tolerance = 0.001;
      const maxFlowPoints = transformedData.filter(
        (p) => Math.abs(p.flow - maxFlow) < tolerance,
      );
      const maxFlowMaxNpshrPoint =
        maxFlowPoints.length > 0
          ? maxFlowPoints.reduce((a, b) => (a.npshr > b.npshr ? a : b))
          : null;
      const maxFlowMaxNpshrIndex = maxFlowMaxNpshrPoint
        ? transformedData.indexOf(maxFlowMaxNpshrPoint)
        : -1;

      return (
        <ResponsiveContainer height={400}>
          <ScatterChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...XAxisDefaultProps} />
            <YAxis {...YAxisDefaultProps} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              key="npshr"
              name="npshr"
              data={transformedData}
              line
              fill={scatter ? "none" : colors[0]}
              strokeWidth={2}
              shape={(props: any) => {
                const { cx, cy } = props;
                return (
                  <circle cx={cx} cy={cy} r={6} fill="transparent" stroke="none" />
                );
              }}
            >
              <LabelList
                dataKey="npshr"
                content={({ x, y, index: pointIndex }) => {
                  if (pointIndex === maxFlowMaxNpshrIndex) {
                    return (
                      <text
                        x={Number(x) + 10}
                        y={Number(y)}
                        fill={colors[0]}
                        fontSize={12}
                        fontWeight="bold"
                        textAnchor="start"
                      >
                        {"npshr"}
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    case "KISO": {
      const uniqueImpDia = [
        ...new Set(
          chartData.map((item) => item.imp_dia && item.imp_dia?.split(".")[0]),
        ),
      ].filter(
        (dia) => dia !== null && dia !== "0" && dia !== undefined && dia !== "",
      );

      const transformedDataImp: {
        [key: string]: { flow: number; npshr: number }[];
      } = uniqueImpDia.reduce(
        (acc: Record<string, { flow: number; npshr: number }[]>, dia) => {
          if (dia !== undefined) {
            acc[dia] = chartData
              .filter(
                (item) =>
                  item.imp_dia?.split(".")[0] === dia &&
                  item.flow &&
                  item.npshr !== null &&
                  item.npshr !== "",
              )
              .map((item) => ({
                flow: Number(item.flow),
                npshr: Number(item.npshr),
              }))
              .sort((a, b) => a.flow - b.flow);
          }
          return acc;
        },
        {},
      );

      return (
        <ResponsiveContainer height={400}>
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...XAxisDefaultProps} />
            <YAxis {...YAxisDefaultProps} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            {uniqueImpDia.map((dia, index) => {
              if (dia && transformedDataImp[dia].length > 0) {
                const dataSeries = transformedDataImp[dia].filter(
                  (point) => !isNaN(point.npshr),
                );
                const lastDataPointIndex = dataSeries.length - 1;
                return (
                  <Scatter
                    key={dia}
                    name={`${dia}mm`}
                    data={dataSeries}
                    line
                    fill={scatter ? "none" : colors[index % colors.length]}
                    strokeWidth={2}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill="transparent"
                          stroke="none"
                        />
                      );
                    }}
                  >
                    <LabelList
                      dataKey="npshr"
                      content={({ x, y, index: pointIndex }) => {
                        if (pointIndex === lastDataPointIndex) {
                          return (
                            <text
                              x={Number(x) - 10}
                              y={Number(y) + 30}
                              fill={colors[index % colors.length]}
                              fontSize={12}
                              fontWeight="bold"
                              textAnchor="start"
                            >
                              {`${dia}mm`}
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </Scatter>
                );
              }
            })}
          </ScatterChart>
        </ResponsiveContainer>
      );
    }
    case "KOP9196":
    case "MAX3": {
      const uniqueImpNpshr = [
        ...new Set(
          chartData.map((item) => item.npshr),
        ),
      ].filter(
        (npshr) => npshr !== null && npshr !== "0" && npshr !== undefined && npshr !== "",
      );
      
      const transformedDataNpshr: {
        [key: string]: { flow: number; npshr: number }[];
      } = uniqueImpNpshr.reduce(
        (acc: Record<string, { flow: number; npshr: number }[]>, npshr) => {
          if (npshr !== undefined) {
            acc[npshr] = chartData
              .filter(
                (item) =>
                  item.npshr === npshr &&
                  item.flow &&
                  item.head !== null &&
                  item.head !== "",
              )
              .map((item) => ({
                flow: Number(item.flow),
                npshr: Number(item.head),
              }))
              .sort((a, b) => a.flow - b.flow);
          }
          return acc;
        },
        {},
      );

      return (
        <ResponsiveContainer height={400}>
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...XAxisDefaultProps} />
            <YAxis {...YAxisDefaultProps} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            {uniqueImpNpshr.map((npshr, index) => {
              if (npshr && transformedDataNpshr[npshr].length > 0) {
                const dataSeries = transformedDataNpshr[npshr].filter(
                  (point) => !isNaN(point.npshr),
                );
                const lastDataPointIndex = dataSeries.length - 1;
                return (
                  <Scatter
                    key={npshr}
                    name={`${npshr}`}
                    data={dataSeries}
                    line
                    fill={scatter ? "none" : colors[index % colors.length]}
                    strokeWidth={2}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill="transparent"
                          stroke="none"
                        />
                      );
                    }}
                  >
                    <LabelList
                      dataKey="npshr"
                      content={({ x, y, index: pointIndex }) => {
                        if (pointIndex === lastDataPointIndex) {
                          return (
                            <text
                              x={Number(x) + 10}
                              y={Number(y) + 30}
                              fill={colors[index % colors.length]}
                              fontSize={12}
                              fontWeight="bold"
                              textAnchor="start"
                            >
                              {`${parseFloat(npshr).toFixed(2)} m`}
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </Scatter>
                );
              }
            })}
          </ScatterChart>
        </ResponsiveContainer>
      );
    }
  }

  return null;
};
