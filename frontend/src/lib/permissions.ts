import { UserRole } from "@/types";

export const decodeJwtPayload = (token: string): Record<string, unknown> => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
};

export const getCurrentUserRole = (): UserRole | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload.user_role as UserRole ?? null;
};

export const NAV_PERMISSIONS: Record<string, UserRole[]> = {
  /* Side Bar permissions */
  dashboard:    ['Admin', 'Developer', 'Service', 'Engineer', 'Customer', 'Sales'],
  pumps:        ['Admin', 'Developer', 'Service', 'Engineer', 'Customer', 'Sales'],
  total_pump:   ['Admin', 'Developer', 'Service', 'Engineer', 'Customer', 'Sales'],
  data_table:   ['Admin', 'Developer', 'Service', 'Engineer'],
  customer:     ['Admin', 'Developer', 'Service', 'Engineer', 'Sales'],
  analytics:    ['Admin', 'Developer', 'Service', 'Engineer', 'Customer', 'Sales'],
  users_manage: ['Admin', 'Developer'],
};

export const canAccess = (key: string, role: UserRole | null): boolean => {
  if (!role) return false;
  return NAV_PERMISSIONS[key]?.includes(role) ?? false;
};