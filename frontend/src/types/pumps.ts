// export interface PumpDetailIn {
//   doc_customer: string;
//   doc_no: string;
//   doc_date: string;
//   brand: string;
//   model: string;
//   tag_no: string;
//   pump_type_id: string;
//   pump_type_name: string;
//   serial_no: string;
//   media: string;
//   pump_standard_id: string;
//   pump_standard: string;
//   pump_design: string;
//   stage?: number;
//   location?: string;
//   design_temp: string;
//   max_temp: string;
//   solid_type?: string;
//   solid_diameter?: string;
//   density: number;
//   density_unit: string;
//   viscosity: number;
//   viscosity_unit: string;
//   max_flow: number;
//   max_flow_unit: string;
//   min_flow: number;
//   min_flow_unit: string;
//   vapor_pressure: number;
//   vapor_pressure_unit: string;
//   pump_speed: number;
//   pump_speed_unit: string;
//   design_flow: string;
//   design_flow_unit: string;
//   design_head: string;
//   design_head_unit: string;
//   min_head: string;
//   min_head_unit: string;
//   max_head: string;
//   max_head_unit: string;
//   suction_velo: string;
//   suction_velo_unit: string;
//   discharge_velo: string;
//   discharge_velo_unit: string;
//   bep_head: number;
//   bep_head_unit: string;
//   bep_flow: string;
//   bep_flow_unit: string;
//   npshr: string;
//   npshr_unit: string;
//   pump_efficiency: string;
//   pump_efficiency_unit: string;
//   hyd_power: number;
//   hyd_power_unit: string;
//   voltage: string;
//   voltage_unit: string;
//   power_required_cal: string;
//   power_required_cal_unit: string;
//   power_min_flow: number;
//   power_min_flow_unit: string;
//   power_max_flow: number;
//   power_max_flow_unit: string;
//   power_bep_flow: number;
//   power_bep_flow_unit: string;
//   suggest_motor: number;
//   pump_suction_size_id?: string;
//   pump_suction_size?: string;
//   pump_suction_rating_id?: string;
//   pump_suction_rating?: string;
//   pump_discharge_size_id?: string;
//   pump_discharge_size?: string;
//   pump_discharge_rating_id?: string;
//   pump_discharge_rating?: string;
//   suction_pipe_data_id: string;
//   suction_pipe_size: string;
//   suction_pipe_rating?: string;
//   suction_pipe_sch: string;
//   discharge_pipe_data_id: string;
//   discharge_pipe_size: string;
//   discharge_pipe_rating?: string;
//   discharge_pipe_sch: string;
//   tank_position?: string;
//   tank_design?: string;
//   tank_pressure?: number;
//   suction_head?: number;
//   suction_pipe_length?: number;
//   discharge_pipe_length_h?: number;
//   discharge_pipe_length_v?: number;
//   suction_pipe_id: number;
//   discharge_pipe_id: string;
//   suction_elbow?: number;
//   suction_tee?: number;
//   suction_reducer?: number;
//   suction_valve?: number;
//   suction_y_strainer?: number;
//   suction_other?: number;
//   suction_equi_length?: number;
//   discharge_equi_length?: number;
//   discharge_elbow?: number;
//   discharge_tee?: number;
//   discharge_reducer?: number;
//   discharge_valve?: number;
//   discharge_y_strainer?: number;
//   discharge_other?: number;
//   casing_mat_id?: number;
//   casing_mat?: string;
//   shaft_mat_id?: number;
//   shaft_mat?: string;
//   diffuser_mat_id?: number;
//   diffuser_mat?: number;
//   impeller_type_id?: number;
//   impeller_type?: string;
//   design_impeller_dia: number;
//   impeller_max?: number;
//   impeller_mat_id?: number;
//   impeller_mat?: string;
//   materials_wear_ring_id?: number;
//   materials_wear_ring?: string;
//   bearing_nde?: string;
//   bearing_num?: string;
//   bearing_lubric_type?: string;
//   bearing_lubric_brand?: string;
//   bearing_lubric_no?: string;
//   rotation_de_id: number;
//   rotation_de: string;
//   bearing_de?: string;
//   bearing_de_no?: string;
//   bearing_last_chg_dt?: Date;
//   sleeve_mat_id?: number;
//   sleeve_mat?: string;
//   bearing_housing_mat_id?: number;
//   bearing_housing_mat?: string;
//   gland_mat?: string;
//   casing_gas?: string;
//   oring_gas?: number;
//   impeller_gas?: string;
//   pump_lining_mat?: string;
//   base_plate?: string;
//   coup_model?: string;
//   coup_brand?: string;
//   coup_type: string;
//   coup_size?: string;
//   coup_spacer?: number;
//   motor_brand?: string;
//   motor_model?: string;
//   motor_serial_no?: string;
//   motor_drive_id?: number;
//   motor_drive?: string;
//   motor_frame?: string;
//   motor_protection?: string;
//   motor_standard?: string;
//   motor_ie?: string;
//   motor_speed: number;
//   motor_speed_unit: string;
//   motor_rated: number;
//   motor_rated_unit: string;
//   motor_factor: number;
//   motor_connection?: string;
//   motor_phase: number;
//   motor_efficiency: string;
//   motor_efficiency_unit: string;
//   mech_api_id: string;
//   mech_api_plan?: string;
//   mech_main_temp?: number;
//   mech_main_pre?: number;
//   mech_seal_cham?: string;
//   mech_brand?: string;
//   mech_model?: string;
//   mech_size?: number;
//   mech_size_unit?: string;
//   mech_design_id?: number;
//   mech_design?: string;
//   mech_material?: string;
//   concentration?: number;
//   pump_status: string;
// }

