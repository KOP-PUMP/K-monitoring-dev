import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useNpshrFlowData } from "@/api/chart";

export interface NpshrFlowGraphProps {
  model: string;
}

export const NpshrFlowGraph = ({ model }: NpshrFlowGraphProps) => {
  const { data: chartData, isLoading, isError } = useNpshrFlowData(model);

  const XAxisDefaultProps = {
    dataKey: "flow",
    label: { value: "Flow (m3/hr)", position: "insideBottomRight", offset: -5 },
    type: "number" as const,
    domain: [0, 14],
  };

  const YAxisDefaultProps = {
    label: { value: "NPSHR (m)", angle: -90, position: "insideLeft" },
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
            dataKey="npshr"
            stroke="#264653"
            strokeWidth={3}
            name="0mm"
            data={chartData.filter((item) => item.imp_dia === 0)}
            dot={false}></Line>
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }
};
