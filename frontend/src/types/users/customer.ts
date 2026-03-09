export interface CustomerResponse {
    user_name: string;
    email: string;
    mobile: string;
    tel: string;
    company_data: CompanyData;
    is_active: string;
}

interface CompanyData {
    customer_code: string;
    customer_industry_group: string;
    company_name_en: string;
    address_en: string;
    company_name_th: string;
    address_th: string;
    map: string;
    province: string;
    sales_area: string;
}