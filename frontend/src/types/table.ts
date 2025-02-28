export interface LOVData {
  id?: any;
  type_name: string | null; 
  product_name: string | null;
  data_value: string | null;
  data_value2?: string | null;
  data_value3?: string | null;
  data_value4?: string | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface PumpLOVData {
  pump_lov_id ?: string | null ;
  code_name ?: string | null ;
  model_size ?: string | null ;
  pump_brand ?: string | null ;
  pump_design ?: string | null ;
  pump_discharge_rating ?: string | null ;
  pump_discharge_rating_id ?: string | null ;
  pump_discharge_size ?: string | null ;
  pump_discharge_size_id ?: string | null ;
  pump_flange_con_std ?: string | null ;
  pump_impeller_type ?: string | null ;
  pump_max_temp ?: string | null ;
  pump_model ?: string | null ;
  pump_oil_seal ?: string | null ;
  pump_seal_chamber ?: string | null ;
  pump_stage ?: string | null ;
  pump_standard ?: string | null ;
  pump_standard_no ?: string | null ;
  pump_suction_rating ?: string | null ;
  pump_suction_rating_id ?: string | null ;
  pump_suction_size ?: string | null ;
  pump_suction_size_id ?: string | null ;
  pump_type ?: string | null ;
  updated_at ?: string | null ;
  updated_by ?: string | null ;
  created_at ?: string | null ;
  created_by ?: string | null ;
}