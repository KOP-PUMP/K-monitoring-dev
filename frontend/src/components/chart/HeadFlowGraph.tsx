import {
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  LabelList,
} from "recharts";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";
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
    label: { value: "Flow (m3/hr)", position: "insideBottomRight", offset: -2 ,style: { fontSize: 12 }},
    type: "number" as const,
    style: { fontSize: 12 },
  };

  const YAxisDefaultProps = {
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
      ...new Set(chartData.map((item) => item.imp_dia?.slice(0, -3))),
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
          flow: parseFloat(item.flow ?? null),
          head: parseFloat(item.head ?? null),
        }))
        .sort((a, b) => a.flow - b.flow);
      return acc;
    }, {});

    const transformedDataImp = uniqueImpDia.reduce((acc, dia) => {
      acc[dia] = chartData
        .filter(
          (item) => item.imp_dia?.slice(0, -3) === dia && item.head !== null
        )
        .map((item) => ({
          flow: parseFloat(item.flow),
          head: parseFloat(item.head),
        }))
        .sort((a, b) => a.flow - b.flow); // Sort by flow
      return acc;
    }, {});

    console.log(transformedDataEff);
    console.log(transformedDataImp);

    return (
      <ResponsiveContainer height={400}>
        <ComposedChart title="Head Graph" data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          {uniqueImpDia.map((dia, index) => {
            let dataSeries = transformedDataImp[dia];
            dataSeries = dataSeries.filter((point: any) => !isNaN(point.head));
            const lastDataPointIndex = dataSeries.length - 1; // Ensure we get last index
            return (
              <Line
                key={dia}
                connectNulls
                type="monotone"
                dataKey="head"
                stroke={scatter ? "none" : colors[index % colors.length]}
                strokeWidth={2}
                name={`${dia}mm`}
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
                  dataKey="head"
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
                          {`${dia}mm`}
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Line>
            );
          })}
          {uniqueEff.map((eff, index) => {
            let dataSeries = transformedDataEff[eff];
            dataSeries = dataSeries.filter((point: any) => !isNaN(point.head));
            const maxHeadIndex = dataSeries.reduce(
              (maxIdx, point, i, arr) =>
                point.head > arr[maxIdx].head ? i : maxIdx,
              0
            );
            return (
              <Scatter
                key={eff}
                type="monotone"
                dataKey="head"
                name={`${eff}%`}
                data={dataSeries}
                shape={(props) => (
                  <circle cx={props.cx} cy={props.cy} r={2} fill="black" />
                )}
              >
                <LabelList
                  dataKey="head"
                  content={({ x, y, index: pointIndex }) => {
                    if (pointIndex === maxHeadIndex) {
                      return (
                        <text
                          x={x + 5} // Slightly shift to the right
                          y={y - 5}
                          fill={colors[0]} // Match label color with the line
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
