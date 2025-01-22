import {
  CompaniesResponse,
  ContactPersonResponse,
} from "@/types/users/company";
import { axiosInstance, axiosInstancePEC } from "../utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { on } from "events";
import toast from "react-hot-toast";

export const getAllCompaniesDetail = async (): Promise<CompaniesResponse[]> => {
  try {
    const response = await axiosInstance.get(`/companies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies detail data:", error);
    throw new Error("Failed to fetch companies detail data");
  }
};

export const deleteCompany = async (code: string) => {
  try {
    const response = await axiosInstance.delete(`/companies/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies detail data:", error);
    throw new Error("Failed to fetch companies detail data");
  }
};

export const createCompany = async (data: CompaniesResponse) => {
  try {
    const response = await axiosInstance.post(`/companies/`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies detail data:", error);
    throw new Error("Failed to fetch companies detail data");
  }
};

export const updateCompany = async ({
  code,
  data,
}: {
  code: string;
  data: CompaniesResponse;
}) => {
  try {
    const response = await axiosInstance.put(`/companies/${code}`, data);
    return response.data;
  } catch (error) {
    console.error("Error update company detail data:", error);
    throw new Error("Failed to update company detail data");
  }
};

export const getPECCompanyDetail = async (code: string) => {
  try {
    const response = await axiosInstancePEC.get(
      `/customer_api.php?code=${code}`
    );
    if (response.data.length === 0) {
      toast.error("Cannot find company detail");
      return;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching companies detail data:", error);
    toast.error("Error fetching companies detail data");
    throw new Error("Failed to fetch companies detail data");
  }
};

export const getPECContactDetail = async (code: string) => {
  const response = await axiosInstancePEC.get(`/contact_api.php?code=${code}`);
  return response.data;
};
