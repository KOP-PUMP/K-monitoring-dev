import { axiosInstance } from "./utils";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const fetchDropdownData = async () => {
  return axiosInstance.get(`${API_BASE_URL}/dropdown`).then((res) => res.data);
};

const fetchPumpTypes = async () => {
  return axiosInstance.get(`${API_BASE_URL}/dropdown/types`).then((res) => res.data);
};

const fetchPumpDesign = async (pump_type: string) => {
  return axiosInstance.get(`${API_BASE_URL}/dropdown/designs/${pump_type}`).then((res) => res.data);
};

export const useDropdownData = () => {
  return useQuery({
    queryKey: ["dropdown"],
    queryFn: fetchDropdownData,
  });
};

export const useDropdownTypes = () => {
  return useQuery({
    queryKey: ["dropdown", "types"],
    queryFn: fetchPumpTypes,
  });
};

export const useDropdownDesigns = (pump_type: string) => {
  return useQuery({
    queryKey: ["dropdown", "designs", pump_type],
    queryFn: () => fetchPumpDesign(pump_type),
  });
};
