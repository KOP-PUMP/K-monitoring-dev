import { z } from "zod";

export const CompanyOutSchema = z.object({
    customer_code: z.string().min(1,"Required"),
    customer_industry_id: z.string().optional(),
    customer_industry_group: z.string().optional(),
    company_name_en: z.string().min(1,"Required"),
    address_en: z.string().min(1,"Required"),
    company_name_th: z.string().min(1,"Required"),
    address_th: z.string().min(1,"Required"),
    map: z.string().optional(),
    province: z.string().min(1,"Required"),
    sales_area: z.string().min(1,"Required"),
    created_by: z.string().optional(),
    created_at: z.string().optional(),
    updated_by: z.string().optional(),
    updated_at: z.string().optional(),
});

export const ContactOutSchema = z.object({
    customer_code: z.string(),
    name_surname_en: z.string(),
    name_surname_th: z.string(),
    position_en: z.string(),
    position_th: z.string(),
    tel: z.string(),
    mobile: z.string(),
    email: z.string(),
});