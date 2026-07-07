import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import {
  /* useGetFactoryCurveNumber, */
  useGetPECAllFactoryCurve,
  useGetPECFactoryCurveData,
} from "@/hook/factory_curve/factory_curve";
import { PECFactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";
import { HeadFlowGraph } from "@/components/chart/HeadFlowGraph";
import { FlowPowerGraph } from "@/components/chart/FlowPowerGraph";
import { NpshrFlowGraph } from "@/components/chart/NpshrFlowGraph";

const FactoryCurve = () => {
  const [factoryNumber, setFactoryNumber] = useState<string>("");
  /* const [factoryNumberOptions, setFactoryNumberOptions] = useState<
    ComboboxItemProps[]
  >([]); */
  const [modelFormatType, setModelFormatType] = useState<ComboboxItemProps[]>(
    [],
  );
  const [displayMode, setDisplayMode] = useState("line");
  const [selectedModelFormat, setSelectedModelFormat] = useState<string | null>(
    null,
  );
  const [filterFactoryCurveData, setFilterFactoryCurveData] = useState<
    ComboboxItemProps[]
  >([]);
  /* const [model, setModel] = useState(""); */

  /* const {data : factoryCurveData} = useGetFactoryCurveData(factoryNumber); */
  /* const { data: factoryCurveNumber } = useGetFactoryCurveNumber(); */
  const { data: pecFactoryCurveData } = useGetPECAllFactoryCurve();

  useEffect(() => {
    if (pecFactoryCurveData) {
      const uniqueModelFormats: string[] = [];
      pecFactoryCurveData.forEach((item: PECFactoryCurveDataResponse) => {
        const model_format = item.curve_format;
        if (!uniqueModelFormats.includes(model_format)) {
          uniqueModelFormats.push(model_format);
        }
      });
      setModelFormatType(
        uniqueModelFormats.map((format) => ({ value: format, label: format })),
      );
      setFilterFactoryCurveData(
        pecFactoryCurveData.map((data: PECFactoryCurveDataResponse) => ({
          value: data.fac_number,
          label: data.model,
        })),
      );
    }
  }, [pecFactoryCurveData]);

  /* const {
    data: factoryCurveData,
    isLoading,
    isError,
  } = useGetFactoryCurveData(null, null, factoryNumber); */

  const {
    data: factoryCurveData,
    isLoading,
    isError,
  } = useGetPECFactoryCurveData(factoryNumber);

  const graphTypes: ComboboxItemProps[] = [
    { value: "line", label: "Show Lines Plot" },
    { value: "scatter", label: "Show Scatter Plot" },
  ];

 /*  useEffect(() => {
    if (factoryCurveNumber) {
      const mappedData = factoryCurveNumber.map((item) => ({
        value: item.fac_number || "",
        label: item.model || "",
      }));
      setFactoryNumberOptions(mappedData);
    }
  }, [factoryCurveNumber]); */

  useEffect(() => {
    if (selectedModelFormat && pecFactoryCurveData) {
      const filteredData = pecFactoryCurveData.filter(
        (item: PECFactoryCurveDataResponse) =>
          item.curve_format === selectedModelFormat,
      );
      setFilterFactoryCurveData(
        filteredData.map((data: PECFactoryCurveDataResponse) => ({
          value: data.fac_number,
          label: data.model,
        })),
      );
    }
  }, [selectedModelFormat]);

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
          Model Format
        </label>
        <Combobox
          items={modelFormatType}
          label={selectedModelFormat || "Select"}
          onChange={(selectedValue) => {
            if (selectedValue == selectedModelFormat) {
              setSelectedModelFormat(null);
            } else {
              setSelectedModelFormat(selectedValue);
            }
            setFactoryNumber("");
          }}
          className="min-w-[180px] mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
        {selectedModelFormat === null || selectedModelFormat === "" ? (
          ""
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700">
              Factory Number 
            </label>
            <Combobox
              items={filterFactoryCurveData}
              value={factoryNumber}
              label="Select"
              onChange={(selectedValue) => {
                if (selectedValue == factoryNumber) {
                  setFactoryNumber("");
                } else {
                  setFactoryNumber(selectedValue);
                }
              }}
              className="min-w-[180px] mt-1  pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </>
        )}
      </div>
      <div className="font-semibold text-xl text-gray-700">
        {/* <label className="block text-sm font-medium text-gray-700">Model</label>
        <label className="block text-sm font-medium text-gray-700">
          {factoryNumber}
        </label> */}
        {factoryNumber ? (
          <h3>{`Factory Number : ${factoryNumber}`}</h3>
        ) : (
          <h3>Model : Please select</h3>
        )}
        <h3></h3>
      </div>
      <div className="w-full">
        {!factoryCurveData && !isLoading && !isError ? (
          <p>Please select a Model Format and Model</p>
        ) : factoryCurveData ? (
          <div className="w-full flex flex-col">
            <HeadFlowGraph
              chartData={factoryCurveData}
              format={selectedModelFormat}
              scatter={displayMode == "scatter" ? true : false}
              isLoading={isLoading}
              isError={isError}
            />
            <FlowPowerGraph
              chartData={factoryCurveData}
              format={selectedModelFormat}
              scatter={displayMode == "scatter" ? true : false}
              isLoading={isLoading}
              isError={isError}
            />
            <NpshrFlowGraph
              chartData={factoryCurveData}
              format={selectedModelFormat}
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
