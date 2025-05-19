import {
  PumpDetailOut,
  LOVOut,
  MediaLOVResponse,
  ApiResponse,
  FetchDataResponse,
  PumpDetailLOVResponse,
  MotorDetailLOVResponse,
} from "@/types/index";
import { axiosInstance } from "../utils";
import { useQuery, useMutation } from "@tanstack/react-query";

export const getAllUnitLOV = async (): Promise<LOVOut[]> => {
  try {
    const response = await axiosInstance.get("/pump-data/unit-lov");
    return response.data;
  } catch (error) {
    console.error("Error fetching unit LOV data:", error);
    throw new Error("Failed to fetch unit LOV data");
  }
};

export const getAllPumpLOV = async (): Promise<LOVOut[]> => {
  try {
    const response = await axiosInstance.get("/pump-data/pump-lov");
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
    const response = await axiosInstance.get("/pump-data/pump-detail-lov")
    return response.data.data;
  } else {
    const response = await axiosInstance.get(`/pump-data/pump-detail-lov?id=${id}`);
    return response.data;
  }
};

export const createPumpDetailLOV = async (data: PumpDetailLOVResponse) => {
  const response = await axiosInstance.post("/pump-data/pump-detail-lov", data);
  return response.data;
};

export const updatePumpDetailLOV = async ({ id, data }: { id: string; data: PumpDetailLOVResponse }) => {
  const response = await axiosInstance.put(`/pump-data/pump-detail-lov/${id}`, data);
  return response.data;
};


export const deletePumpDetailLOV = async (id: string) => {
  const response = await axiosInstance.delete(`/pump-data/pump-detail-lov/${id}`);
  return response.data;
};

/* Motor Detail LOV API */

export const getMotorDetailLOV = async (id: string | null) => {
  if (!id || id === "") {
    const response = await axiosInstance.get("/pump-data/motor-lov")
    return response.data.data;
  } else {
    const response = await axiosInstance.get(`/pump-data/motor-lov?id=${id}`);
    return response.data.data;
  }
};

export const createMotorLOV = async (data: MotorDetailLOVResponse) => {
  const response = await axiosInstance.post("/pump-data/motor-lov", data);
  return response.data;
};

export const updateMotorLOV = async ({ id, data }: { id: string; data: MotorDetailLOVResponse }) => {
  const response = await axiosInstance.put(`/pump-data/motor-lov/${id}`, data);
  return response.data;
};


export const deleteMotorLOV = async (id: string) => {
  const response = await axiosInstance.delete(`/pump-data/motor-lov/${id}`);
  return response.data;
};





export const getShaftSealDetailLOV = async (id: string | null) => {
  if (!id || id === "") {
    const response = await axiosInstance.get("/pump-data/shaft-seal-lov")
    return response.data.data;
  } else {
    const response = await axiosInstance.get(`/pump-data/shaft-seal-lov?id=${id}`);
    return response.data;
  }
};

export const getMatDetailLOV = async (id: string | null) => {
  if (!id || id === "") {
    const response = await axiosInstance.get("/pump-data/material-lov")
    return response.data.data;
  } else {
    const response = await axiosInstance.get(`/pump-data/material-lov?id=${id}`);
    return response.data;
  }
};

export const getMediaLOV = async (id: string | null) => {
  try {
    if(!id || id === ""){
      const response = await axiosInstance.get("/pump-data/media-lov");
      return response.data.data;
    }else{
      const response = await axiosInstance.get(`/pump-data/media-lov?id=${id}`);
      return response.data;
    }
    
  } catch (error) {
    console.error("Error fetching pump LOV data:", error);
    throw new Error("Failed to fetch pump LOV data");
  }
};

export const createMediaLOV = async (data: MediaLOVResponse) => {
  const response = await axiosInstance.post("/pump-data/media-lov", data);
  return response.data;
};

export const updateMediaLOV = async ({ id, data }: { id: string; data: MediaLOVResponse }) => {
  const response = await axiosInstance.put(`/pump-data/media-lov/${id}`, data);
  return response.data;
};


export const deleteMediaLOV = async (id: string) => {
  const response = await axiosInstance.delete(`/pump-data/media-lov/${id}`);
  return response.data;
};
