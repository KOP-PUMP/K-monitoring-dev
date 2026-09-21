import {
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  ResponsiveContainer,
  ScatterChart,
  LabelList,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";
import { ScatterProps } from "recharts";

export interface HeadFlowGraphProps {
  chartData: FactoryCurveDataResponse[];
  format?: string | null;
  scatter?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  // Shades the recommended operating-flow band (e.g. 0.8x-1.1x BEP flow),
  // same as the shaded region on the generated PDF report's curve chart.
  // Only meaningful for the flow-on-X formats (KDIN/KOP9196/KISO).
  recommendedRange?: { flow_min: number; flow_max: number } | null;
}

export const HeadFlowGraph = ({
  chartData,
  format,
  scatter,
  isLoading,
  isError,
  recommendedRange,
}: HeadFlowGraphProps) => {
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
    case "KOP9196":
    case "KISO": {
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

      const uniqueImpDia = [
        ...new Set(
          chartData.map((item) => item.imp_dia && item.imp_dia?.split(".")[0]),
        ),
      ].filter(
        (dia) => dia !== null && dia !== "0" && dia !== undefined && dia !== "",
      );

      const uniqueEff = [...new Set(chartData.map((item) => item.eff))].filter(
        (eff) => eff !== null && eff !== "0" && eff !== undefined && eff !== "",
      );

      const transformedDataEff: {
        [key: string]: { flow: number; head: number }[];
      } = uniqueEff.reduce(
        (acc: Record<string, { flow: number; head: number }[]>, eff) => {
          if (eff !== undefined) {
            acc[eff] = chartData
              .filter((item) => item.eff === eff)
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

      const transformedDataImp: {
        [key: string]: { flow: number; head: number }[];
      } = uniqueImpDia.reduce(
        (acc: Record<string, { flow: number; head: number }[]>, dia) => {
          if (dia) {
            acc[dia] = chartData
              .filter(
                (item) =>
                  item.imp_dia?.split(".")[0] === dia && item.head && item.flow,
              )
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

      const pointData = chartData.filter(
        (item) => item.point_label && item.point_flow && item.point_head,
      );

      return (
        <ResponsiveContainer height={400}>
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...XAxisDefaultProps} />
            <YAxis {...YAxisDefaultProps} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            {recommendedRange && (
              <ReferenceArea
                x1={recommendedRange.flow_min}
                x2={recommendedRange.flow_max}
                fill="#22c55e"
                fillOpacity={0.08}
                stroke="#22c55e"
                strokeOpacity={0.3}
                strokeDasharray="3 3"
                label={{
                  value: "Recommended",
                  position: "insideTop",
                  fill: "#16a34a",
                  fontSize: 11,
                }}
              />
            )}
            {uniqueImpDia.map((dia, index) => {
              if (dia) {
                const dataSeries = transformedDataImp[dia].filter(
                  (point: any) => !isNaN(point.head),
                );
                const tolerance = 0.001;
                const maxFlow = Math.max(...dataSeries.map((p) => p.flow));
                const maxFlowPoints = dataSeries.filter(
                  (p) => Math.abs(p.flow - maxFlow) < tolerance,
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
                      dataKey="head"
                      content={({ x, y, index: pointIndex }) => {
                        if (pointIndex === maxFlowMaxHeadIndex) {
                          return (
                            <text
                              x={Number(x) + 10}
                              y={Number(y)}
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
            {uniqueEff.map((eff, index) => {
              if (eff !== undefined) {
                const dataSeries = transformedDataEff[eff].filter(
                  (point: any) => !isNaN(point.head),
                );
                if (dataSeries.length === 0) return null;
                const tolerance = 0.001;
                const maxFlow = Math.max(...dataSeries.map((p) => p.flow));
                const maxFlowPoints = dataSeries.filter(
                  (p) => Math.abs(p.flow - maxFlow) < tolerance,
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
                    shape={(props: ScatterProps) => (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={2}
                        fill={colors[index % colors.length]}
                      />
                    )}
                  >
                    <LabelList
                      dataKey="head"
                      content={({ x, y, index: pointIndex }) => {
                        if (pointIndex === maxFlowMaxHeadIndex) {
                          return (
                            <text
                              x={Number(x) + 10}
                              y={Number(y)}
                              fill={colors[index % colors.length]}
                              fontSize={12}
                              fontWeight="bold"
                              textAnchor="start"
                            >
                              {`${eff}%`}
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
            {pointData.map((point) => {
              const data = [
                {
                  flow: point.point_flow,
                  head: point.point_head,
                  label: point.point_label,
                },
              ];
              return (
                <>
                  <Scatter
                    key={point.point_label}
                    dataKey="head"
                    name={point.point_label}
                    data={data}
                    shape={(props: ScatterProps) => (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill={
                          point.point_label?.includes("Flow")
                            ? "red"
                            : point.point_label?.includes("BEP")
                              ? "blue"
                              : "green"
                        }
                      />
                    )}
                  >
                    <LabelList
                      dataKey="label"
                      content={({ x, y, value }) => (
                        <text
                          x={Number(x) + 10}
                          y={Number(y)}
                          fill={
                            point.point_label?.includes("Flow")
                              ? "red"
                              : point.point_label?.includes("BEP")
                                ? "blue"
                                : "green"
                          }
                          fontSize={12}
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          {value}
                        </text>
                      )}
                    />
                  </Scatter>
                  <ReferenceLine
                    key={`vertical-line-${point.point_label}`}
                    x={Number(
                      point &&
                        !point.point_label?.includes("BEP") &&
                        data[0].flow,
                    )}
                    stroke={
                      point.point_label?.includes("Flow") ? "red" : "green"
                    }
                    strokeWidth={3}
                    strokeDasharray="3 3"
                  />
                </>
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      );
    }
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
        dataKey: "flow",
        label: {
          value: "Suction Capacity (m3/hr)",
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
      ].filter(
        (flow) =>
          flow !== null && flow !== "0" && flow !== undefined && flow !== "",
      );

      const transformedData: {
        [key: string]: { flow: number; head: number }[];
      } = uniqueKeys.reduce(
        (acc: Record<string, { flow: number; head: number }[]>, key) => {
          if (key !== undefined) {
            acc[key] = chartData
              .filter(
                (item) =>
                  `${item.rpm}${item.dry_sat}` === key &&
                  item.head &&
                  item.flow,
              )
              .map((item) => ({
                flow: Number(item.flow),
                head: Number(item.head),
                label: `${item.rpm} RPM, ${item.dry_sat}`,
              }))
              .sort((a, b) => a.head - b.head);
          }
          return acc;
        },
        {},
      );

      const pointData = chartData.filter(
        (item) => item.point_flow && item.point_head,
      );

      return (
        <ResponsiveContainer height={400}>
          <ScatterChart data={pointData}>
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
                      <p>Suction Capacity (m3/hr) : {point.flow}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {uniqueKeys.map((key, index) => {
              if (key) {
                const dataSeries = transformedData[key].filter(
                  (point: any) => !isNaN(point.head),
                );
                if (dataSeries.length === 0) return null;
                const tolerance = 0.001;
                const maxHead = Math.max(...dataSeries.map((p) => p.head));
                const maxHeadPoints = dataSeries.filter(
                  (p) => Math.abs(p.head - maxHead) < tolerance,
                );
                const maxHeadMaxFlowPoint =
                  maxHeadPoints.length > 0
                    ? maxHeadPoints.reduce((a, b) => (a.flow > b.flow ? a : b))
                    : null;
                const maxFlowMaxHeadIndex = maxHeadMaxFlowPoint
                  ? dataSeries.indexOf(maxHeadMaxFlowPoint)
                  : -1;
                return (
                  <Scatter
                    key={key}
                    name={key}
                    data={transformedData[key]}
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
                      dataKey="label"
                      content={({ x, y, value, index: pointIndex }) => {
                        if (pointIndex === maxFlowMaxHeadIndex) {
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
            {pointData.map((point) => {
              const data = [
                {
                  flow: point.point_flow,
                  head: point.point_head,
                  label: `${point.rpm} RPM, ${point.dry_sat}`,
                },
              ];
              return (
                <>
                  <Scatter
                    key={point.point_label}
                    dataKey="head"
                    name={point.point_label}
                    data={data}
                    shape={(props: ScatterProps) => (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill={
                          point.point_label?.includes("Head")
                            ? "red"
                            : point.point_label?.includes("BEP")
                              ? "blue"
                              : "green"
                        }
                      />
                    )}
                  >
                    <LabelList
                      dataKey="label"
                      content={({ x, y, value }) => (
                        <text
                          x={Number(x) + 10}
                          y={Number(y)}
                          fill={
                            point.point_label?.includes("Head")
                              ? "red"
                              : point.point_label?.includes("BEP")
                                ? "blue"
                                : "green"
                          }
                          fontSize={12}
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          {value}
                        </text>
                      )}
                    />
                  </Scatter>
                </>
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      );
    }
  }

  return null;
};
