export interface PumpDetailResponse {
  /* Related tables */
    pump_id ?: string;
    company_id ?: string;
    pump_lov_id ?: string;
    media_lov_id ?: string;
    mat_lov_id ?: string;
    motor_lov_id ?: string;
    shaft_seal_lov_id ?: string;

    /* Pump General details */
    company_code ?: string;
    pump_code_name ?: string;
    doc_customer ?: string;
    doc_no ?: string;
    doc_date ?: string;
    tag_no ?: string;
    serial_no ?: string;
    brand ?: string;
    model_short ?: string;
    model ?: string;
    pump_model_size ?: string;
    pump_design ?: string;
    pump_type_name ?: string;
    pump_standard ?: string;
    pump_standard_no ?: string;
    stage ?: string;
    base_plate ?: string;
    location ?: string;
    pump_status ?: string;

    /* Pump Technical details */
    max_temp ?: string;
    max_flow ?: string;
    max_flow_unit ?: string;
    min_flow ?: string;
    min_flow_unit ?: string;
    pump_speed ?: string;
    pump_speed_unit ?: string;
    operating_flow ?: string;
    operating_flow_unit ?: string;
    operating_head ?: string;
    operating_head_unit ?: string;
    design_flow ?: string;
    design_flow_unit ?: string;
    design_head ?: string;
    design_head_unit ?: string;
    shut_off_head ?: string;
    shut_off_head_unit ?: string;
    min_head ?: string;
    min_head_unit ?: string;
    max_head ?: string;
    max_head_unit ?: string;
    suction_velo ?: string;
    suction_velo_unit ?: string;
    discharge_velo ?: string;
    discharge_velo_unit ?: string;
    bep_head ?: string;
    bep_head_unit ?: string;
    bep_flow ?: string;
    bep_flow_unit ?: string;
    npshr ?: string;
    npshr_unit ?: string;
    pump_efficiency ?: string;
    pump_efficiency_unit ?: string;
    hyd_power ?: string;
    hyd_power_unit ?: string;
    power_required_cal ?: string;
    power_required_cal_unit ?: string;
    power_min_flow ?: string;
    power_min_flow_unit ?: string;
    power_max_flow ?: string;
    power_max_flow_unit ?: string;
    power_bep_flow ?: string;
    power_bep_flow_unit ?: string;

    /* Pump Application Data */
    media ?: string;
    oper_temp ?: string;
    solid_type ?: string;
    solid_diameter ?: string;
    density ?: string;
    density_unit ?: string;
    viscosity ?: string;
    viscosity_unit ?: string;
    vapor_pressure ?: string;
    vapor_pressure_unit ?: string;
    tank_position ?: string;
    tank_design ?: string;
    tank_pressure ?: string;
    suction_head ?: string;
    concentration ?: string;
    solid_percentage ?: string;

    /* Motor General Details */
    motor_code_name ?: string;
    motor_model ?: string;
    motor_serial_no ?: string;
    motor_brand ?: string;
    motor_drive ?: string;
    motor_standard ?: string;
    motor_ie ?: string;
    motor_speed ?: string;
    motor_speed_unit ?: string;
    motor_rated ?: string;
    motor_rated_unit ?: string;
    motor_factor ?: string;
    motor_connection ?: string;
    motor_phase ?: string;
    motor_efficiency ?: string;
    motor_efficiency_unit ?: string;
    motor_rated_current ?: string;
    motor_rated_current_unit ?: string;
    coup_type ?: string;

    /* Material and Impeller Details */
    mat_code_name ?: string;
    casing_mat ?: string;
    casing_cover_mat ?: string;
    diffuser_mat ?: string;
    pump_base_mat ?: string;
    pump_head_mat ?: string;
    pump_head_cover_mat ?: string;
    design_impeller_dia ?: string;
    impeller_max ?: string;
    impeller_type ?: string;
    impeller_mat ?: string;
    pump_lining_mat ?: string;

    /* Mechanical Seal Details */
    shaft_seal_code_name ?: string;
    shaft_seal_design ?: string;
    shaft_seal_brand ?: string;
    shaft_seal_model ?: string;
    shaft_seal_material ?: string;
    mechanical_seal_api_plan ?: string;
    mech_main_pre ?: string;
    mech_main_pre_unit ?: string;
    mech_main_temp ?: string;
    mech_size ?: string;
    mech_size_unit ?: string;

