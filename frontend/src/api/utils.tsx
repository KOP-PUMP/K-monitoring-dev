import axios from "axios";
import AuthService from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("access_token"),
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = AuthService.getCurrentUser();
        if (user && user.refresh) {
          const newTokens = await AuthService.refresh(user.refresh);
          localStorage.setItem("access_token", newTokens.access);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newTokens.access}`;
          originalRequest.headers["Authorization"] = `Bearer ${newTokens.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
