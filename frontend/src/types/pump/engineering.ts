export interface EngineeringProcessInfo {
  tank_position?: string;
  tank_design?: string;
  tank_pressure?: number;
  suction_head?: number;
  pipe_length?: number;
  media_vapor_pressure?: number;
  discharge_pipe_length_h?: number;
  discharge_pipe_length_v?: number;
  suction_pipe_id?: number;
  elbow?: number;
  tee?: number;
  reducer?: number;
  valve?: number;
  y_strainer?: number;
  other?: number;
}

export interface EngineeringPumpInspection {
  v_pump_de_h?: number;
  v_pump_de_v?: number;
  v_pump_de_a?: number;
  v_pump_nde_h?: number;
  v_pump_nde_v?: number;
  v_pump_nde_a?: number;
  v_motor_de_h?: number;
  v_motor_de_v?: number;
  v_motor_de_a?: number;
  v_motor_nde_h?: number;
  v_motor_nde_v?: number;
  v_motor_nde_a?: number;
  b_pump_nde_one_re?: number;
  b_pump_nde_two_re?: number;
  b_pump_de_one_re?: number;
  b_pump_de_two_re?: number;
  b_motor_nde_one_re?: number;
  b_motor_nde_two_re?: number;
  b_motor_de_one_re?: number;
  b_motor_de_two_re?: number;
  v_pump_nde_h_op1?: number;
  v_pump_nde_v_op1?: number;
  v_pump_nde_a_op1?: number;
  v_pump_de_h_op1?: number;
  v_pump_de_v_op1?: number;
  v_pump_de_a_op1?: number;
  v_motor_nde_h_op1?: number;
  v_motor_nde_v_op1?: number;
  v_motor_nde_a_op1?: number;
  v_motor_de_h_op1?: number;
  v_motor_de_v_op1?: number;
  v_motor_de_a_op1?: number;
  b_pump_nde_one_op1?: number;
  b_pump_nde_two_op1?: number;
  b_pump_de_one_op1?: number;
  b_pump_de_two_op1?: number;
  b_motor_nde_one_op1?: number;
  b_motor_nde_two_op1?: number;
  b_motor_de_one_op1?: number;
  b_motor_de_two_op1?: number;
  v_pump_nde_h_op2?: number;
  v_pump_nde_v_op2?: number;
  v_pump_nde_a_op2?: number;
  v_pump_de_h_op2?: number;
  v_pump_de_v_op2?: number;
  v_pump_de_a_op2?: number;
  v_motor_nde_h_op2?: number;
  v_motor_nde_v_op2?: number;
  v_motor_nde_a_op2?: number;
  v_motor_de_h_op2?: number;
  v_motor_de_v_op2?: number;
  v_motor_de_a_op2?: number;
  b_pump_nde_one_op2?: number;
  b_pump_nde_two_op2?: number;
  b_pump_de_one_op2?: number;
  b_pump_de_two_op2?: number;
  b_motor_nde_one_op2?: number;
  b_motor_nde_two_op2?: number;
  b_motor_de_one_op2?: number;
  b_motor_de_two_op2?: number;
}

export interface EngineeringPumpOperationInfo {}

export interface EngineeringVisualInspectionCheck {
  alignment_check?: string;
  coupling_check?: string;
  suction_valve_check?: string;
  painting_check?: string;
  rotating_check?: string;
  gap_check?: string;
  discharge_valve_check?: string;
  bolt_check?: string;
  oil_grease_check?: string;
  electricity_check?: string;
  service_check?: string;
  leakage_check?: string;
  noise_run_check?: string;
  oil_run_check?: string;
  leakage_run_check?: string;
  mechanical_run_check?: string;
  run1_check?: string;
  run2_check?: string;
  run3_check?: string;
  run4_check?: string;
  remarks_check?: string;
}

export interface EngineeringVisualInspectionRemark {
  alignment_remark?: string;
  coupling_remark?: string;
  suction_valve_remark?: string;
  painting_remark?: string;
  rotating_remark?: string;
  gap_remark?: string;
  discharge_valve_remark?: string;
  bolt_remark?: string;
  oil_remark?: string;
  electricity_remark?: string;
  service_remark?: string;
  leakage_remark?: string;
  noise_run_remark?: string;
  oil_run_remark?: string;
  leakage_run_remark?: string;
  mechan_run_remark?: string;
  run1_remark?: string;
  run2_remark?: string;
  run3_remark?: string;
  run4_remark?: string;
}

export interface EngineeringSuggestion {
  speed_suggest?: string;
  flow_suggest?: string;
  npshr_suggest?: string;
  velocity_suggest?: string;
  boiling_point_suggest?: string;
  current_suggest?: string;
  power_suggest?: string;
  api_suggest?: string;
  buffer_suggest?: string;
  bearing_suggest?: string;
  vibration_suggest?: string;
  bearing_temp_suggest?: string;
}
