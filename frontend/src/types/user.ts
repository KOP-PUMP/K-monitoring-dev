// types/customUser.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone: string;
  surname?: string;
  lastname?: string;
  user_customer?: string;
  user_address?: string;
  user_image?: string;
  is_active: boolean;
  is_staff: boolean;
  groups: string[];
  user_permissions: string[];
}
