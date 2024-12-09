import { PumpDetailOut,LOVOut, ApiResponse, FetchDataResponse } from "@/types/index";
import { axiosInstance } from "../utils";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const addPumpDetail = async (pumpDetail): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.post(`${API_BASE_URL}/pumps`, pumpDetail);
  return response.data;
};

const getPumpDetailById = async (pumpId: number): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/pumps/${pumpId}`);
  return response.data;
};

const getAllPumpDetails = async (): Promise<FetchDataResponse<PumpDetailOut>> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/pumps`);
  return response.data;
};

const editPumpDetailById = async (pumpId: number, pumpDetail: PumpDetailIn): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.put(`${API_BASE_URL}/pumps/${pumpId}`, pumpDetail);
  return response.data;
};

const deletePumpDetailById = async (pumpId: number): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.delete(`${API_BASE_URL}/pumps/${pumpId}`);
  return response.data;
};

export const useGetPumpDetailById = (pumpId: number) => {
  return useQuery({
    queryKey: ["pump", pumpId],
    queryFn: () => getPumpDetailById(pumpId),
  });
};

export const useAddPumpDetail = () => {
  return useMutation({
    mutationFn: addPumpDetail,
  });
};

export const AddPumpListData = async(PumpDataForAdd: LOVOut): Promise<ApiResponse<LOVOut>> => {
  const response = await axiosInstance.post(`${API_BASE_URL}/pumps`, PumpDataForAdd);
  return response.data;
}

export const AddUnitListData = async(UnitDataForAdd: LOVOut): Promise<ApiResponse<LOVOut>> => {
  const response = await axiosInstance.post(`${API_BASE_URL}/pumps`, UnitDataForAdd);
  return response.data;
}
