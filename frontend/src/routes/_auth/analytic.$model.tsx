import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Combobox, ComboboxItemProps } from "@/components/common/ComboBoxTest";

import { HeadFlowGraph } from "@/components/chart/HeadFlowGraph";
import { FlowPowerGraph } from "@/components/chart/FlowPowerGraph";
import { NpshrFlowGraph } from "@/components/chart/NpshrFlowGraph";
import { EfficiencyHeadFlowGraph } from "@/components/chart/EfficiencyHeadFlowGraph";

const Analytic = () => {
  const { model } = Route.useParams();
  const [displayMode, setDisplayMode] = useState("line");

  const graphTypes: ComboboxItemProps[] = [
    { value: "line", label: "Show Lines Plot" },
    { value: "scatter", label: "Show Scatter Plot" },
  ];

  const onGrapgTypeChange = (value: string) => {
    setDisplayMode(value);
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <label htmlFor="displayMode" className="block text-sm font-medium text-gray-700">
            Setting
          </label>
          <Combobox items={graphTypes} searchable={false} onChange={onGrapgTypeChange} default_value="line" />
        </div>
        <div>
          <label htmlFor="pumpName" className="block text-sm font-medium text-gray-700">
            Factory Number
          </label>
          <select
            id="displayMode"
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="line">FAC-0068</option>
            <option value="dot">Dot</option>
          </select>
        </div>
        <div className="px-3">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <label className="block text-sm font-medium text-gray-700">{model}</label>
        </div>
      </div>
      <div className="flex flex-wrap">
        <FlowPowerGraph model={model} scatter={displayMode == "scatter" ? true : false} />
        <HeadFlowGraph model={model} scatter={displayMode == "scatter" ? true : false} />
        <NpshrFlowGraph model={model} scatter={displayMode == "scatter" ? true : false} />
        <EfficiencyHeadFlowGraph model={model} scatter={displayMode == "scatter" ? true : false} />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/analytic/$model")({
  component: Analytic,
});
