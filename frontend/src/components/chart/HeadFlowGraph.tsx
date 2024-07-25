import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useHeadFlowData } from "@/api/chart";

export interface HeadFlowGraphProps {
  model: string;
}

export const HeadFlowGraph = ({ model }: HeadFlowGraphProps) => {
  const { data: chartData, isLoading, isError } = useHeadFlowData(model);

  const XAxisDefaultProps = {
    dataKey: "flow",
    label: { value: "Flow (m3/hr)", position: "insideBottomRight", offset: -5 },
    type: "number" as const,
    domain: [0, 14],
  };

  const YAxisDefaultProps = {
    label: { value: "Head (m)", angle: -90, position: "insideLeft" },
    type: "number" as const,
    domain: [0, 7],
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
        <ComposedChart title="QH Graph" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="head"
            stroke="#264653"
            strokeWidth={3}
            name="100mm"
            data={chartData.filter((item) => item.imp_dia === 100)}
            dot={false}></Line>
          <Line
            type="monotone"
            dataKey="head"
            stroke="#2a9d8f"
            strokeWidth={3}
            name="110mm"
            data={chartData.filter((item) => item.imp_dia === 110)}
            dot={false}></Line>
          <Line
            type="monotone"
            dataKey="head"
            stroke="#e9c46a"
            strokeWidth={3}
            name="120mm"
            data={chartData.filter((item) => item.imp_dia === 120)}
            dot={false}></Line>
          <Line
            type="monotone"
            dataKey="head"
            stroke="#f4a261"
            strokeWidth={3}
            name="130mm"
            data={chartData.filter((item) => item.imp_dia === 130)}
            dot={false}></Line>
          <Line
            type="monotone"
            dataKey="head"
            stroke="#e76f51"
            strokeWidth={3}
            name="139mm"
            data={chartData.filter((item) => item.imp_dia === 139)}
            dot={false}></Line>
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }
};
