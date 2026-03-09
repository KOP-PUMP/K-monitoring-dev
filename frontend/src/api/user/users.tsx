import { Axios, AxiosInstance } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstancePEC, axiosInstance } from "../utils";
import { CreateUserOut } from "@/types/users/users";

export const getAllUsers = async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get(`/users`);
    return response.data;
};

export const getPECPersonByCode = async (code: string) => {
    const response = await axiosInstancePEC.get(`/pec_person_api.php?code=${code}`);
    return response.data;
}

/* export const getUserByEmail = async (email: string) => {
    const response = await axiosInstance.get(`/users/${email}`);
} */

export const createUser = async (data: CreateUserOut) => {
    const response = await axiosInstance.post(`/users/profile`, data);
    return response.data;
}

export const getUserProfile = async (role: 'Customer' | 'Member') => {
    const response = await axiosInstance.get(`/users/profile?user_role=${role}`);
    return response.data;
}