    /* Flange and Bearing Details */
    flang_con_std :string;
    pump_suction_rating :string;
    pump_suction_size :string;
    suction_pipe_sch :string;
    suction_pipe_size :string;
    suction_pipe_id :string;
    suction_pipe_id_unit :string;
    suction_pipe_length :string;
    suction_pipe_length_unit :string;
    suction_elbow :string;
    suction_tee :string;
    suction_reducer :string;
    suction_valve :string;
    suction_y_strainer :string;
    suction_other :string;
    suction_equi_length :string;
    suction_head_unit :string;
    pump_discharge_rating :string;
    pump_discharge_size :string;
    discharge_pipe_sch :string;
    discharge_pipe_size :string;
    discharge_pipe_id :string;
    discharge_pipe_id_unit :string;
    discharge_pipe_length_h :string;
    discharge_pipe_length_h_unit :string;
    discharge_pipe_length_v :string;
    discharge_pipe_length_v_unit :string;
    discharge_elbow :string;
    discharge_tee :string;
    discharge_reducer :string;
    discharge_valve :string;
    discharge_y_strainer :string;
    discharge_other :string;
    discharge_equi_length :string;
    discharge_head :string;

    /* Bearing Detail */
    bearing_nde_one :string;
    bearing_de_one :string;
    bearing_nde_two :string;
    bearing_de_two :string;
    bearing_lubric_type :string;
    bearing_lubric_brand :string;
    bearing_lubric_no :string;
    oil_seal :string;
    rotation_de :string;
    bearing_last_chg_dt :string;

    created_at :string;
    created_by :string;
    updated_at :string;
    updated_by :string;
}

export interface PumpDetailLOVResponse {
  pump_lov_id ?: string ;
  pump_code_name ?: string ;
  pump_brand ?: string ;
  pump_model ?: string ;
  model_size ?: string ;
  pump_design ?: string ;
  pump_standard ?: string ;
  pump_standard_no ?: string ;
  pump_impeller_type ?: string ;
  pump_flange_con_std ?: string ;
  pump_type ?: string ;
  pump_stage ?: string ;
  pump_seal_chamber ?: string ;
  pump_oil_seal ?: string ;
  pump_max_temp ?: string ;
  pump_suction_size_id ?: string ;
  pump_suction_size ?: string ;
  pump_suction_rating ?: string ;
  pump_discharge_size_id ?: string ;
  pump_discharge_size ?: string ;
  pump_discharge_rating ?: string ;
  created_at ?: string ;
  created_by ?: string ;
  updated_at ?: string ;
  updated_by ?: string ;
}
export interface MotorDetailLOVResponse {
  motor_lov_id ?: string ;
  motor_code_name ?: string ;
  motor_model ?: string ;
  motor_serial_no ?: string ;
  motor_brand ?: string ;
  motor_drive ?: string ;
  motor_standard ?: string ;
  motor_ie ?: string ;
  motor_speed ?: string ;
  motor_speed_unit ?: string ;
  motor_rated ?: string ;
  motor_rated_unit ?: string ;
  motor_factor ?: string ;
  motor_connection ?: string ;
  motor_phase ?: string ;
  motor_efficiency ?: string ;
  motor_efficiency_unit ?: string ;
  motor_rated_current ?: string ;
  motor_rated_current_unit ?: string ;
  coup_type ?: string ;
  created_at ?: string ;
  created_by ?: string ;
  updated_at ?: string ;
  updated_by ?: string ;
}

export interface PumpShaftSealLOVResponse {
  shaft_seal_lov_id ?: string ;
  shaft_seal_code_name ?: string ; 
  shaft_seal_design ?: string ;
  shaft_seal_brand ?: string ;
  shaft_seal_model ?: string ;
  shaft_seal_material ?: string ;
  mechanical_seal_api_plan ?: string ;
  created_at ?: string ;
  created_by ?: string ;
  updated_at ?: string ;
  updated_by ?: string ;
}

export interface PumpMatLOVResponse {
  material_id ?: string ;
  mat_code_name ?: string ;
  pump_type_mat ?: string ;
  pump_mat_code ?: string ;
  casing_mat ?: string ;
  casing_cover_mat ?: string ;
  impeller_mat ?: string ;
  liner_mat ?: string ;
  base_mat ?: string ;
  pump_head_mat ?: string ;
  pump_head_cover_mat ?: string ;
  stage_casing_diffuser_mat ?: string ;
  created_at ?: string ;
  created_by ?: string ;
  updated_at ?: string ;
  updated_by ?: string ;
}

export interface MediaLOVResponse {
  media_id ?: string ;
  media_name ?: string ;
  media_density ?: string ;
  media_density_unit ?: string ;
  media_viscosity ?: string ;
  media_viscosity_unit ?: string ;
  media_concentration_percentage ?: string ;
  operating_temperature ?: string ;
  vapor_pressure ?: string ;
  vapor_pressure_unit ?: string ;
  created_at ?: string ;
  created_by ?: string ;
  updated_at ?: string ;
  updated_by ?: string ;
}

