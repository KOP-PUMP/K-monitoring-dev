import {
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  LabelList,
  Tooltip,
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
    const uniqueImpDia = [
      ...new Set(chartData.map((item) => item.imp_dia?.slice(0, -3))),
    ].filter((dia) => dia !== null && dia === "0" && dia !== undefined);

    const transformedData = uniqueImpDia.reduce((acc, dia) => {
      acc[dia] = chartData
        .filter((item) => item.imp_dia?.slice(0, -3) === dia)
        .map((item) => ({
          flow: parseFloat(item.flow ?? null),
          npshr: parseFloat(item.npshr ?? null),
        }))
        .sort((a, b) => a.flow - b.flow); // Sort by flow
      return acc;
    }, {});

    return (
      <ResponsiveContainer height={400}>
        <ComposedChart title="Npshr Graph" data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          <Tooltip />

          {uniqueImpDia.map((dia, index) => {
            let dataSeries = transformedData[dia];
            dataSeries = dataSeries.filter((point: any) => !isNaN(point.npshr));
            const lastDataPointIndex = dataSeries.length - 1; // Ensure we get last index
            return (
              <Line
                key={dia}
                connectNulls
                type="monotone"
                dataKey="npshr"
                stroke={scatter ? "none" : colors[index % colors.length]}
                strokeWidth={2}
                name={`npshr`}
                data={dataSeries}
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
          })}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return null;
};
