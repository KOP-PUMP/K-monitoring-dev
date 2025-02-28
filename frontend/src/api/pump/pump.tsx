import {
  PumpDetailOut,
  LOVOut,
  ApiResponse,
  FetchDataResponse,
} from "@/types/index";
import { axiosInstance } from "../utils";
import { useQuery, useMutation } from "@tanstack/react-query";

export const getAllUnitLOV = async (): Promise<LOVOut[]> => {
  try {
    const response = await axiosInstance.get("/pump-data/unit_lov");
    return response.data;
  } catch (error) {
    console.error("Error fetching unit LOV data:", error);
    throw new Error("Failed to fetch unit LOV data");
  }
};

export const getAllPumpLOV = async (): Promise<LOVOut[]> => {
  try {
    const response = await axiosInstance.get("/pump-data/pump_lov");
    return response.data;
  } catch (error) {
    console.error("Error fetching pump LOV data:", error);
    throw new Error("Failed to fetch pump LOV data");
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

export const getPumpDetailLOV = async (id: string | null) => {
  if (!id || id === "") {
    const response = await axiosInstance.get("/pump-data/pump-lov")
    return response.data.data;
  } else {
    const response = await axiosInstance.get(`/pump-data/pump-lov?id=${id}`);
    return response.data;
  }
};
