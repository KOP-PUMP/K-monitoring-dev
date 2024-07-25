import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useFlowPowerData } from "@/api/chart";

export interface FlowPowerGraphProps {
  model: string;
  scatter?: boolean;
}

export const FlowPowerGraph = ({ model, scatter = false }: FlowPowerGraphProps) => {
  const { data: chartData, isLoading, isError } = useFlowPowerData(model);

  const XAxisDefaultProps = {
    dataKey: "flow",
    label: { value: "Flow (m3/hr)", position: "insideBottomRight", offset: -2 },
    type: "number" as const,
    domain: [0, 14],
  };

  const YAxisDefaultProps = {
    label: { value: "Power (kW)", angle: -90, position: "insideLeft", offset: -2 },
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

  if (isError) {
    return <div>Error</div>;
  }

  if (chartData) {
    const colors = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
    const uniqueImpDia = [...new Set(chartData.map((item) => item.imp_dia))];

    return (
      <ResponsiveContainer width="50%" height={400} className="w-1/2 p-2">
        <ComposedChart title="KW Graph" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...XAxisDefaultProps} />
          <YAxis {...YAxisDefaultProps} />
          <Legend verticalAlign="top" height={36} />
          {uniqueImpDia.map((dia, index) => (
            <Line
              key={dia}
              type="monotone"
              dataKey="kw"
              stroke={scatter ? "none" : colors[index % colors.length]}
              strokeWidth={3}
              name={`${dia}mm`}
              data={chartData.filter((item) => item.imp_dia === dia)}
              dot={scatter ? { stroke: colors[index % colors.length], strokeWidth: 1.2 } : false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return null;
};
