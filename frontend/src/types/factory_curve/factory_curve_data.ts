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
    point_flow ?: string;
    point_head ?: string;
    point_label ?: string; 
}

export interface FactoryCurveNumberResponse {
    id ?: string;
    fac_number ?: string;
    brand ?: string;
    model_short ?: string;
    model ?: string;
    rpm ?: string;
    created_at ?: string;
    created_by ?: string;
    updated_at ?: string;
    updated_by ?: string;
}

export interface PumpDetailDataOut {
    operation_flow ?: string | undefined
    operation_flow_unit ?: string| undefined
    operation_head ?: string | undefined
    operation_head_unit ?: string | undefined
    impeller_dia ?: string | undefined
    model ?: string | undefined
    speed ?: string | undefined
    size ?: string | undefined
}

export interface PumpDetailCalResponse {
    BEP_head: string
    BEP_flow: string
    min_flow: string
    max_flow: string
    hyd_power: string
    efficiency: string
    power_required_cal: string
    power_BEP_flow:string
    npshr: string
    min_head: string
    max_head: string
    shut_off_head: string
    eff_min_flow: string
    power_min_flow:string
    eff_max_flow: string
    power_max_flow:string
    curve: CurveDataAtImp[]
}

interface CurveDataAtImp {
    flow:string
    head: string
    kw: string | null
    imp_dia: string
}
