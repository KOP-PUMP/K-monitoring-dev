import { AxiosInstance } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstancePEC } from "../utils";

export const getAllUsers = async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get(`/users`);
    return response.data;
};

export const getPECPersonByCode = async (code: string) => {
    const response = await axiosInstancePEC.get(`/pec_person_api.php?code=${code}`);
    return response.data;
}