import axios from "axios";
import AuthService from "@/lib/auth";

// Get the base URL for the API from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_PEC_URL = import.meta.env.VITE_API_PEC_URL as string;
const API_PUBLIC_PROVINCE_URL = import.meta.env
  .VITE_PUBLIC_API_PROVINCE_URL as string;

// Create a custom Axios instance with default settings
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // Base URL for all API requests
  timeout: 5000, // Set timeout to 5 seconds for API calls
  headers: {
    Authorization: "Bearer " + localStorage.getItem("access_token"), // Set initial Authorization header with token from localStorage
    "Content-Type": "application/json", // Content-Type for JSON payloads
    accept: "application/json", // Accept header for JSON responses
  },
});

export const axiosInstancePEC = axios.create({
  baseURL: API_PEC_URL, // Base URL for all API requests
  timeout: 5000, // Set timeout to 5 seconds for API calls
});

export const axiosInstanceProvince = axios.create({
  baseURL: API_PUBLIC_PROVINCE_URL,
  timeout: 5000,
});

// Add a request interceptor to modify the request before sending it
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the latest access token from localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
      // Update the Authorization header with the latest token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle any errors that occur during request configuration
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, return the response object
    return response;
  },
  async (error) => {
    const originalRequest = error.config; // Get the original request that failed

    // Check if the error is a 401 (Unauthorized) and if the request hasn't already been retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        // Retrieve the current user and their refresh token
        const user = AuthService.getCurrentUser();
        if (user && user.refresh) {
          // Use the refresh token to obtain a new access token
          const newTokens = await AuthService.refresh(user.refresh);

          // Update the access token in localStorage
          localStorage.setItem("access_token", newTokens.access);

          // Update the default Authorization header for all future requests
          axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${newTokens.access}`;

          // Update the Authorization header for the retried request
          originalRequest.headers["Authorization"] =
            `Bearer ${newTokens.access}`;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If token refresh fails, log out the user and reject the error
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }

    // If the error isn't 401 or can't be handled, reject the error
    return Promise.reject(error);
  }
);
