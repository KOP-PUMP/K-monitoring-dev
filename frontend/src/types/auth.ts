export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  email: string;
  refresh: string;
  access: string;
}

export interface RefreshRequest {
  refresh: string;
}

export interface VerifyRequest {
  token: string;
}

export interface CollapsibleState {
  pumps: boolean;
  pump_data: boolean;
  user_manage : boolean;
};

