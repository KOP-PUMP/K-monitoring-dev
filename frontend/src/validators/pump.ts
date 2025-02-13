import { z } from "zod";

export const PumpOtherGeneralDetailSchema = z.object({
  pump_id: z.number(),
  design_temp: z.string(),
  max_temp: z.string(),
  density: z.number(),
  density_unit: z.string(),
  max_flow: z.number(),
  max_flow_unit: z.string(),
  min_flow: z.number(),
  min_flow_unit: z.string(),
  suction_velo: z.string(),
  suction_velo_unit: z.string(),
  discharge_velo: z.string(),
  discharge_velo_unit: z.string(),
  bep_head: z.number(),
  bep_head_unit: z.string(),
  bep_flow: z.string(),
  bep_flow_unit: z.string(),
  hyd_power: z.number(),
  hyd_power_unit: z.string(),
  voltage: z.string(),
  voltage_unit: z.string(),
  power_required_cal: z.string(),
  power_required_cal_unit: z.string(),
  power_min_flow: z.number(),
  power_min_flow_unit: z.string(),
  power_max_flow: z.number(),
  power_max_flow_unit: z.string(),
  power_bep_flow: z.number(),
  power_bep_flow_unit: z.string(),
  suggest_motor: z.number(),
  tank_position: z.string().optional(),
  tank_design: z.string().optional(),
  tank_pressure: z.number().optional(),
  suction_head: z.number().optional(),
  suction_pipe_length: z.number().optional(),
  discharge_pipe_length_h: z.number().optional(),
  discharge_pipe_length_v: z.number().optional(),
  suction_pipe_id: z.number(),
  discharge_pipe_id: z.string(),
  suction_elbow: z.number().optional(),
  suction_tee: z.number().optional(),
  suction_reducer: z.number().optional(),
  suction_valve: z.number().optional(),
  suction_y_strainer: z.number().optional(),
  suction_other: z.number().optional(),
  suction_equi_length: z.number().optional(),
  discharge_equi_length: z.number().optional(),
  discharge_elbow: z.number().optional(),
  discharge_tee: z.number().optional(),
  discharge_reducer: z.number().optional(),
  discharge_valve: z.number().optional(),
  discharge_y_strainer: z.number().optional(),
  discharge_other: z.number().optional(),
  diffuser_mat_id: z.number().optional(),
  diffuser_mat: z.number().optional(),
  materials_wear_ring_id: z.number().optional(),
  materials_wear_ring: z.string().optional(),
  sleeve_mat_id: z.number().optional(),
  sleeve_mat: z.string().optional(),
  bearing_housing_mat_id: z.number().optional(),
  bearing_housing_mat: z.string().optional(),
  gland_mat: z.string().optional(),
  casing_gas: z.string().optional(),
  oring_gas: z.number().optional(),
  impeller_gas: z.string().optional(),
  pump_lining_mat: z.string().optional(),
  base_plate: z.string().optional(),
  concentration: z.number().optional(),
  pump_status: z.string(),
});

export const PumpCustomerDetailSchema = z.object({
  doc_customer: z.string(),
  doc_no: z.string(),
  doc_date: z.string(),
});

export const PumpGeneralDetailSchema = z.object({
  location: z.string().optional(),
  brand: z.string(),
  model: z.string(),
  tag_no: z.string(),
  serial_no: z.string(),
  pump_standard_id: z.string(),
  pump_standard: z.string(),
  pump_type_id: z.string(),
  pump_type_name: z.string(),
  stage: z.number().optional(),
  pump_design: z.string(),
});


export const AddingUnitLOVSchema = z.object({
  unit_name: z.string(),
  unit_value: z.string(),
});
export const AddingPumpLOVSchema = z.object({
  data_type: z.string(),
  data_name: z.string(),
  data_value: z.string(),
  additional_1: z.string().optional(),
  additional_2: z.string().optional(),
  additional_3: z.string().optional(),
})

export const PumpMaterialDetailSchema = z.object({
  casing_mat_id: z.number().optional(),
  casing_mat: z.string().optional(),
  impeller_mat_id: z.number().optional(),
  impeller_mat: z.string().optional(),
  shaft_mat_id: z.number().optional(),
  shaft_mat: z.string().optional(),
});

