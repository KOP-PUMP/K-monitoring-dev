import { UUID } from "crypto";

export interface CompaniesResponse {
    customer_id : UUID,
    customer_code : string,
    customer_industry_id : number,
    customer_industry_group : string,
    company_name_en : string,
    address_en : string,
    company_name_th : string,
    address_th : string,
    map : string,
    province_th : string,
    province_en : string,
    sales_area : string
    created_by : string,
    created_at : string,
    updated_by : string,
    updated_at : string,
}

export interface ContactPersonResponse {
    contact_person_id : UUID,
    customer_code : string,
    name_surname_en : string,
    name_surname_th : string,
    position_en : string,
    position_th : string,
    tel : string,
    mobile : string,
    email : string
    time_stamp : string,
    time_update : string
}