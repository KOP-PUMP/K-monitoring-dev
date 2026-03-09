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

export const UserOutSchema = z.object({
    user_email: z.string().email({ message: "Invalid email address"}),
    user_username: z.string(),
    user_password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    user_password_re: z.string(),
    user_name: z.string(),
    user_company_code: z.string(),
    user_role: z.string(),
    show_name_th: z.string().optional(),
    show_name_en: z.string().optional(),
    show_department: z.string().optional(),
    show_position: z.string().optional(),
    user_mobile: z.string().optional(),
    user_tel: z.string().optional(),
    show_company_name_en: z.string().optional(),
    show_company_name_th: z.string().optional(),
    show_address_en: z.string().optional(),
    show_address_th: z.string().optional(),
    show_province: z.string().optional(),
    show_sales_area: z.string().optional(),
    created_by: z.string(),
    updated_by: z.string()
}).refine((data)=> data.user_password === data.user_password_re , {
    message : "Passwords do not match", 
    path : ["user_password_re"]
});

