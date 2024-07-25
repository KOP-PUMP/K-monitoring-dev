import { EffHeadFlowChartData, FlowPowerChartData, HeadFlowChartData, NPSHRFlowChartData } from "@/types/chart";
import { axiosInstance } from "./utils";
import { useQuery } from "@tanstack/react-query";

const fetchFlowPowerData = async (model: string) => {
  const { data } = await axiosInstance.get<FlowPowerChartData[]>(`/chart/powerflow/${model}`);
  return data;
};

const fetchHeadFlowData = async (model: string) => {
  const { data } = await axiosInstance.get<HeadFlowChartData[]>(`/chart/headflow/${model}`);
  return data;
};

const fetchNpshrFlowData = async (model: string) => {
  const { data } = await axiosInstance.get<NPSHRFlowChartData[]>(`/chart/npshrflow/${model}`);
  return data;
};

const fetchEfficiencyHeadFlowData = async (model: string) => {
  const { data } = await axiosInstance.get<EffHeadFlowChartData[]>(`/chart/efficiencyheadflow/${model}`);
  return data;
};

export const useFlowPowerData = (model: string) => {
  return useQuery({ queryKey: ["powerFlowData", { model }], queryFn: () => fetchFlowPowerData(model) });
};

export const useHeadFlowData = (model: string) => {
  return useQuery({ queryKey: ["headFlowData", { model }], queryFn: () => fetchHeadFlowData(model) });
};

export const useNpshrFlowData = (model: string) => {
  return useQuery({ queryKey: ["npshrFlowData", { model }], queryFn: () => fetchNpshrFlowData(model) });
};

export const useEfficiencyHeadFlowData = (model: string) => {
  return useQuery({
    queryKey: ["efficiencyHeadFlowData", { model }],
    queryFn: () => fetchEfficiencyHeadFlowData(model),
  });
};
