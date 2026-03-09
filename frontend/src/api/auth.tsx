import {
  LoginRequest,
  TokenResponse,
  RefreshRequest,
  VerifyRequest,
} from "@/types/auth";
import { FetchDataResponse } from "@/types/response";

const API_PUBLIC_BASE_URL = import.meta.env.VITE_API_PUBLIC_BASE_URL as string;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_BASE_LOCAL_URL = import.meta.env.VITE_API_BASE_LOCAL_URL as string;

const API_URL =
  window.location.origin === "http://pecsystem.ddns.net:5173"
    ? API_PUBLIC_BASE_URL
    : window.location.origin === "http://192.168.1.177:5173"
      ? API_BASE_URL
      : API_BASE_LOCAL_URL;

export const login = async (
  credentials: LoginRequest
): Promise<FetchDataResponse<TokenResponse>> => {
  try {
    const response = await fetch(`${API_URL}/token/pair/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data: TokenResponse = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: "An unknown error occurred" };
  }
};

export const verifyToken = async (
  token: VerifyRequest
): Promise<FetchDataResponse<void>> => {
  try {
    const response = await fetch(`${API_URL}/token/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    return { data: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { data: undefined, error: error.message };
    }
    return { data: undefined, error: "An unknown error occurred" };
  }
};

export const refreshToken = async (
  token: RefreshRequest
): Promise<FetchDataResponse<TokenResponse>> => {
  try {
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data: TokenResponse = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: "An unknown error occurred" };
  }
};
