import { z } from "zod";

export const EngineerReportSchema = z.object({
    pump_detail : z.string().optional(),
    user_detail : z.string().optional(),
    created_at : z.string().optional(),
    created_by : z.string().optional(),
    updated_at : z.string().optional(),
    updated_by : z.string().optional(),
})