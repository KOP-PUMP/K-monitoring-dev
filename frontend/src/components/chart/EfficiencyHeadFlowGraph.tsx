import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useEfficiencyHeadFlowData } from "@/api/chart";

export interface EfficiencyHeadFlowGraphProps {
  model: string;
}

export const EfficiencyHeadFlowGraph = ({ model }: EfficiencyHeadFlowGraphProps) => {
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
    return (
      <ResponsiveContainer width="50%" height={400} className="w-1/2 p-2">
        <ComposedChart title="KW Graph" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="head"
            stroke="#264653"
            strokeWidth={3}
            name="46%"
            data={chartData.filter((item) => item.eff === 46)}
            dot={false}></Line>
          {/* <Line
              type="monotone"
              dataKey="head"
              stroke="#2a9d8f"
              strokeWidth={3}
              name="50%"
              data={chartData.filter((item) => item.eff === 50)}
              dot={false}></Line> */}
          <Line
            type="monotone"
            dataKey="head"
            stroke="#e9c46a"
            strokeWidth={3}
            name="54%"
            data={chartData.filter((item) => item.eff === 54)}
            dot={false}></Line>
          <Line
            type="monotone"
            dataKey="head"
            stroke="#f4a261"
            strokeWidth={3}
            name="56%"
            data={chartData.filter((item) => item.eff === 56)}
            dot={false}></Line>
          <Line
            type="monotone"
            dataKey="head"
            stroke="#e76f51"
            strokeWidth={3}
            name="58%"
            data={chartData.filter((item) => item.eff === 58)}
            dot={false}></Line>
          <Line
            type="monotone"
            dataKey="head"
            stroke="#e76f51"
            strokeWidth={3}
            name="60%"
            data={chartData.filter((item) => item.eff === 60)}
            dot={false}></Line>
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }
};
