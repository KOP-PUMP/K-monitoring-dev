import { axiosInstance } from "../utils";

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

export const deleteEngineerReport = async (id: string) => {
  const response = await axiosInstance.delete(`/engineer/report/${id}`);
  return response.data;
}
