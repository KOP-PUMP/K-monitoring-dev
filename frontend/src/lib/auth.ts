import { TokenResponse, LoginRequest, RefreshRequest, VerifyRequest } from "@/types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = async (email: string, password: string): Promise<TokenResponse> => {
  const response = await fetch(API_BASE_URL + "/token/pair", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    } as LoginRequest),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data: TokenResponse = await response.json();
  if (data.access) {
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("access_token", data.access);
  }

  return data;
};

const refresh = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await fetch(API_BASE_URL + "/token/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    } as RefreshRequest),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const data: TokenResponse = await response.json();
  if (data.access) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    currentUser.access = data.access;
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("access_token", data.access);
  }

  return data;
};

const verify = async (token: string): Promise<unknown> => {
  const response = await fetch(API_BASE_URL + "/token/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    } as VerifyRequest),
  });

  if (!response.ok) {
    throw new Error("Token verification failed");
  }

  return response.json();
};

const logout = (): void => {
  localStorage.clear();
};

const getCurrentUser = (): TokenResponse | null => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user) as TokenResponse;
  }
  return null;
};

const isAuthenticated = async (): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user || !user.access) {
    return false;
  }

  try {
    await verify(user.access);
    return true;
  } catch (error) {
    try {
      if (user.refresh) {
        const newTokens = await refresh(user.refresh);
        localStorage.setItem("access_token", newTokens.access);
        return true;
      }
    } catch (refreshError) {
      logout();
      return false;
    }
  }

  logout();
  return false;
};

const AuthService = {
  login,
  refresh,
  verify,
  logout,
  getCurrentUser,
  isAuthenticated,
};

export default AuthService;
