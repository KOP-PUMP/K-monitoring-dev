import {
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  LabelList,
  Tooltip,
} from "recharts";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";
import { parse } from "path";
export interface HeadFlowGraphProps {
  chartData: FactoryCurveDataResponse[];
  scatter?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}

export const HeadFlowGraph = ({
  chartData,
  scatter,
  isLoading,
  isError,
}: HeadFlowGraphProps) => {
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
    dataKey: "head",
    label: {
      value: "Head (m)",
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

  if (chartData) {
    const colors = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
    const uniqueImpDia = [
      ...new Set(
        chartData.map((item) => item.imp_dia && item.imp_dia?.split(".")[0])
      ),
    ].filter(
      (dia) => dia !== null && dia !== "0" && dia !== undefined && dia !== ""
    );

    const uniqueEff = [...new Set(chartData.map((item) => item.eff))].filter(
      (dia) => dia !== null && dia !== "0" && dia !== undefined && dia !== ""
    );

    const transformedDataEff = uniqueEff.reduce((acc, eff) => {
      acc[eff] = chartData
        .filter((item) => item.eff === eff)
        .map((item) => ({
          flow: item.flow ?? null,
          head: item.head,
        }))
        .sort((a, b) => a.flow - b.flow);
      return acc;
    }, {});

    const transformedDataImp = uniqueImpDia.reduce((acc, dia) => {
      acc[dia] = chartData
        .filter(
          (item) => item.imp_dia?.split(".")[0] === dia && item.head && item.flow
        )
        .map((item) => ({
          flow: parseFloat(item.flow),
          head: parseFloat(item.head),
        }))
        .sort((a, b) => a.flow - b.flow); // Sort by flow
      return acc;
    }, {});

    return (
      <ResponsiveContainer height={400}>
        <ScatterChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          {uniqueImpDia.map((dia, index) => {
            let dataSeries = transformedDataImp[dia];
            dataSeries = dataSeries.filter((point: any) => !isNaN(point.head));
            const lastDataPointIndex = dataSeries.length - 1; // Ensure we get last index
            return (
              <Scatter
                key={dia}
                name={`${dia}mm`}
                data={transformedDataImp[dia]}
                line
                fill={scatter ? "none" : colors[index % colors.length]}
                strokeWidth={2}
                shape={(props: any) => {
                  const { cx, cy, isActive } = props;
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
                
              </Scatter>
            );
          })}
          {uniqueEff.map((eff, index) => {
            let dataSeries = transformedDataEff[eff];
            dataSeries = dataSeries.filter((point: any) => !isNaN(point.head));

            if (dataSeries.length === 0) return null;

            // Tolerance to handle float comparison
            const tolerance = 0.001;

            const minFlow = Math.min(...dataSeries.map((p) => p.flow));
            const maxFlow = Math.max(...dataSeries.map((p) => p.flow));

            const minFlowPoints = dataSeries.filter(
              (p) => Math.abs(p.flow - minFlow) < tolerance
            );
            const maxFlowPoints = dataSeries.filter(
              (p) => Math.abs(p.flow - maxFlow) < tolerance
            );

            const maxFlowMaxHeadPoint =
              maxFlowPoints.length > 0
                ? maxFlowPoints.reduce((a, b) => (a.head > b.head ? a : b))
                : null;

            const maxFlowMaxHeadIndex = maxFlowMaxHeadPoint
              ? dataSeries.indexOf(maxFlowMaxHeadPoint)
              : -1;

            return (
              <Scatter
                key={eff}
                name={eff}
                data={dataSeries}
                shape={(props) => (
                  <circle cx={props.cx} cy={props.cy} r={2} fill={colors[index % colors.length]} />
                )}
              >
                <LabelList
                  dataKey="head"
                  content={({ x, y, index: pointIndex }) => {
                    if (
                      pointIndex === maxFlowMaxHeadIndex
                    ) {
                      const labelText = eff
                      return (
                        <text
                          x={x + 10}
                          y={y - 0}
                          fill={colors[index % colors.length]}
                          fontSize={12}
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          {`${labelText}`}
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Scatter>
            );
          })}
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return null;
};
