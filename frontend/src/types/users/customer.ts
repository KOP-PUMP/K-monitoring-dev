export interface CustomerDetail {
  id: number;
  username: string;
  email: string;
  phone: string;
  pump_data: {
    owned_pumps: number;
  };
}
