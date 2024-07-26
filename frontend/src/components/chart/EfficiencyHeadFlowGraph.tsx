import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useEfficiencyHeadFlowData } from "@/api/chart";

export interface EfficiencyHeadFlowGraphProps {
  model: string;
  scatter?: boolean;
}

export const EfficiencyHeadFlowGraph = ({ model, scatter = false }: EfficiencyHeadFlowGraphProps) => {
  const { data: chartData, isLoading, isError } = useEfficiencyHeadFlowData(model);

  const XAxisDefaultProps = {
    dataKey: "flow",
    label: { value: "Flow (m3/hr)", position: "insideBottomRight", offset: -2 },
    type: "number" as const,
    domain: [0, 14],
  };

  const YAxisDefaultProps = {
    label: { value: "Head", angle: -90, position: "insideLeft", offset: -2 },
    type: "number" as const,
    domain: [0, 0.3],
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
    const uniqueEfficiencies = [...new Set(chartData.map((item) => item.eff))];

    return (
      <ResponsiveContainer width="50%" height={400} className="w-1/2 p-2">
        <ComposedChart title="KW Graph" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          <Legend verticalAlign="top" height={36} />
          {uniqueEfficiencies.map((eff, index) => {
            const colors = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
            return (
              <Line
                key={eff}
                type="monotone"
                dataKey="head"
                stroke={scatter ? "none" : colors[index % colors.length]}
                strokeWidth={3}
                name={`${eff}%`}
                data={chartData.filter((item) => item.eff === eff)}
                dot={scatter ? { stroke: colors[index % colors.length], strokeWidth: 1.2 } : false}
              />
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
