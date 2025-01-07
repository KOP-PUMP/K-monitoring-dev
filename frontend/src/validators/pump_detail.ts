import { z } from "zod";

  export const PumpDetailSchema = z.object({
    /* #1.Pump general detail group. Cell color "Yellow" */
    location: z.string().optional(), 
    brand: z.string().optional(),
    model: z.string().optional(),
    tag_no: z.string().optional(),
    serial_no: z.string().optional(),
    pump_standard_id: z.string().optional(),
    pump_standard: z.string().optional(),
    pump_standard_no: z.string().optional(),
    pump_type_id: z.string().optional(),
    pump_type_name: z.string().optional(),
    stage: z.string().optional(),
    pump_design: z.string().optional(),
    /* #2. Pump technical detail group. cell color "Red" */
    pump_speed: z.string().optional(),
    pump_speed_unit: z.string().optional(),
    pump_efficiency: z.string().optional(),
    pump_efficiency_unit: z.string().optional(),
    design_flow: z.string().optional(),
    design_flow_unit: z.string().optional(),
    design_head: z.string().optional(),
    design_head_unit: z.string().optional(),
    min_head: z.string().optional(),
    min_head_unit: z.string().optional(),
    npshr: z.string().optional(),
    npshr_unit: z.string().optional(),
    power_required_cal: z.string().optional(),
    power_required_cal_unit: z.string().optional(),
    /* #3. Pump application data group. cell color "Dark orange" */
    media: z.string().optional(),
    viscosity: z.string().optional(),
    viscosity_unit: z.string().optional(),
      /*pump_temp: z.string().optional(),*/
      /*boiling_point: z.string().optional(),*/
    vapor_pressure: z.string().optional(),
    vapor_pressure_unit: z.string().optional(),
    solid_type: z.string().optional(),
    solid_diameter: z.string().optional(),
      /*percent_solid: z.string().optional()*/
  })

  export const MotorAndCouplingDetailSchema = z.object({
    /* #4. Motor general details group. cell color "Green"  */
    motor_brand: z.string().optional(),
    motor_model: z.string().optional(),
    motor_serial_no: z.string().optional(),
    motor_drive: z.string().optional(),
    motor_frame: z.string().optional(),
    motor_protection: z.string().optional(),
    motor_standard: z.string().optional(),
    motor_ie: z.string().optional(),
    motor_speed: z.string().optional(),
    motor_speed_unit: z.string().optional(),
    motor_rate:z.string().optional(),
    motor_rate_unit:z.string().optional(),
    motor_factor:z.string().optional(),
    motor_connection:z.string().optional(),
    motor_phase: z.string().optional(),
    motor_efficiency: z.string().optional(),
    motor_efficiency_unit:z.string().optional(),
    voltage:z.string().optional(),
    voltage_unit:z.string().optional(),
    pump_lining_mat:z.string().optional(),
    /* #5. Coupling details group. cell color "Purple" */
    coup_model:z.string().optional(),
    coup_brand:z.string().optional(),
    coup_type:z.string().optional(),
    coup_size:z.string().optional(),
    coup_spacer:z.string().optional(),
  })

    export const MaterialAndImpellerDetailSchema = z.object({
      /* #6.Material and Impeller details group. cell color "Dark green"*/
    casing_mat:z.string().optional(),
    shaft_mat:z.string().optional(),
    impeller_type: z.string().optional(),
    design_impeller_dia: z.string().optional(),
    impeller_max: z.string().optional(),
    impeller_mat:z.string().optional(),
    impeller_gas:z.string().optional(),
    })


    export const MechanicalSealDetailSchema = z.object({
      /* #8. Mechanical seal group. color "Brown" */
    mech_quantity:z.string().optional(),
    mech_seal_cham: z.string().optional(),
    mech_brand:z.string().optional(),
    mech_model:z.string().optional(),
    mech_size_unit:z.string().optional(),
    mech_api_plan:z.string().optional(),
    mech_design:z.string().optional(),
    mech_material:z.string().optional(),
    mech_main_temp:z.string().optional(),
    mech_main_pre:z.string().optional(),
    mech_size:z.string().optional(),
    })

    export const FlangeAndBearingDetailSchema = z.object({
      /* #9. Flange Details group. color "Pink" */
      pump_suction_size:z.string().optional(),
      pump_suction_size_unit:z.string().optional(),
      pump_suction_rating:z.string().optional(),
      suction_pipe_size:z.string().optional(),
      suction_pipe_rating:z.string().optional(),
      suction_pipe_sch:z.string().optional(),
      pump_discharge_size:z.string().optional(),
      pump_discharge_size_unit:z.string().optional(),
      pump_discharge_rating:z.string().optional(),
      discharge_pipe_size:z.string().optional(),
      discharge_pipe_rating:z.string().optional(),
      discharge_pipe_sch:z.string().optional(),
      /* #10. Bearing Details group. color "Turquoise" */
      rotation_de:z.string().optional(),
      bearing_lubric_type:z.string().optional(), 
      bearing_lubric_brand:z.string().optional(),
      bearing_lubric_no:z.string().optional(), 
      bearing_nde:z.string().optional(), 
      bearing_num:z.string().optional(), 
      bearing_de:z.string().optional(), 
      bearing_de_no:z.string().optional(), 
      bearing_last_chg_dt:z.string().optional(),
      bearing_house_mat:z.string().optional(),   
    })
