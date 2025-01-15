import {
  CompaniesResponse,
  ContactPersonResponse,
} from "@/types/users/company";
import { axiosInstance } from "../utils";
import { useQuery, useMutation } from "@tanstack/react-query";

export const getAllCompaniesDetail = async (): Promise<CompaniesResponse[]> => {
  try {
    const response = await axiosInstance.get(`/companies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies detail data:", error);
    throw new Error("Failed to fetch companies detail data");
  }
};

