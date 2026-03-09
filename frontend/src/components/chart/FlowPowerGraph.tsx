import {
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Legend,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  LabelList,
} from "recharts";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";

export interface FlowPowerGraphProps {
  chartData: FactoryCurveDataResponse[];
  scatter?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}

export const FlowPowerGraph = ({
  chartData,
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

  if (chartData) {
    const colors = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];

    const uniqueImpDia = [
      ...new Set(
        chartData.map((item) => item.imp_dia && item.imp_dia?.split(".")[0]),
      ),
    ].filter(
      (dia) => dia !== null && dia !== "0" && dia !== undefined && dia !== "",
    );


    const transformedDataImp = uniqueImpDia.reduce((acc, dia) => {
      acc[dia] = chartData
        .filter(
          (item) => item.imp_dia?.split(".")[0] === dia && item.kw && item.flow,
        )
        .map((item) => ({
          flow: parseFloat(item.flow),
          power: parseFloat(item.kw),
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
            dataSeries = dataSeries.filter((point: any) => !isNaN(point.power));
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
                <LabelList
                  dataKey="power"
                  content={({ x, y, index: pointIndex }) => {
                    if (pointIndex && pointIndex === lastDataPointIndex) {
                      return (
                        <text
                          x={x + 10}
                          y={y + 0}
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
          })}
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  return null;
};
