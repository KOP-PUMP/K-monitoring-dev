from django.db import models
import uuid
from users.models import UserProfile 
from pump_data.models import PumpDetail


class EngineerReport(models.Model):
    report_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    pump_detail = models.ForeignKey(PumpDetail, on_delete=models.SET_NULL,null=True)
    user_detail = models.ForeignKey(UserProfile, on_delete=models.SET_NULL,null=True)
    report_name = models.CharField(max_length=100 , blank=False, null=False)
    report_detail = models.CharField(max_length=100 , blank=True, null=True)
    remark = models.CharField(max_length=100 , blank=True, null=True)
    report_file = models.FileField(upload_to='report/',max_length=1000, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_engineer_report'
    
    def __str__(self):
        return f"{self.report_name}"

class EngineerReportCheck(models.Model):
    check_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    doc_customer = models.TextField(max_length=50, blank=True, null=True)
    doc_no = models.TextField(max_length=50, blank=True, null=True)
    doc_number_engineer = models.TextField(max_length=50, blank=True, null=True)
    timestamp = models.TextField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_engineer_report_check'

    def __str__(self):
        return f"{self.doc_customer}"
    
class EngineerReportCheck(models.Model):
    check_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    doc_customer = models.TextField(max_length=50, blank=True, null=True)
    doc_no = models.TextField(max_length=50, blank=True, null=True)
    doc_number_engineer = models.TextField(max_length=50, blank=True, null=True)
    timestamp = models.TextField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_engineer_report_check'

    def __str__(self):
        return f"{self.doc_customer}"
    
class EngineerReportCheckCal(models.Model):
    check_cal_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    check_id = models.ForeignKey(EngineerReportCheck, on_delete=models.CASCADE,null=True)

    test_speed = models.FloatField(blank=True, null=True)
    test_speed_unit = models.TextField(max_length=10, blank=True, null=True)
    flow_ope = models.FloatField(blank=True, null=True)
    flow_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    suction_pres_ope = models.FloatField(blank=True, null=True)
    suction_pres_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    discharge_pres_ope = models.FloatField(blank=True, null=True)
    discharge_pres_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    diff_pres_ope = models.FloatField(blank=True, null=True)
    diff_pres_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    current_i1_ope = models.FloatField(blank=True, null=True)
    current_i1_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    current_i2_ope = models.FloatField(blank=True, null=True)
    current_i2_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    current_i3_ope = models.FloatField(blank=True, null=True)
    current_i3_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    i_avg_ope = models.FloatField(blank=True, null=True)
    i_avg_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    v_avg_ope = models.FloatField(blank=True, null=True)
    v_avg_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    motor_power = models.FloatField(blank=True, null=True)
    motor_power_unit = models.TextField(max_length=10, blank=True, null=True)
    shaft_ope = models.FloatField(blank=True, null=True)
    shaft_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    head_ope = models.FloatField(blank=True, null=True)
    head_ope_unit = models.TextField(max_length=10, blank=True, null=True)
    head_shut = models.FloatField(blank=True, null=True)
    head_shut_unit = models.TextField(max_length=10, blank=True, null=True)
    head_max = models.FloatField(blank=True, null=True)
    head_max_unit = models.TextField(max_length=10, blank=True, null=True)
    env_temp = models.FloatField(blank=True, null=True)
    env_temp_unit = models.TextField(max_length=10, blank=True, null=True)
    liquid_temp = models.FloatField(blank=True, null=True)
    liquid_temp_unit = models.TextField(max_length=10, blank=True, null=True)
    npsha = models.FloatField(blank=True, null=True)
    npsha_unit = models.TextField(max_length=10, blank=True, null=True)
    npsha_actual = models.FloatField(blank=True, null=True)
    npsha_actual_unit = models.TextField(max_length=10, blank=True, null=True)
    suction_fluid_velo = models.FloatField(blank=True, null=True)
    suction_fluid_velo_unit = models.TextField(max_length=10, blank=True, null=True)
    discharge_fluid_velo = models.FloatField(blank=True, null=True)
    discharge_fluid_velo_unit = models.TextField(max_length=10, blank=True, null=True)
    remarks = models.TextField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'tbl_engineer_report_check_cal'

    def __str__(self):
        return f"{self.check_id}"
    
class EngineerReportCheckVibration(models.Model):
    check_vibration_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    check_id = models.ForeignKey(EngineerReportCheck, on_delete=models.CASCADE,null=True)
    
    v_pump_de_h = models.FloatField(blank=True, null=True)
    v_pump_de_h_unit = models.TextField(max_length=10, blank=True, null=True)
    v_pump_de_v = models.FloatField(blank=True, null=True)
    v_pump_de_v_unit = models.TextField(max_length=10, blank=True, null=True)
    v_pump_de_a = models.FloatField(blank=True, null=True)
    v_pump_de_a_unit = models.TextField(max_length=10, blank=True, null=True)
    v_pump_nde_h = models.FloatField(blank=True, null=True)
    v_pump_nde_h_unit = models.TextField(max_length=10, blank=True, null=True)
    v_pump_nde_v = models.FloatField(blank=True, null=True)
    v_pump_nde_v_unit = models.TextField(max_length=10, blank=True, null=True)
    v_pump_nde_a = models.FloatField(blank=True, null=True)
    v_pump_nde_a_unit = models.TextField(max_length=10, blank=True, null=True)
    v_motor_de_h = models.FloatField(blank=True, null=True)
    v_motor_de_h_unit = models.TextField(max_length=10, blank=True, null=True)
    v_motor_de_v = models.FloatField(blank=True, null=True)
    v_motor_de_v_unit = models.TextField(max_length=10, blank=True, null=True)
    v_motor_de_a = models.FloatField(blank=True, null=True)
    v_motor_de_a_unit = models.TextField(max_length=10, blank=True, null=True)
    v_motor_nde_h = models.FloatField(blank=True, null=True)
    v_motor_nde_h_unit = models.TextField(max_length=10, blank=True, null=True)
    v_motor_nde_v = models.FloatField(blank=True, null=True)
    v_motor_nde_v_unit = models.TextField(max_length=10, blank=True, null=True)
    v_motor_nde_a = models.FloatField(blank=True, null=True)
    v_motor_nde_a_unit = models.TextField(max_length=10, blank=True, null=True)
    a_pump_de_h = models.FloatField(blank=True, null=True)
    a_pump_de_h_unit = models.TextField(max_length=10, blank=True, null=True)
    a_pump_de_v = models.FloatField(blank=True, null=True)
    a_pump_de_v_unit = models.TextField(max_length=10, blank=True, null=True)
    a_pump_de_a = models.FloatField(blank=True, null=True)
    a_pump_de_a_unit = models.TextField(max_length=10, blank=True, null=True)
    a_pump_nde_h = models.FloatField(blank=True, null=True)
    a_pump_nde_h_unit = models.TextField(max_length=10, blank=True, null=True)
    a_pump_nde_v = models.FloatField(blank=True, null=True)
    a_pump_nde_v_unit = models.TextField(max_length=10, blank=True, null=True)
    a_pump_nde_a = models.FloatField(blank=True, null=True)
    a_pump_nde_a_unit = models.TextField(max_length=10, blank=True, null=True)
    a_motor_de_h = models.FloatField(blank=True, null=True)
    a_motor_de_h_unit = models.TextField(max_length=10, blank=True, null=True)
    a_motor_de_v = models.FloatField(blank=True, null=True)
    a_motor_de_v_unit = models.TextField(max_length=10, blank=True, null=True)
    a_motor_de_a = models.FloatField(blank=True, null=True)
    a_motor_de_a_unit = models.TextField(max_length=10, blank=True, null=True)
    a_motor_nde_h = models.FloatField(blank=True, null=True)
    a_motor_nde_h_unit = models.TextField(max_length=10, blank=True, null=True)
    a_motor_nde_v = models.FloatField(blank=True, null=True)
    a_motor_nde_v_unit = models.TextField(max_length=10, blank=True, null=True)
    a_motor_nde_a = models.FloatField(blank=True, null=True)
    a_motor_nde_a_unit = models.TextField(max_length=10, blank=True, null=True)
    temp_pump_nde = models.FloatField(blank=True, null=True)
    temp_pump_nde_unit = models.TextField(max_length=10, blank=True, null=True)
    temp_pump_de = models.FloatField(blank=True, null=True)
    temp_pump_de_unit = models.TextField(max_length=10, blank=True, null=True)
    temp_motor_nde = models.FloatField(blank=True, null=True)
    temp_motor_nde_unit = models.TextField(max_length=10, blank=True, null=True)
    temp_motor_de = models.FloatField(blank=True, null=True)
    temp_motor_de_unit = models.TextField(max_length=10, blank=True, null=True)
    env_vibration = models.FloatField(blank=True, null=True)
    env_vibration_unit = models.TextField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'tbl_engineer_report_check_vibration'

    def __str__(self):
        return f"{self.check_id}"
    

class EngineerReportCheckVisual(models.Model):
    check_visual_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    check_id = models.ForeignKey(EngineerReportCheck, on_delete=models.CASCADE,null=True)

    alignment_check = models.TextField(max_length=50, blank=True, null=True)
    coupling_check = models.TextField(max_length=50, blank=True, null=True)
    suction_valve_check = models.TextField(max_length=50, blank=True, null=True)
    rotate_hand_check = models.TextField(max_length=50, blank=True, null=True)
    axial_hand_check = models.TextField(max_length=50, blank=True, null=True)
    gap_check = models.TextField(max_length=50, blank=True, null=True)
    discharge_valve_check = models.TextField(max_length=50, blank=True, null=True)
    bolt_check = models.TextField(max_length=50, blank=True, null=True)
    oil_grease_check = models.TextField(max_length=50, blank=True, null=True)
    electricity_check = models.TextField(max_length=50, blank=True, null=True)
    service_check = models.TextField(max_length=50, blank=True, null=True)
    leakage_check = models.TextField(max_length=50, blank=True, null=True)
    corrosion_check = models.TextField(max_length=50, blank=True, null=True)
    painting_check = models.TextField(max_length=50, blank=True, null=True)
    noise_run_check = models.TextField(max_length=50, blank=True, null=True)
    oil_grease_run_check = models.TextField(max_length=50, blank=True, null=True)
    leakage_run_check = models.TextField(max_length=50, blank=True, null=True)
    mechanical_run_check = models.TextField(max_length=50, blank=True, null=True)
    cavitation_run_check = models.TextField(max_length=50, blank=True, null=True)
    corrosion_run_check = models.TextField(max_length=50, blank=True, null=True)
    suction_valve_run_check = models.TextField(max_length=50, blank=True, null=True)
    discharge_valve_run_check = models.TextField(max_length=50, blank=True, null=True)
    painting_run_check = models.TextField(max_length=50, blank=True, null=True)
    electric_connectivity_run_check = models.TextField(max_length=50, blank=True, null=True)
    service_piping_run_check = models.TextField(max_length=50, blank=True, null=True)
    bolt_nut_run_check = models.TextField(max_length=50, blank=True, null=True)
    barrier_fluid_run_pres_check = models.TextField(max_length=50, blank=True, null=True)
    remarks_check = models.TextField(max_length=50, blank=True, null=True)
    alignment_remark = models.TextField(max_length=50, blank=True, null=True)
    coupling_remark = models.TextField(max_length=50, blank=True, null=True)
    suction_valve_remark = models.TextField(max_length=50, blank=True, null=True)
    painting_remark = models.TextField(max_length=50, blank=True, null=True)
    rotating_remark = models.TextField(max_length=50, blank=True, null=True)
    axial_hand_remark = models.TextField(max_length=50, blank=True, null=True)
    gap_remark = models.TextField(max_length=50, blank=True, null=True)
    discharge_valve_remark = models.TextField(max_length=50, blank=True, null=True)
    bolt_remark = models.TextField(max_length=50, blank=True, null=True)
    oil_remark = models.TextField(max_length=50, blank=True, null=True)
    electricity_remark = models.TextField(max_length=50, blank=True, null=True)
    service_remark = models.TextField(max_length=50, blank=True, null=True)
    leakage_remark = models.TextField(max_length=50, blank=True, null=True)
    corrosion_remark = models.TextField(max_length=50, blank=True, null=True)
    noise_remark = models.TextField(max_length=50, blank=True, null=True)
    noise_run_remark = models.TextField(max_length=50, blank=True, null=True)
    oil_run_remark = models.TextField(max_length=50, blank=True, null=True)
    leakage_run_remark = models.TextField(max_length=50, blank=True, null=True)
    mechanical_run_remark = models.TextField(max_length=50, blank=True, null=True)
    cavitation_run_remark = models.TextField(max_length=50, blank=True, null=True)
    corrosion_run_remark = models.TextField(max_length=50, blank=True, null=True)
    suction_valve_run_remark = models.TextField(max_length=50, blank=True, null=True)
    discharge_valve_run_remark = models.TextField(max_length=50, blank=True, null=True)
    painting_run_remark = models.TextField(max_length=50, blank=True, null=True)
    electric_connectivity_run_remark = models.TextField(max_length=50, blank=True, null=True)
    service_piping_run_remark = models.TextField(max_length=50, blank=True, null=True)
    bolt_nut_run_remark = models.TextField(max_length=50, blank=True, null=True)
    barrier_fluid_run_pres_remark = models.TextField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'tbl_engineer_report_check_visual'

    def __str__(self):
        return f"{self.check_id}"
    
class EngineerReportCheckResult(models.Model):
    check_result_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    check_id = models.TextField(max_length=50, blank=True, null=True)

    speed_suggest = models.TextField(max_length=100, blank=True, null=True)
    flow_suggest = models.TextField(max_length=100, blank=True, null=True)
    npshr_suggest = models.TextField(max_length=100, blank=True, null=True)
    velocity_suggest = models.TextField(max_length=100, blank=True, null=True)
    boiling_point_suggest = models.TextField(max_length=100, blank=True, null=True)
    current_suggest = models.TextField(max_length=100, blank=True, null=True)
    power_suggest = models.TextField(max_length=100, blank=True, null=True)
    api_suggest = models.TextField(max_length=100, blank=True, null=True)
    buffer_suggest = models.TextField(max_length=100, blank=True, null=True)
    bearing_suggest = models.TextField(max_length=100, blank=True, null=True)
    vibration_suggest = models.TextField(max_length=100, blank=True, null=True)
    bearing_temp_suggest = models.TextField(max_length=100, blank=True, null=True)
    timestamp = models.TextField(max_length=100, blank=True, null=True)
    range_30_110_result = models.TextField(max_length=100, blank=True, null=True)
    range_30_110_suggest = models.TextField(max_length=100, blank=True, null=True)
    range_30_110_remark = models.TextField(max_length=100, blank=True, null=True)
    npshr_npsha_result = models.TextField(max_length=100, blank=True, null=True)
    npshr_npsha_suggest = models.TextField(max_length=100, blank=True, null=True)
    npshr_npsha_remark = models.TextField(max_length=100, blank=True, null=True)
    pump_standard_result = models.TextField(max_length=100, blank=True, null=True)
    pump_standard_suggest = models.TextField(max_length=100, blank=True, null=True)
    pump_standard_remark = models.TextField(max_length=100, blank=True, null=True)
    power_result = models.TextField(max_length=100, blank=True, null=True)
    power_remark = models.TextField(max_length=100, blank=True, null=True)
    fulid_temp_result = models.TextField(max_length=100, blank=True, null=True)
    fulid_temp_suggest = models.TextField(max_length=100, blank=True, null=True)
    fulid_temp_remark = models.TextField(max_length=100, blank=True, null=True)
    bearing_temp_result = models.TextField(max_length=100, blank=True, null=True)
    bearing_temp_remark = models.TextField(max_length=100, blank=True, null=True)
    v_pump_de_h_result = models.TextField(max_length=100, blank=True, null=True)
    v_pump_de_v_result = models.TextField(max_length=100, blank=True, null=True)
    v_pump_de_a_result = models.TextField(max_length=100, blank=True, null=True)
    v_pump_nde_h_result = models.TextField(max_length=100, blank=True, null=True)
    v_pump_nde_v_result = models.TextField(max_length=100, blank=True, null=True)
    v_pump_nde_a_result = models.TextField(max_length=100, blank=True, null=True)
    v_motor_de_h_result = models.TextField(max_length=100, blank=True, null=True)
    v_motor_de_v_result = models.TextField(max_length=100, blank=True, null=True)
    v_motor_de_a_result = models.TextField(max_length=100, blank=True, null=True)
    v_motor_nde_h_result = models.TextField(max_length=100, blank=True, null=True)
    v_motor_nde_v_result = models.TextField(max_length=100, blank=True, null=True)
    v_motor_nde_a_result = models.TextField(max_length=100, blank=True, null=True)
    a_pump_de_h_result = models.TextField(max_length=100, blank=True, null=True)
    a_pump_de_v_result = models.TextField(max_length=100, blank=True, null=True)
    a_pump_de_a_result = models.TextField(max_length=100, blank=True, null=True)
    a_pump_nde_h_result = models.TextField(max_length=100, blank=True, null=True)
    a_pump_nde_v_result = models.TextField(max_length=100, blank=True, null=True)
    a_pump_nde_a_result = models.TextField(max_length=100, blank=True, null=True)
    a_motor_de_h_result = models.TextField(max_length=100, blank=True, null=True)
    a_motor_de_v_result = models.TextField(max_length=100, blank=True, null=True)
    a_motor_de_a_result = models.TextField(max_length=100, blank=True, null=True)
    a_motor_nde_h_result = models.TextField(max_length=100, blank=True, null=True)
    a_motor_nde_v_result = models.TextField(max_length=100, blank=True, null=True)
    a_motor_nde_a_result = models.TextField(max_length=100, blank=True, null=True)
    v_pump_suggest = models.TextField(max_length=100, blank=True, null=True)
    v_pump_remark = models.TextField(max_length=100, blank=True, null=True)
    v_motor_suggest = models.TextField(max_length=100, blank=True, null=True)
    v_motor_remark = models.TextField(max_length=100, blank=True, null=True)
    a_pump_suggest = models.TextField(max_length=100, blank=True, null=True)
    a_pump_remark = models.TextField(max_length=100, blank=True, null=True)
    a_motor_suggest = models.TextField(max_length=100, blank=True, null=True)
    a_motor_remark = models.TextField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'tbl_engineer_report_check_result'

    def __str__(self):
        return f"{self.check_id}"