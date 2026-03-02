import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import {
  useGetFactoryCurveData,
  useGetFactoryCurveNumber,
} from "@/hook/factory_curve/factory_curve";
import { HeadFlowGraph } from "@/components/chart/HeadFlowGraph";
import { FlowPowerGraph } from "@/components/chart/FlowPowerGraph";
import { NpshrFlowGraph } from "@/components/chart/NpshrFlowGraph";
import { EfficiencyHeadFlowGraph } from "@/components/chart/EfficiencyHeadFlowGraph";
import { set } from "zod";

const FactoryCurve = () => {
  const [factoryNumber, setFactoryNumber] = useState<string>("");
  const [factoryNumberOptions, setFactoryNumberOptions] = useState<
    ComboboxItemProps[]
  >([]);
  const [displayMode, setDisplayMode] = useState("line");
  /* const [model, setModel] = useState(""); */

  /* const {data : factoryCurveData} = useGetFactoryCurveData(factoryNumber); */
  const { data: factoryCurveNumber } = useGetFactoryCurveNumber();
  const {
    data: factoryCurveData,
    isLoading,
    isError,
  } = useGetFactoryCurveData(null, null, factoryNumber);

  const graphTypes: ComboboxItemProps[] = [
    { value: "line", label: "Show Lines Plot" },
    { value: "scatter", label: "Show Scatter Plot" },
  ];

  useEffect(() => {
    if (factoryCurveNumber) {
      const mappedData = factoryCurveNumber.map((item) => ({
        value: item.fac_number || "",
        label: item.model || "",
      }));
      setFactoryNumberOptions(mappedData);
    }
  }, [factoryCurveNumber]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Factory Curve</h2>
      </div>
      <div className="flex gap-4 items-center w-full">
        <label className="block text-sm font-medium text-gray-700">
          Graph Type
        </label>
        <Combobox
          items={graphTypes}
          label={displayMode}
          onChange={(selectedValue) => setDisplayMode(selectedValue)}
          className="min-w-[180px] mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
        <label className="block text-sm font-medium text-gray-700">
          Factory Number
        </label>
        <Combobox
          items={factoryNumberOptions}
          onChange={(selectedValue) => {
            setFactoryNumber(selectedValue);
            /* const selected_label = factoryNumberOptions.filter((item) => {
              return item.value === selectedValue;
            });
            setModel(selected_label); */
          }}
          className="min-w-[180px] mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      <div className="font-semibold text-xl text-gray-700">
        {/* <label className="block text-sm font-medium text-gray-700">Model</label>
        <label className="block text-sm font-medium text-gray-700">
          {factoryNumber}
        </label> */}
        {factoryNumber ? (
          <h3>{`Model : ${factoryNumberOptions.find((item) => item.value === factoryNumber)?.label} / ${factoryNumber}`}</h3>
        ) : (
          <h3>Model : Please select</h3>
        )}
        <h3></h3>
      </div>
      <div className="w-full">
        {!factoryCurveData && !isLoading && !isError ? (
          <p>Please select a factory number</p>
        ) : factoryCurveData ? (
          <div className="w-full flex flex-col">
            <HeadFlowGraph
              chartData={factoryCurveData}
              scatter={displayMode == "scatter" ? true : false}
              isLoading={isLoading}
              isError={isError}
            />
            <FlowPowerGraph
              chartData={factoryCurveData}
              scatter={displayMode == "scatter" ? true : false}
              isLoading={isLoading}
              isError={isError}
            />
            <NpshrFlowGraph
              chartData={factoryCurveData}
              scatter={displayMode == "scatter" ? true : false}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          isError && <p>Error fetching data</p>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/analytic/factory_curve")({
  component: FactoryCurve,
});