export const PumpApplicationDataSchema = z.object({
  media: z.string(),
  viscosity: z.number(),
  viscosity_unit: z.string(),
  vapor_pressure: z.number(),
  vapor_pressure_unit: z.string(),
  solid_type: z.string().optional(),
  solid_diameter: z.string().optional(),
});

export const PumpMotorGeneralDetailSchema = z.object({
  motor_brand: z.string().optional(),
  motor_model: z.string().optional(),
  motor_serial_no: z.string().optional(),
  motor_drive_id: z.number().optional(),
  motor_drive: z.string().optional(),
  motor_frame: z.string().optional(),
  motor_protection: z.string().optional(),
  motor_standard: z.string().optional(),
  motor_ie: z.string().optional(),
  motor_speed: z.number(),
  motor_speed_unit: z.string(),
  motor_rated: z.number(),
  motor_rated_unit: z.string(),
  motor_factor: z.number(),
  motor_connection: z.string().optional(),
  motor_phase: z.number(),
  motor_efficiency: z.string(),
  motor_efficiency_unit: z.string(),
});

export const PumpCouplingDetailsSchema = z.object({
  coup_model: z.string().optional(),
  coup_brand: z.string().optional(),
  coup_type: z.string(),
  coup_size: z.string().optional(),
  coup_spacer: z.number().optional(),
});

export const PumpImpellerDetailsSchema = z.object({
  impeller_type_id: z.number().optional(),
  impeller_type: z.string().optional(),
  design_impeller_dia: z.number(),
  impeller_max: z.number().optional(),
});

export const PumpTechnicalDataSchema = z.object({
  pump_speed: z.number(),
  pump_speed_unit: z.string(),
  pump_efficiency: z.string(),
  pump_efficiency_unit: z.string(),
  min_head: z.string(),
  min_head_unit: z.string(),
  max_head: z.string(),
  max_head_unit: z.string(),
  npshr: z.string(),
  npshr_unit: z.string(),
  design_flow: z.string(),
  design_flow_unit: z.string(),
  design_head: z.string(),
  design_head_unit: z.string(),
});

export const PumpMechanicalSealGeneralDetailsSchema = z.object({
  mech_seal_cham: z.string().optional(),
});

export const PumpMechanicalSealDetailsSchema = z.object({
  mech_api_id: z.string(),
  mech_api_plan: z.string().optional(),
  mech_main_temp: z.number().optional(),
  mech_main_pre: z.number().optional(),
  mech_brand: z.string().optional(),
  mech_model: z.string().optional(),
  mech_size: z.number().optional(),
  mech_size_unit: z.string().optional(),
  mech_design_id: z.number().optional(),
  mech_design: z.string().optional(),
  mech_material: z.string().optional(),
});

export const PumpFlangeDetailsSchema = z.object({
  pump_suction_size_id: z.string().optional(),
  pump_suction_size: z.string().optional(),
  pump_suction_rating_id: z.string().optional(),
  pump_suction_rating: z.string().optional(),
  pump_discharge_size_id: z.string().optional(),
  pump_discharge_size: z.string().optional(),
  pump_discharge_rating_id: z.string().optional(),
  pump_discharge_rating: z.string().optional(),
  suction_pipe_data_id: z.string(),
  suction_pipe_size: z.string(),
  suction_pipe_rating: z.string().optional(),
  suction_pipe_sch: z.string(),
  discharge_pipe_data_id: z.string(),
  discharge_pipe_size: z.string(),
  discharge_pipe_rating: z.string().optional(),
  discharge_pipe_sch: z.string(),
});

export const PumpBearingDetailsSchema = z.object({
  rotation_de_id: z.number(),
  rotation_de: z.string(),
  bearing_nde: z.string().optional(),
  bearing_num: z.string().optional(),
  bearing_lubric_type: z.string().optional(),
  bearing_lubric_brand: z.string().optional(),
  bearing_lubric_no: z.string().optional(),
  bearing_de: z.string().optional(),
  bearing_de_no: z.string().optional(),
  bearing_last_chg_dt: z.date().optional(),
});
