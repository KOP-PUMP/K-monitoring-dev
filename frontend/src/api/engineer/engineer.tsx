import { axiosInstance} from "../utils";
import {
  MarsEquipmentDataOut,
  MarsMeasureDataOut,
  MarsWaveDataOut,
  ReportCheckFileCreateOut,
} from "@/types/amalytic/report_check_data";

// Report File

export const createEngineerReportFile = async ({
  id,
  email,
  data,
}: {
  id: string;
  email: string;
  data: ReportCheckFileCreateOut;
}) => {
  const response = await axiosInstance.post(
    `/engineer/report?id=${id}&user=${email}`,
    data,
    {
      responseType: "blob", // 🔥 สำคัญมาก
    },
  );

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  let filename = "report.xlsx";
  const contentDisposition = response.headers["content-disposition"];

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match?.[1]) {
      filename = match[1];
    }
  }

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);

  return true;
};

export const getEngineerReportFile = async (id: string | null) => {
  try {
    const response = await axiosInstance.get(`/engineer/report?id=${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const downloadEngineerReportFile = async (id: string | null) => {
  const response = await axiosInstance.get(
    `/engineer/report/download?id=${id}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  let filename = "report.xlsx";
  const contentDisposition = response.headers["content-disposition"];

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match?.[1]) {
      filename = match[1];
    }
  }

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return true;
};

export const deleteEngineerReportFile = async (id: string) => {
  const response = await axiosInstance.delete(`/engineer/report?id=${id}`);
  return response.data;
};

// Report Detail In Database


export const getEngineerReportCheck = async (id: string | null) => {
  try {
    if (!id || id === "") {
      const response = await axiosInstance.get("/engineer/report-check");
      return response.data.data;
    } else {
      const response = await axiosInstance.get(
        `/engineer/report-check?id=${id}`,
      );
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
};

// Report Check List Detail

export const createEngineerReportCalCheck = async (data: any) => {
  const response = await axiosInstance.post("/engineer/report-check-cal", data);
  return response;
};

export const updateEngineerReportCalCheck = async (data: any, id: string) => {
  try {
    const response = await axiosInstance.put(
      `/engineer/report-check-cal/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating report check cal:", error);
    throw new Error("Failed to update report check cal");
  }
};

export const createEngineerReportVibeCheck = async (data: any) => {
  const response = await axiosInstance.post(
    "/engineer/report-check-vibe",
    data,
  );
  return response.data;
};

export const updateEngineerReportVibeCheck = async (data: any, id: string) => {
  const response = await axiosInstance.put(
    `/engineer/report-check-vibe/${id}`,
    data,
  );
  return response.data;
};

export const createEngineerReportVisualCheck = async (data: any) => {
  const response = await axiosInstance.post(
    "/engineer/report-check-visual",
    data,
  );
  return response.data;
};

export const updateEngineerReportVisualCheck = async (
  data: any,
  id: string,
) => {
  const response = await axiosInstance.put(
    `/engineer/report-check-visual/${id}`,
    data,
  );
  return response.data;
};

export const createEngineerReportResultCheck = async (data: any) => {
  const response = await axiosInstance.post(
    "/engineer/report-check-result",
    data,
  );
  return response.data;
};

export const updateEngineerReportResultCheck = async (
  data: any,
  id: string,
) => {
  const response = await axiosInstance.put(
    `/engineer/report-check-result/${id}`,
    data,
  );
  return response.data;
};

export const getEngineerReportCheckData = async (id: string | null) => {
  const response = await axiosInstance.get(
    `/engineer/report-check-data?id=${id}`,
  );
  return response.data;
};

/* Retrive data from MARS system */

export const getEquipmentFromMars = async (data: MarsEquipmentDataOut) => {
  const response = await axiosInstance.post("/mars/equipment", data);
  return response.data;
};

export const getAllMeasureDataFromMars = async (data: MarsMeasureDataOut) => {
  const response = await axiosInstance.post("/mars/measurements", data);
  return response.data;
};

export const getWaveDatafromMars = async (data: MarsWaveDataOut) => {
  const response = await axiosInstance.post("/mars/wave", data);
  return response.data;
};

export const getSpectrumWaveDatafromMars = async (data: MarsWaveDataOut) => {
  const response = await axiosInstance.post("/mars/spectrum_wave", data);
  return response.data;
};
