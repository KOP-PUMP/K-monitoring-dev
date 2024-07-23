import { z } from "zod";

const ImpellerSchema = z.object({
  impeller_type_id: z.number(),
  impeller_type_name: z.string(),
});

const MechSealApiPlanSchema = z.object({
  mech_api_id: z.number(),
  mech_api_plan: z.string(),
});

const BearingSchema = z.object({
  rotation_de_id: z.number(),
  rotation: z.string(),
});

const CasingMaterialSchema = z.object({
  mat_cover_id: z.number(),
  mat_cover_name: z.string(),
  mat_cover_type: z.string(),
});

const FlangRatingSchema = z.object({
  flang_rating_id: z.number(),
  flang_rating_name: z.string(),
});

const MechanicalDesignSchema = z.object({
  mech_design_id: z.number(),
  mech_design_name: z.string(),
});

const PumpDetailSchema = z.object({
  pump_id: z.number(),
  pump_design: z.string(),
  pump_type: z.string(),
});

const MotorDetailSchema = z.object({
  motor_drive_id: z.number(),
  drive_system: z.string(),
  ie_class: z.string(),
  standard: z.string(),
});

const SuctionPipeInfoSchema = z.object({
  pipe_lov_id: z.number(),
  pipe_sch: z.string(),
  pipe_size: z.string(),
  pipe_id: z.string(),
  fac_number: z.string(),
  equipment: z.string(),
  brand: z.string(),
  short_model: z.string(),
  model: z.string(),
  data_type: z.string(),
  sequence: z.number(),
  rpm: z.number(),
  imp_dia: z.number(),
  flow: z.number(),
  head: z.number(),
  eff: z.number(),
  npshr: z.number(),
  kw: z.number(),
  curve_format: z.string(),
  eff_rl: z.string(),
  eff_status: z.number(),
  eff_distance: z.number(),
  tolerance: z.number(),
  scale_xy: z.number(),
  update_time: z.string(),
  dry_sat: z.string(),
  liquid: z.number(),
});

const PumpStandardSchema = z.object({
  pump_standard_id: z.number(),
  name: z.string(),
});

const SuctionDischargeDetailSchema = z.object({
  id: z.number(),
  suction_discharge_value: z.string(),
});

const FaceMaterialDetailSchema = z.object({
  mat_face_id: z.number(),
  mat_face_name: z.string(),
  mat_face_type: z.string(),
});

const SpringMaterialDetailSchema = z.object({
  mat_spring_id: z.number(),
  mat_spring_name: z.string(),
  mat_spring_type: z.string(),
});

const VibrationDetailSchema = z.object({
  voltage: z.string(),
  acceptable: z.string(),
  unsatisfied: z.string(),
  unacceptable: z.string(),
});

const DropdownSchema = z.object({
  impeller_list: z.array(ImpellerSchema),
  mech_seal_api_plan_list: z.array(MechSealApiPlanSchema),
  bearing_list: z.array(BearingSchema),
  casing_material_list: z.array(CasingMaterialSchema),
  flang_rating_list: z.array(FlangRatingSchema),
  mechanical_design_list: z.array(MechanicalDesignSchema),
  pump_detail_list: z.array(PumpDetailSchema),
  motor_detail_list: z.array(MotorDetailSchema),
  suction_pipe_info_list: z.array(SuctionPipeInfoSchema),
  pump_standard_list: z.array(PumpStandardSchema),
  suction_discharge_detail_list: z.array(SuctionDischargeDetailSchema),
  face_material_detail: z.array(FaceMaterialDetailSchema),
  spring_material_detail: z.array(SpringMaterialDetailSchema),
  vibration_detail: z.array(VibrationDetailSchema),
});

export default DropdownSchema;
