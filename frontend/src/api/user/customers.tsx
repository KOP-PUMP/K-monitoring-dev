import toast from "react-hot-toast";
import axios from "axios";
import { axiosInstance } from "../utils";

export const getAllCustomersDetail = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/customers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies detail data:", error);
    throw new Error("Failed to fetch companies detail data");
  }
};