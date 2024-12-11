import {
  PumpDetailOut,
  LOVOut,
  ApiResponse,
  FetchDataResponse,
} from "@/types/index";
import { axiosInstance } from "../utils";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const addPumpDetail = async (
  pumpDetail
): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.post(
    `${API_BASE_URL}/pumps`,
    pumpDetail
  );
  return response.data;
};

const getPumpDetailById = async (
  pumpId: number
): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/pumps/${pumpId}`);
  return response.data;
};

const getAllPumpDetails = async (): Promise<
  FetchDataResponse<PumpDetailOut>
> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/pumps`);
  return response.data;
};

const editPumpDetailById = async (
  pumpId: number,
  pumpDetail: PumpDetailIn
): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.put(
    `${API_BASE_URL}/pumps/${pumpId}`,
    pumpDetail
  );
  return response.data;
};

const deletePumpDetailById = async (
  pumpId: number
): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await axiosInstance.delete(
    `${API_BASE_URL}/pumps/${pumpId}`
  );
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

export const AddPumpListData = async (
  PumpDataForAdd: LOVOut
): Promise<ApiResponse<LOVOut>> => {
  const response = await axiosInstance.post(
    `${API_BASE_URL}/pumps`,
    PumpDataForAdd
  );
  return response.data;
};

export const AddUnitListData = async (
  UnitDataForAdd: LOVOut
): Promise<ApiResponse<LOVOut>> => {
  const response = await axiosInstance.post(
    `${API_BASE_URL}/pumps`,
    UnitDataForAdd
  );
  return response.data;
};

/* New create by Kunakorn */
export const getAllUnitLOV = async (): Promise<LOVOut[]> => {
  try {
    const response = await axiosInstance.get("/pump-data/unit_lov");
    return response.data;
  } catch (error) {
    console.error("Error fetching unit LOV data:", error);
    throw new Error("Failed to fetch unit LOV data");
  }
};

export const getLOVById = async (id: string) => {
  const response = await axiosInstance.get(`/pump-data/lov/${id}`);
  return response.data;
};

export const createLOV = async (data: LOVOut) => {
  const response = await axiosInstance.post("/pump-data/lov", data);
  return response.data;
};

export const deleteLOV = async (id: string) => {
  const response = await axiosInstance.delete(`/pump-data/lov/${id}`);
  return response.data;
};

export const updateLOV = async ({ id, data }: { id: string; data: LOVOut }) => {
  const response = await axiosInstance.put(`/pump-data/lov/${id}`, data);
  return response.data;
};
