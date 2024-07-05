import { ApiResponse } from "@/types/response";
import { refreshToken } from "./auth";

export const fetchWithAuth = async <T,>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  // token is in user.access
  const token = localStorage.getItem("access_token");
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};
