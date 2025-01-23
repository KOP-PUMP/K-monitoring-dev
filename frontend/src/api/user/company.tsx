import {
  CompaniesResponse,
  ContactPersonResponse,
} from "@/types/users/company";
import { axiosInstance, axiosInstancePEC } from "../utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { on } from "events";
import toast from "react-hot-toast";
import axios from "axios";

export const getAllCompaniesDetail = async (): Promise<CompaniesResponse[]> => {
  try {
    const response = await axiosInstance.get(`/companies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies detail data:", error);
    throw new Error("Failed to fetch companies detail data");
  }
};

export const getCompanyDetailByCode = async (code: string) => {
  const response = await axiosInstance.get(`/companies/${code}`);
  return response.data;
};

export const deleteCompany = async (code: string) => {
  const response = await axiosInstance.delete(`/companies/${code}`);
  return response.data;
};

export const createCompany = async (data: CompaniesResponse) => {
  try {
    // Check if the company already exists
    const checkCodeResponse = await axiosInstance.get(
      `/companies/${data.customer_code}`
    );
    if (checkCodeResponse.data) {
      throw new Error("Company already exists");
    }

    // If it doesn't exist, create the company
    const response = await axiosInstance.post(`/companies/`, data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response?.status === 404) {
        // If the company doesn't exist, proceed to create it
        const response = await axiosInstance.post(`/companies/`, data);
        return response.data;
      } else if (error.response?.status === 400) {
        throw new Error("Bad request. Please check the data format.");
      }
    }
    // Generic error handling
    console.error("Error during company creation:", error.message || error);
    throw new Error(error.message || "Failed to create company");
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
