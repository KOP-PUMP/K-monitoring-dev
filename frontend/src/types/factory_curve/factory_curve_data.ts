export interface FactoryCurveDataResponse {
    id ?: string; 
    fac_number ?: string; 
    equipment ?: string; 
    brand ?: string; 
    model_short ?: string; 
    model ?: string; 
    data_type ?: string; 
    se_quence ?: string; 
    rpm ?: string; 
    imp_dia ?: string; 
    flow ?: string; 
    head ?: string; 
    eff ?: string; 
    npshr ?: string; 
    kw ?: string; 
    curve_format ?: string; 
    eff_rl ?: string; 
    eff_status ?: string; 
    eff_distance ?: string; 
    tolerance ?: string; 
    scale_xy ?: string; 
    update_time ?: string; 
    dry_sat ?: string; 
    liquid ?: string; 
}

export interface FactoryCurveNumberResponse {
    id ?: string;
    fac_number ?: string;
    created_at ?: string;
    created_by ?: string;
    updated_at ?: string;
    updated_by ?: string;
}
