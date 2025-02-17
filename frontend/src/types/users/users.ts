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