import {
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  LabelList,
} from "recharts";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";

export interface FlowPowerGraphProps {
  chartData: FactoryCurveDataResponse[];
  format?: string | null;
  scatter?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}

export const FlowPowerGraph = ({
  chartData,
  format,
  scatter,
  isLoading,
  isError,
}: FlowPowerGraphProps) => {

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
    dataKey: "power",
    label: {
      value: "Power (kw)",
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
    case "KDIN":
    case "MAX3" :
      const uniqueImpDia = [
        ...new Set(
          chartData.map((item) => item.imp_dia && item.imp_dia?.split(".")[0]),
        ),
      ].filter(
        (dia) => dia !== null && dia !== "0" && dia !== undefined && dia !== "",
      );

      const transformedDataImp: {
        [key: string]: { flow: number; power: number }[];
      } = uniqueImpDia.reduce(
        (acc: Record<string, { flow: number; power: number }[]>, dia) => {
          if (dia !== undefined) {
            acc[dia] = chartData
              .filter(
                (item) =>
                  item.imp_dia?.split(".")[0] === dia && item.kw && item.flow,
              )
              .map((item) => ({
                flow: Number(item.flow),
                power: Number(item.kw),
              }))
              .sort((a, b) => a.flow - b.flow); // Sort by flow
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
              if (dia) {
                let dataSeries = transformedDataImp[dia].filter(
                  (point: any) => !isNaN(point.power),
                );
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
                      dataKey="power"
                      content={({ x, y, index: pointIndex }) => {
                        if (pointIndex && pointIndex === lastDataPointIndex) {
                          return (
                            <text
                              x={Number(x) + 10}
                              y={Number(y) + 0}
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

    case "KISO":
    case "KOP9196":
      const uniquePower = [
        ...new Set(chartData.map((item) => item.kw)),
      ].filter(
        (kw) => kw !== null && kw !== "0" && kw !== undefined && kw !== "",
      );

      const transformedDataRPM: {
        [key: string]: { flow: number; head: number }[];
      } = uniquePower.reduce(
        (acc: Record<string, { flow: number; head: number }[]>, kw) => {
          if (kw !== undefined) {
            acc[kw] = chartData
              .filter((item) => item.kw === kw && item.flow && item.head)
              .map((item) => ({
                flow: Number(item.flow),
                head: Number(item.head),
              }))
              .sort((a, b) => a.flow - b.flow);
          }
          return acc;
        },
        {},
      );

      const YAxisKISOProps = {
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

      return (
        <ResponsiveContainer height={400}>
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...XAxisDefaultProps} />
            <YAxis {...YAxisKISOProps} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            {uniquePower.map((kw, index) => {
              if (kw) {
                const dataSeries = transformedDataRPM[kw].filter(
                  (point) => !isNaN(point.head),
                );
                const lastDataPointIndex = dataSeries.length - 1;
                return (
                  <Scatter
                    key={kw}
                    name={`${kw}kW`}
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
                      dataKey="head"
                      content={({ x, y, index: pointIndex }) => {
                        if (pointIndex === lastDataPointIndex) {
                          return (
                            <text
                              x={Number(x) - 50}
                              y={Number(y) + 40}
                              fill={colors[index % colors.length]}
                              fontSize={12}
                              fontWeight="bold"
                              textAnchor="start"
                            >
                              {`${parseFloat(kw).toFixed(2)} kW`}
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
    case "LRVP": {
      const XAxisLRVPProps = {
        dataKey: "head",
        label: {
          value: "Suction Pressure (mbar abs)",
          position: "insideBottomRight",
          offset: -2,
          style: { fontSize: 12 },
        },
        type: "number" as const,
        style: { fontSize: 12 },
      };

      const YAxisLRVPProps = {
        dataKey: "power",
        label: {
          value: "Power (kW)",
          angle: -90,
          position: "insideLeft",
          inset: -2,
          style: { fontSize: 12 },
        },
        type: "number" as const,
        style: { fontSize: 12 },
      };

      const uniqueKeys = [
        ...new Set(chartData.map((item) => `${item.rpm}${item.dry_sat}`)),
      ].filter((key) => key !== null && key !== "0" && key !== undefined && key !== "");

      const transformedData: {
        [key: string]: { head: number; power: number; label: string }[];
      } = uniqueKeys.reduce(
        (acc: Record<string, { head: number; power: number; label: string }[]>, key) => {
          if (key !== undefined) {
            acc[key] = chartData
              .filter(
                (item) =>
                  `${item.rpm}${item.dry_sat}` === key && item.head && item.kw,
              )
              .map((item) => ({
                head: Number(item.head),
                power: Number(item.kw),
                label: `${item.rpm} RPM, ${item.dry_sat}`,
              }))
              .sort((a, b) => a.head - b.head);
          }
          return acc;
        },
        {},
      );

      return (
        <ResponsiveContainer height={400}>
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...XAxisLRVPProps} />
            <YAxis {...YAxisLRVPProps} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const point = payload[0].payload;
                  return (
                    <div style={{ background: "white", border: "1px solid #ccc", padding: "8px 12px", borderRadius: 4, color: "black" }}>
                      <p style={{ fontWeight: "bold", marginBottom: 4 }}>{point.label}</p>
                      <p>Suction Pressure (mbar abs) : {point.head}</p>
                      <p>Power (kW) : {point.power}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {uniqueKeys.map((key, index) => {
              if (key) {
                const dataSeries = transformedData[key].filter(
                  (point) => !isNaN(point.power),
                );
                if (dataSeries.length === 0) return null;
                const tolerance = 0.001;
                const maxHead = Math.max(...dataSeries.map((p) => p.head));
                const maxHeadPoints = dataSeries.filter(
                  (p) => Math.abs(p.head - maxHead) < tolerance,
                );
                const maxHeadPoint =
                  maxHeadPoints.length > 0
                    ? maxHeadPoints.reduce((a, b) => (a.power > b.power ? a : b))
                    : null;
                const labelIndex = maxHeadPoint ? dataSeries.indexOf(maxHeadPoint) : -1;
                return (
                  <Scatter
                    key={key}
                    name={key}
                    data={dataSeries}
                    line
                    fill={scatter ? "none" : colors[index % colors.length]}
                    strokeWidth={2}
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      return (
                        <circle cx={cx} cy={cy} r={6} fill="transparent" stroke="none" />
                      );
                    }}
                  >
                    <LabelList
                      dataKey="label"
                      content={({ x, y, value, index: pointIndex }) => {
                        if (pointIndex === labelIndex) {
                          return (
                            <text
                              x={Number(x) + 10}
                              y={Number(y)}
                              fill={colors[index % colors.length]}
                              fontSize={12}
                              fontWeight="bold"
                              textAnchor="start"
                            >
                              {`${value}`}
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
