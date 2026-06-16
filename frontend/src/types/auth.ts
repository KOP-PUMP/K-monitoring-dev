export interface LoginRequest {
  user_email: string;
  password: string;
}

export type UserRole = 'Admin' | 'Engineer' | 'Customer' | 'Developer' | 'Sales' | 'Service';

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
  analytics: boolean;
  companies: boolean;
};

