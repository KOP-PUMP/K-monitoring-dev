import { axiosInstance, axiosInstanceMars } from "../utils";
import { MarsEquipmentDataOut, MarsMeasureDataOut, MarsWaveDataOut } from "@/types/amalytic/report_check_data";

export const createEngineerReport = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report", data);
  return response.data;
};

export const getEngineerReport = async ({
  user,
  user_role,
  pump_detail,
}: {
  user: string;
  user_role: string;
  pump_detail: string;
}) => {
  const query = `?user=${user}&user_role=${user_role}&pump_detail=${pump_detail}`;
  try {
    const response = await axiosInstance.get(`/engineer/report${query}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const openEngineerReport = async (id: string) => {
  const response = await axiosInstance.get(
    `/engineer/report/download?id=${id}`
  );
  return response.data;
};

export const createNewEngineerReport = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report-create", data);
  return response.data;
}

export const deleteEngineerReport = async (id: string) => {
  const response = await axiosInstance.delete(`/engineer/report/${id}`);
  return response.data;
}

export const getEngineerReportCheck = async (id: string | null) => {
  try {
    if (!id || id === "") {
      const response = await axiosInstance.get("/engineer/report-check");
      return response.data.data;
    } else {
      const response = await axiosInstance.get(`/engineer/report-check?id=${id}`);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    throw new Error("Failed to fetch pump report");
  }
};
export const createEngineerReportCheck = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report-check", data);
  return response.data;
};

export const deleteEngineerReportCheck = async (id: string) => {
  const response = await axiosInstance.delete(`/engineer/report-check/${id}`);
  return response.data;
}

export const createEngineerReportCalCheck = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report-check-cal", data);
  return response;
};

export const updateEngineerReportCalCheck = async (data: any , id: string) => {
  try{
    const response = await axiosInstance.put(`/engineer/report-check-cal/${id}`, data);
    return response.data;
  } catch(error){
    console.error("Error updating report check cal:", error);
    throw new Error("Failed to update report check cal");
  }
}

export const createEngineerReportVibeCheck = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report-check-vibe", data);
  return response.data;
};

export const updateEngineerReportVibeCheck = async (data: any , id: string) => {
  const response = await axiosInstance.put(`/engineer/report-check-vibe/${id}`, data);
  return response.data;
}

export const createEngineerReportVisualCheck = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report-check-visual", data);
  return response.data;
};

export const updateEngineerReportVisualCheck = async (data: any, id: string) => {
  const response = await axiosInstance.put(`/engineer/report-check-visual/${id}`, data);
  return response.data;
}

export const createEngineerReportResultCheck = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report-check-result", data);
  return response.data;
};

export const updateEngineerReportResultCheck = async (data: any, id: string) => {
  const response = await axiosInstance.put(`/engineer/report-check-result/${id}`, data);
  return response.data;
}

export const getEngineerReportCheckData = async (id: string | null) => {
  const response = await axiosInstance.get(`/engineer/report-check-data?id=${id}`);
  return response.data;
}

/* Retrive data from MARS system */

export const getEquipmentFromMars = async (data: MarsEquipmentDataOut) => {
  const response = await axiosInstanceMars.post('/latest_data', data);
  const cordinate_id = {
    x_id: response.data[0]?.asset_id,
    y_id: response.data[1]?.asset_id,
    z_id: response.data[2]?.asset_id
  }
  return cordinate_id
}

export const getAllMeasureDataFromMars = async (data: MarsMeasureDataOut) => {
  const response = await axiosInstanceMars.post('/history_data', data);
  return response.data
}

export const getMeasureDataFromMars = async (data: MarsMeasureDataOut) => {
  const response = await axiosInstanceMars.post('/history_data', data);
  return response.data
}

export const getWaveDatafromMars = async (data: MarsWaveDataOut) => {
  const response = await axiosInstanceMars.post('/wave', data);
  return response.data
}

export const getSpectrumWaveDatafromMars = async (data: MarsWaveDataOut) => {
  const response = await axiosInstanceMars.post('/spectrum_wave', data);
  return response.data
}