export interface PumpDetailOut {
  pump_id: number;
  design_temp: string;
  max_temp: string;
  density: number;
  density_unit: string;
  max_flow: number;
  max_flow_unit: string;
  min_flow: number;
  min_flow_unit: string;
  suction_velo: string;
  suction_velo_unit: string;
  discharge_velo: string;
  discharge_velo_unit: string;
  bep_head: number;
  bep_head_unit: string;
  bep_flow: string;
  bep_flow_unit: string;
  hyd_power: number;
  hyd_power_unit: string;
  voltage: string;
  voltage_unit: string;
  power_required_cal: string;
  power_required_cal_unit: string;
  power_min_flow: number;
  power_min_flow_unit: string;
  power_max_flow: number;
  power_max_flow_unit: string;
  power_bep_flow: number;
  power_bep_flow_unit: string;
  suggest_motor: number;
  tank_position?: string;
  tank_design?: string;
  tank_pressure?: number;
  suction_head?: number;
  suction_pipe_length?: number;
  discharge_pipe_length_h?: number;
  discharge_pipe_length_v?: number;
  suction_pipe_id: number;
  discharge_pipe_id: string;
  suction_elbow?: number;
  suction_tee?: number;
  suction_reducer?: number;
  suction_valve?: number;
  suction_y_strainer?: number;
  suction_other?: number;
  suction_equi_length?: number;
  discharge_equi_length?: number;
  discharge_elbow?: number;
  discharge_tee?: number;
  discharge_reducer?: number;
  discharge_valve?: number;
  discharge_y_strainer?: number;
  discharge_other?: number;
  diffuser_mat_id?: number;
  diffuser_mat?: number;
  materials_wear_ring_id?: number;
  materials_wear_ring?: string;
  sleeve_mat_id?: number;
  sleeve_mat?: string;
  bearing_housing_mat_id?: number;
  bearing_housing_mat?: string;
  gland_mat?: string;
  casing_gas?: string;
  oring_gas?: number;
  impeller_gas?: string;
  pump_lining_mat?: string;
  base_plate?: string;
  concentration?: number;
  pump_status: string;
}

export interface LOVOut {
  data_type: string;
  data_name: string;
  data_value: string;
  additional_1?: string;
  additional_2?: string;
  additional_3?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}
