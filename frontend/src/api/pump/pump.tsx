import { PumpDetailIn, PumpDetailOut, ApiResponse, FetchDataResponse } from "@/types/index";
import { fetchWithAuth } from "@/api/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const addPumpDetail = async (pumpDetail: PumpDetailIn): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps`, {
    method: "POST",
    body: JSON.stringify(pumpDetail),
  });
  return response;
};

export const getPumpDetailById = async (pumpId: number): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps/${pumpId}`);
  return response;
};

export const getAllPumpDetails = async (): Promise<ApiResponse<FetchDataResponse<PumpDetailOut[]>>> => {
  const response = await fetchWithAuth<FetchDataResponse<PumpDetailOut[]>>(`${API_BASE_URL}/pumps`);
  return response;
};

export const editPumpDetailById = async (
  pumpId: number,
  pumpDetail: PumpDetailIn
): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps/${pumpId}`, {
    method: "PUT",
    body: JSON.stringify(pumpDetail),
  });
  return response;
};

export const deletePumpDetailById = async (pumpId: number): Promise<ApiResponse<PumpDetailOut>> => {
  const response = await fetchWithAuth<PumpDetailOut>(`${API_BASE_URL}/pumps/${pumpId}`, {
    method: "DELETE",
  });
  return response;
};
