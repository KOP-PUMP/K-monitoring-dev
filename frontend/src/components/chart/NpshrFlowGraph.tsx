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
  scatter?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}

export const NpshrFlowGraph = ({
  chartData,
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
      value: "NPSHR (m)",
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

    const filteredChartData = chartData
      .filter((point) => point.npshr !== "" && point.flow !== "")
      .sort((a, b) => Number(a.flow) - Number(b.flow));
    const transformedData = filteredChartData.map((point) => ({
      flow: Number(point.flow),
      npshr: Number(point.npshr),
    }));

    const maxFlow = Math.max(...transformedData.map((p) => p.flow));
    const tolerance = 0.001;
    const maxFlowPoints = transformedData.filter(
              (p) => Math.abs(p.flow - maxFlow) < tolerance
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
              const { cx, cy} = props;
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
                if (pointIndex === maxFlowMaxNpshrIndex) {
                  return (
                    <text
                      x={Number(x) + 10}
                      y={Number(y) + 0}
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
          {/* {uniqueImpDia.map((dia, index) => {
            let dataSeries = transformedData[dia];
            dataSeries = dataSeries.filter((point: any) => !isNaN(point.npshr));
            const lastDataPointIndex = dataSeries.length - 1; // Ensure we get last index
            return (
              <Line
                key={dia}
                connectNulls
                name={`npshr`}
                data={dataSeries}
                type="monotone"
                dataKey="npshr"
                stroke={scatter ? "none" : colors[index % colors.length]}
                strokeWidth={2}
                dot={
                  scatter
                    ? {
                        stroke: colors[index % colors.length],
                        strokeWidth: 0.5,
                      }
                    : false
                }
              >
                <LabelList
                  dataKey="npshr"
                  content={({ x, y, index: pointIndex }) => {
                    if (pointIndex && pointIndex === lastDataPointIndex) {
                      return (
                        <text
                          x={x + 10} // Slightly shift to the right
                          y={y + 5}
                          fill={colors[index % colors.length]} // Match label color with the line
                          fontSize={12}
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          {`npshr`}
                        </text>
                      );
                    }

                    return null;
                  }}
                />
              </Line>
            );
          })} */}
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return null;
};
