import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useNpshrFlowData } from "@/api/chart";

export interface NpshrFlowGraphProps {
  model: string;
  scatter?: boolean;
}

export const NpshrFlowGraph = ({ model, scatter = false }: NpshrFlowGraphProps) => {
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
    const uniqueImpDiameters = [...new Set(chartData.map((item) => item.imp_dia))];
    const colors = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];

    return (
      <ResponsiveContainer width="50%" height={400} className="w-1/2 p-2">
        <ComposedChart title="QH Graph" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          <Legend verticalAlign="top" height={36} />
          {uniqueImpDiameters.map((imp_dia, index) => (
            <Line
              key={imp_dia}
              type="monotone"
              dataKey="npshr"
              stroke={scatter ? "none" : colors[index % colors.length]}
              strokeWidth={3}
              name={`${imp_dia}mm`}
              data={chartData.filter((item) => item.imp_dia === imp_dia)}
              dot={scatter ? { stroke: colors[index % colors.length], strokeWidth: 1.2 } : false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return null;
};
