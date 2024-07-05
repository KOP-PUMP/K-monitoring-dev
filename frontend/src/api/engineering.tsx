import { PumpDetailIn, PumpDetailOut } from "@/types/pumps";
import { ApiResponse, FetchDataResponse } from "@/types/response";
import { fetchWithAuth } from "./utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const addPumpDetail = async (pumpDetail: PumpDetailIn): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pumpDetail),
  });
  return response;
};

const getPumpDetailById = async (pumpId: number): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps/${pumpId}`);
  return response;
};

const getAllPumpDetails = async (): Promise<ApiResponse<FetchDataResponse<PumpDetailOut[]>>> => {
  const response = await fetchWithAuth<FetchDataResponse<PumpDetailOut[]>>(`${API_BASE_URL}/pumps`);
  return response;
};

const editPumpDetailById = async (pumpId: number, pumpDetail: PumpDetailIn): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps/${pumpId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pumpDetail),
  });
  return response;
};

const deletePumpDetailById = async (pumpId: number): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps/${pumpId}`, {
    method: "DELETE",
  });
  return response;
};

export { addPumpDetail, getPumpDetailById, getAllPumpDetails, editPumpDetailById, deletePumpDetailById };
