export interface CustomerDetail {
  id: number;
  username: string;
  email: string;
  phone: string;
  pump_data: {
    owned_pumps: number;
  };
}

export interface PECPersonResponse {
  pec_code: string,
  name_surname_en: string,
  name_surname_th: string,
  department: string,
  position: string,
  tel: string,
  mobile: string,
  email: string,
  update_time: string,
}


export interface CreateUserOut {
  user_email : string,
  user_username : string,
  user_password : string,
  user_role : "Engineer" | "Customer",
  profile :  UserProfile 
}

export interface UserProfile {
  user_username: string
  user_email: string
  user_mobile: string
  user_tel: string
  user_name: string
  user_pec_code: string
  user_company_code: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
}