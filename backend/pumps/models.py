import re

from math import pi

from django.db import models
from django.utils import timezone
from django.db.models import Max

from users.models import CustomUser

class ImpellerList(models.Model):
    impeller_type_id = models.AutoField(primary_key=True)
    impeller_type_name = models.TextField()

    def __str__(self):
        return self.impeller_type_name
    class Meta:
        db_table = 'tbl_impeller_type_lov'

class MechSealApiPlanList(models.Model):
    mech_api_id = models.AutoField(primary_key=True)
    mech_api_plan = models.CharField(max_length=25)

    def __str__(self) -> str:
        return self.mech_api_plan

    class Meta:
        db_table = 'tbl_api_lov'

class BearingList(models.Model):
    rotation_de_id = models.AutoField(primary_key=True)
    rotation = models.TextField()

    def __str__(self) -> str:
        return self.rotation

    class Meta:
        db_table = 'tbl_bearing_lov'

class CasingMaterialList(models.Model):
    mat_cover_id = models.AutoField(primary_key=True) # casing_mat_id
    mat_cover_name = models.TextField()
    mat_cover_type = models.TextField()

    def __str__(self) -> str:
        return self.mat_cover_name

    class Meta:
        db_table = 'tbl_cover_mat_lov'

class FlangRatingList(models.Model):
    flang_rating_id = models.AutoField(primary_key=True) # pump_suction_rating_id / discharge_rating_id
    flang_rating_name = models.TextField() # pump_suction_rating / discharge_rating

    def __str__(self) -> str:
        return self.flang_rating_name

    class Meta:
        db_table = 'tbl_flang_rating_lov'


class UnitList(models.Model):
    """Store unit of measurement."""
    # CATEGORY_CHOICES = [
    #     ('density', 'Density'),
    #     ('viscosity', 'Viscosity'),
    #     ('flow', 'Flow'),
    #     ('pressure', 'Pressure'),
    #     ('speed', 'Speed'),
    #     ('head', 'Head'),
    #     ('npsh', 'NPSH'),
    #     ('power', 'Power'),
    #     ('voltage', 'Voltage'),
    #     ('efficiency', 'Efficiency'),
    #     ('size', 'Size'),
    #     ('current', 'Current'),
    #     ('vibration', 'Vibration'),
    #     ('acceleration', 'Acceleration'),
    #     ('temperature', 'Temperature'),
    #     ('velocity', 'Velocity'),
    #     ('other', 'Other'),
    # ]
    k_lov_id = models.AutoField(primary_key=True)
    field_id = models.CharField(max_length=50)
    field_value = models.CharField(max_length=50)
    # category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self) -> str:
        return f"{self.field_id} | {self.field_value}"

    class Meta:
        db_table = 'tbl_k_monitoring_lov'

class MechanicalDesignList(models.Model):
    mech_design_id = models.AutoField(primary_key=True)
    mech_design_name = models.TextField()

    def __str__(self) -> str:
        return self.mech_design_name

    class Meta:
        db_table = 'tbl_mech_design_lov'

class PumpDetailList(models.Model):
    pump_id = models.AutoField(primary_key=True)
    pump_design = models.TextField() # pump_design
    pump_type = models.TextField() # pump_type_name

    def __str__(self) -> str:
        return self.pump_type

    class Meta:
        db_table = 'tbl_pump_detail_lov'

class MotorDetailList(models.Model):
    motor_drive_id = models.AutoField(primary_key=True)
    drive_system = models.CharField(max_length=30, blank=True, null=True)
    ie_class = models.CharField(max_length=30, blank=True, null=True)
    standard = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.drive_system} | {self.ie_class} | {self.standard}" 

    class Meta:
        db_table = 'tbl_motor_detail_lov'

class SuctionPipeInfoList(models.Model):
    pipe_lov_id = models.AutoField(primary_key=True) # suction_pipe_data_id + discharge_pipe_data_id + suction_pipe_id
    pipe_sch = models.TextField() # suction_pipe_sch + discharge_pipe_sch
    pipe_size = models.TextField() # suction_pipe_size + discharge_pipe_size
    pipe_id = models.TextField() # value not id
    fac_number = models.CharField(max_length=20)
    equipment = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    short_model = models.CharField(max_length=50) # change
    model = models.CharField(max_length=50)
    data_type = models.CharField(max_length=10)
    sequence = models.IntegerField()
    rpm = models.IntegerField()
    imp_dia = models.DecimalField(max_digits=10, decimal_places=0)
    flow = models.DecimalField(max_digits=15, decimal_places=0)
    head = models.DecimalField(max_digits=15, decimal_places=0)
    eff = models.IntegerField()
    npshr = models.DecimalField(max_digits=15, decimal_places=0)
    kw = models.DecimalField(max_digits=15, decimal_places=0)
    curve_format = models.CharField(max_length=20)
    eff_rl = models.CharField(max_length=10)
    eff_status = models.IntegerField()
    eff_distance = models.DecimalField(max_digits=15, decimal_places=0)
    tolerance = models.IntegerField()
    scale_xy = models.DecimalField(max_digits=15, decimal_places=0)
    update_time = models.DateTimeField()
    dry_sat = models.CharField(max_length=10)
    liquid = models.DecimalField(max_digits=15, decimal_places=0)

    class Meta:
        db_table = 'tbl_pipe_sch_lov'

class PumpStandardList(models.Model):
    pump_standard_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name

    class Meta:
        db_table = 'tbl_pump_standard_lov'

class SuctionDischargeDetailList(models.Model):
    # pump_suction_size_id, pump_discharge_size_id
    # flang_sch_id = models.AutoField(db_column='flang_SCH_id', primary_key=True)  # Field name made lowercase.
    # flang_sch_name = models.TextField(db_column='flang_SCH_name')  # Field name made lowercase.
    id = models.AutoField(primary_key=True)
    suction_discharge_value = models.TextField()

    def __str__(self) -> str:
        return self.suction_discharge_value

    class Meta:
        db_table = 'tbl_suction_discharge_lov'


class PumpDetail(models.Model):
    """
    General details of pump.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    pump_id = models.AutoField(primary_key=True)
    doc_customer = models.TextField()
    doc_no = models.TextField(unique=True, max_length=500) # three character of doc_customer + two character of brand + running_number (think on the case that might be duplicate)
    doc_date = models.TextField()
    brand = models.TextField()
    model = models.TextField()
    tag_no = models.TextField()
    pump_type_id = models.ForeignKey(PumpDetailList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_type_name')
    # pump_type_name = models.TextField()
    serial_no = models.TextField()
    media = models.TextField()
    pump_standard_id = models.ForeignKey(PumpStandardList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_standard')
    # pump_standard = models.TextField()
    # pump_design = models.TextField()
    stage = models.IntegerField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    design_temp = models.FloatField()
    max_temp = models.FloatField()
    solid_type = models.TextField(blank=True, null=True)
    solid_diameter = models.TextField(blank=True, null=True)
    density = models.FloatField()
    density_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='density_units')
    viscosity = models.FloatField()
    viscosity_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='viscosity_units')
    max_flow = models.IntegerField()
    max_flow_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='max_flow_units')
    min_flow = models.IntegerField()
    min_flow_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='min_flow_units')
    vapor_pressure = models.FloatField()
    vapor_pressure_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='vapor_pressure_units')
    pump_speed = models.IntegerField()
    pump_speed_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_speed_units')
    design_flow = models.FloatField()
    design_flow_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='design_flow_units')
    design_head = models.FloatField()
    design_head_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='design_head_units')
    min_head = models.FloatField()
    min_head_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='min_head_units')
    max_head = models.FloatField()
    max_head_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='max_head_units')
    suction_velo = models.FloatField()
    suction_velo_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='suction_velo_units')
    discharge_velo = models.FloatField()
    discharge_velo_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='discharge_velo_units')
    bep_head = models.IntegerField()
    bep_head_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='bep_head_units')
    bep_flow = models.FloatField()
    bep_flow_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='bep_flow_units')
    npshr = models.FloatField()
    npshr_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='npshr_units')
    pump_efficiency = models.FloatField()
    pump_efficiency_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_efficiency_units')
    hyd_power = models.FloatField()
    hyd_power_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='hyd_power_units')
    voltage = models.FloatField()
    voltage_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='voltage_units')
    power_required_cal = models.FloatField() # Change to Float
    power_required_cal_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='power_required_cal_units')
    power_min_flow = models.IntegerField()
    power_min_flow_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='power_min_flow_units')
    power_max_flow = models.IntegerField()
    power_max_flow_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='power_max_flow_units')
    power_bep_flow = models.IntegerField()
    power_bep_flow_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='power_bep_flow_units')
    suggest_motor = models.FloatField()
    pump_suction_size_id = models.ForeignKey(SuctionDischargeDetailList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_suction_size')
    # pump_suction_size = models.TextField(blank=True, null=True)
    pump_suction_rating_id = models.ForeignKey(FlangRatingList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_suction_rating')
    # pump_suction_rating = models.TextField(blank=True, null=True)
    pump_discharge_size_id = models.ForeignKey(SuctionDischargeDetailList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_discharge_size')
    # pump_discharge_size = models.TextField(blank=True, null=True)
    pump_discharge_rating_id = models.ForeignKey(FlangRatingList, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_discharge_rating')
    # pump_discharge_rating = models.TextField(blank=True, null=True)
    suction_pipe_data_id = models.ForeignKey(SuctionPipeInfoList, on_delete=models.SET_NULL, null=True, blank=True, related_name='suction_pipe_data')
    suction_pipe_size = models.TextField()
    suction_pipe_rating = models.TextField(blank=True, null=True)
    suction_pipe_sch = models.TextField()
    discharge_pipe_data_id = models.ForeignKey(SuctionPipeInfoList, on_delete=models.SET_NULL, null=True, blank=True, related_name='discharge_pipe_data')
    discharge_pipe_size = models.TextField()
    discharge_pipe_rating = models.TextField(blank=True, null=True)
    discharge_pipe_sch = models.TextField()
    tank_position = models.TextField(blank=True, null=True)
    tank_design = models.TextField(blank=True, null=True)
    tank_pressure = models.FloatField(blank=True, null=True)
    suction_head = models.FloatField(blank=True, null=True)
    suction_pipe_length = models.FloatField(blank=True, null=True)
    discharge_pipe_length_h = models.IntegerField(blank=True, null=True)
    discharge_pipe_length_v = models.IntegerField(blank=True, null=True)
    suction_pipe_id = models.ForeignKey(SuctionPipeInfoList, on_delete=models.SET_NULL, null=True, blank=True, related_name='suction_pipe_id')
    discharge_pipe_id = models.ForeignKey(SuctionPipeInfoList, on_delete=models.SET_NULL, null=True, blank=True, related_name='discharge_pipe_id')
    suction_elbow = models.IntegerField(blank=True, null=True)
    suction_tee = models.FloatField(blank=True, null=True)
    suction_reducer = models.FloatField(blank=True, null=True)
    suction_valve = models.FloatField(blank=True, null=True)
    suction_y_strainer = models.FloatField(blank=True, null=True)
    suction_other = models.FloatField(blank=True, null=True)
    suction_equi_length = models.FloatField(blank=True, null=True)
    discharge_equi_length = models.FloatField(blank=True, null=True)
    discharge_elbow = models.IntegerField(blank=True, null=True)
    discharge_tee = models.FloatField(blank=True, null=True)
    discharge_reducer = models.FloatField(blank=True, null=True)
    discharge_valve = models.FloatField(blank=True, null=True)
    discharge_y_strainer = models.FloatField(blank=True, null=True)
    discharge_other = models.FloatField(blank=True, null=True)
    casing_mat_id = models.ForeignKey(CasingMaterialList, on_delete=models.SET_NULL, null=True, blank=True, related_name='casing_mat')
    # casing_mat = models.TextField(blank=True, null=True)
    shaft_mat_id = models.IntegerField(blank=True, null=True)
    shaft_mat = models.TextField(blank=True, null=True)
    diffuser_mat_id = models.IntegerField(blank=True, null=True)
    diffuser_mat = models.IntegerField(blank=True, null=True)
    impeller_type_id = models.ForeignKey(ImpellerList, on_delete=models.SET_NULL, null=True, blank=True, related_name='impeller_type')
    # impeller_type = models.TextField(blank=True, null=True)
    design_impeller_dia = models.IntegerField()
    impeller_max = models.IntegerField(blank=True, null=True)
    impeller_mat_id = models.IntegerField(blank=True, null=True)
    impeller_mat = models.TextField(blank=True, null=True)
    materials_wear_ring_id = models.IntegerField(blank=True, null=True)
    materials_wear_ring = models.TextField(blank=True, null=True)
    bearing_nde = models.TextField(blank=True, null=True)
    bearing_num = models.TextField(blank=True, null=True)
    bearing_lubric_type = models.TextField(blank=True, null=True)
    bearing_lubric_brand = models.TextField(blank=True, null=True)
    bearing_lubric_no = models.TextField(blank=True, null=True)
    rotation_de_id = models.ForeignKey(BearingList, on_delete=models.SET_NULL, null=True, blank=True, related_name='rotation_de')
    # rotation_de = models.TextField()
    bearing_de = models.TextField(blank=True, null=True)
    bearing_de_no = models.TextField(blank=True, null=True)
    bearing_last_chg_dt = models.DateTimeField(blank=True, null=True)
    sleeve_mat_id = models.IntegerField(blank=True, null=True)
    sleeve_mat = models.TextField(blank=True, null=True)
    bearing_housing_mat_id = models.IntegerField(blank=True, null=True)
    bearing_housing_mat = models.TextField(blank=True, null=True)
    gland_mat = models.TextField(blank=True, null=True)
    casing_gas = models.TextField(blank=True, null=True)
    oring_gas = models.FloatField(blank=True, null=True)
    impeller_gas = models.TextField(blank=True, null=True)
    pump_lining_mat = models.TextField(blank=True, null=True)
    base_plate = models.TextField(blank=True, null=True)
    coup_model = models.TextField(blank=True, null=True)
    coup_brand = models.TextField(blank=True, null=True)
    coup_type = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='coup_type')
    coup_size = models.TextField(blank=True, null=True)
    coup_spacer = models.IntegerField(blank=True, null=True)
    motor_brand = models.TextField(blank=True, null=True)
    motor_model = models.TextField(blank=True, null=True)
    motor_serial_no = models.TextField(blank=True, null=True)
    motor_drive_id = models.ForeignKey(MotorDetailList, on_delete=models.SET_NULL, null=True, blank=True, related_name='motor')
    # motor_drive = models.TextField(blank=True, null=True)
    motor_frame = models.TextField(blank=True, null=True)
    motor_protection = models.TextField(blank=True, null=True)
    # motor_standard = models.TextField(blank=True, null=True)
    # motor_ie = models.TextField(blank=True, null=True)
    motor_speed = models.IntegerField()
    motor_speed_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='motor_speed_units')
    motor_rated = models.FloatField()
    motor_rated_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='motor_rated_units')
    motor_factor = models.FloatField()
    motor_connection = models.TextField(blank=True, null=True)
    motor_phase = models.IntegerField()
    motor_efficiency = models.TextField()
    motor_efficiency_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='motor_efficiency_units')
    mech_api_id = models.ForeignKey(MechSealApiPlanList, on_delete=models.SET_NULL, null=True, blank=True, related_name='mech_api')
    # mech_api_plan = models.CharField(max_length=25, blank=True, null=True)
    mech_main_temp = models.IntegerField(blank=True, null=True)
    mech_main_pre = models.IntegerField(blank=True, null=True)
    mech_seal_cham = models.TextField(blank=True, null=True)
    mech_brand = models.TextField(blank=True, null=True)
    mech_model = models.TextField(blank=True, null=True)
    mech_size = models.IntegerField(blank=True, null=True)
    mech_size_unit = models.ForeignKey(UnitList, on_delete=models.SET_NULL, null=True, blank=True, related_name='mech_size_units')
    mech_design_id = models.ForeignKey(MechanicalDesignList, on_delete=models.SET_NULL, null=True, blank=True, related_name='mech_design')
    mech_design = models.TextField(blank=True, null=True) # ref
    mech_material = models.TextField(blank=True, null=True)
    concentration = models.IntegerField(blank=True, null=True)
    pump_status = models.TextField()
    timestamp = models.DateTimeField(auto_now=True)

    # TODO: These are variable that need to be calculated
    # max_flow : Derived from curve at 30 % BEP in case no curve can be input
    # min_flow : Derived from curve at 110 % BEP
    # min_head : Derived from curve at 30 % BEP
    # max_head : Derived from curve at 110 % BEP
    #? HDONE: suction_velo : Derived from tbl_pump_detail.design_flow/ (π*900*tbl_pump_detail.suction_pipe_id*tbl_pump_detail.suction_pipe_id in meter)
    #? HDONE: discharge_velo : Derived from tbl_pump_detail.design_flow/ (π*900*tbl_pump_detail.discharge_pipe_id*tbl_pump_detail.discharge_pipe_id in meter)
    # bep_head : Derived from curve at BEP
    # bep_flow : Derived from curve at BEP
    # npshr : Derived from curve at  tbl_pump_detail.design_flow
    # pump_efficiency : Derived from curve at  tbl_pump_detail.design_flow
    #? HDONE: hyd_power : Derived from tbl_pump_detail.design_flow in m³/h * tbl_pump_detail.design_head in meter *tbl_pump_detail.density in sg *9.81/3600 the result will be in kW
    #! DONE: power_required_cal : Derived from tbl_pump_detail.hyd_power/tbl_pump_detail.pump_efficiency in decimal of percentage
    #! DONE: power_min_flow : Derived from tbl_pump_detail.min_flow_unit in m³/h*tbl_pump_detail.min_head in meter *tbl_pump_detail.density in sg *9.81/3600*tbl_pump_detail.pump_efficiency in decimal of percentage the result will be in kW
    # power_max_flow : Derived from tbl_pump_detail.max_flow in m³/h * tbl_pump_detail.max_head in meter *tbl_pump_detail.density in sg *9.81/3600*tbl_pump_detail.pump_efficiency in decimal of percentage the result will be in kW
    # power_bep_flow : Derived from tbl_pump_detail.bep_flow in m³/h *tbl_pump_detail.bep_head in meter *tbl_pump_detail.density in sg *9.81/3600*tbl_pump_detail.pump_efficiency in decimal of percentage the result will be in kW
    #! DONE: suggest_motor : Derived from tbl_pump_detail.power_required_cal *1.15 and selected the upper motor size from tbl_k_monitoring_lov.field_value where tbl_k_monitoring_lov.field_id = "tbl_pump_detail_suggest_motor_range"
    # doc_number_engineer : "Derived from the latest tbl_engineering_check.doc_number_engineer + 1/year where tbl_engineering_check.doc_no = tbl_pump_detail.doc_no"
    # suction_fluid_velo : Derived from tbl_engineering_check.flow_ope/ (π*900*tbl_pump_detail.suction_pipe_id*tbl_pump_detail.suction_pipe_id in meter)
    # discharge_fluid_velo : Derived from tbl_engineering_check.flow_ope/ (π*900*tbl_pump_detail.discharge_pipe_id*tbl_pump_detail.discharge_pipe_id in meter)

    def calculate_suction_velo(self):
        # Derived from tbl_pump_detail.design_flow/ (π*900*tbl_pump_detail.suction_pipe_id*tbl_pump_detail.suction_pipe_id in meter)
        self.suction_velo = (self.design_flow)/(pi*900*self.suction_pipe_id*self.suction_pipe_id)

    def calculate_discharge_velo(self):
        # Derived from tbl_pump_detail.design_flow/ (π*900*tbl_pump_detail.discharge_pipe_id*tbl_pump_detail.discharge_pipe_id in meter)
        self.discharge_velo = (self.design_flow)/(pi*900*self.discharge_pipe_id*self.discharge_pipe_id)

    def calculate_hyd_power(self):
        # Derived from tbl_pump_detail.design_flow in m³/h * tbl_pump_detail.design_head in
        # meter *tbl_pump_detail.density in sg *9.81/3600 the result will be in kW
        self.hyd_power = self.design_flow * self.design_head * self.density * 9.81 / 3600

    def generate_doc_no(self):
        """Generate a unique document number."""
        customer_initials = re.sub(r'[^A-Za-z]', '', self.doc_customer)[:3].upper()
        brand_initials = re.sub(r'[^A-Za-z]', '', self.brand)[:2].upper()

        prefix = f"{customer_initials}{brand_initials}"
        existing_docs = PumpDetail.objects.filter(doc_no__startswith=prefix)
        if existing_docs.exists():
            max_doc_no = existing_docs.aggregate(Max('doc_no'))['doc_no__max']
            running_number = int(max_doc_no[-3:]) + 1
        else:
            running_number = 1

        running_number_str = f"{running_number:03d}"
        new_doc_no = f"{prefix}{running_number_str}"
        return new_doc_no

    def calculate_power_required_cal(self):
        # Derived from tbl_pump_detail.hyd_power/tbl_pump_detail.pump_efficiency in decimal of percentage
        self.power_required_cal = self.hyd_power / (float(self.pump_efficiency) / 100)

    def calculate_power_min_flow(self):
        # Derived from tbl_pump_detail.min_flow_unit in m³/h*tbl_pump_detail.min_head in meter *tbl_pump_detail.density in sg *9.81/3600*tbl_pump_detail.pump_efficiency 
        # in decimal of percentage the result will be in kW
        # TODO: Check if the formula is correct
        self.power_min_flow = self.min_flow * self.min_head * self.density * 9.81 / 3600 * self.pump_efficiency

    def calculate_suggest_motor(self):
        # Derived from tbl_pump_detail.power_required_cal *1.15 and selected the upper motor size from 
        # tbl_k_monitoring_lov.field_value where tbl_k_monitoring_lov.field_id = "tbl_pump_detail_suggest_motor_range"
        power_required = self.power_required_cal * 1.15
        motor_size = UnitList.objects.filter(field_id='tbl_pump_detail_suggest_motor_range').filter(field_value__gte=power_required).first()
        if motor_size:
            self.suggest_motor = float(motor_size.field_value[:-2])
        else:
            self.suggest_motor = 11

    def save(self, *args, **kwargs):
        self.doc_no = self.generate_doc_no()
        self.calculate_power_required_cal()
        self.calculate_suggest_motor()
        super().save(*args, **kwargs)

    @property
    def pump_design(self):
        return self.pump_type_id.pump_design
    
    @property
    def pump_type_name(self):
        return self.pump_type_id.pump_type
    
    @property
    def pump_standard(self):
        return self.pump_standard_id.name

    @property
    def pump_suction_size(self):
        return self.pump_suction_size_id.suction_discharge_value
    
    @property
    def pump_suction_rating(self):
        return self.pump_suction_rating_id.flang_rating_name
    
    @property
    def pump_discharge_size(self):
        return self.pump_discharge_size_id.suction_discharge_value
    
    @property
    def pump_discharge_rating(self):
        return self.pump_discharge_rating_id.flang_rating_name
    
    @property
    def casing_mat(self):
        if self.casing_mat_id:
            return self.casing_mat_id.mat_cover_name
        return ""
    
    @property
    def impeller_type(self):
        return self.impeller_type_id.lmpeller_type_name
    
    @property
    def rotation_de(self):
        return self.rotation_de_id.rotation
    
    @property
    def motor_drive(self):
        return self.motor_drive_id.drive_system

    @property
    def motor_standard(self):
        return self.motor_drive_id.standard

    @property
    def motor_ie(self):
        return self.motor_drive_id.ie_class

    @property
    def mech_api_plan(self):
        return self.mech_api_id.mech_api_plan

    class Meta:
        db_table = 'tbl_pump_detail'
        verbose_name = "PUMP"
        verbose_name_plural = "PUMPS"

class FaceMaterialDetail(models.Model):
    mat_face_id = models.AutoField(primary_key=True)
    mat_face_name = models.TextField()
    mat_face_type = models.TextField()

    def __str__(self) -> str:
        return self.mat_face_name + ' | ' + self.mat_face_type

    class Meta:
        db_table = 'tbl_face_mat_lov'

class SpringMaterialDetail(models.Model):
    mat_spring_id = models.AutoField(primary_key=True)
    mat_spring_name = models.TextField()
    mat_spring_type = models.TextField()

    def __str__(self) -> str:
        return self.mat_spring_id + ' | ' + self.mat_spring_type

    class Meta:
        db_table = 'tbl_spring_mat_lov'

class VibrationDetail(models.Model):
    voltage = models.CharField(max_length=30, blank=True, null=True)
    acceptable = models.CharField(max_length=10, blank=True, null=True)
    unsatisfied = models.CharField(max_length=10, blank=True, null=True)
    unacceptable = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self) -> str:
        return self.voltage + ' | ' + self.acceptable + ' | ' + self.unsatisfied + ' | ' + self.unacceptable

    class Meta:
        db_table = 'tbl_vibration_lov'


class EngineeringDetail(models.Model):
    """Details of pump those engineer need to check."""
    id = models.AutoField(primary_key=True)
    pump_id = models.ForeignKey(PumpDetail, on_delete=models.CASCADE, related_name='engineering_details')

    check_id = models.IntegerField()
    doc_customer = models.CharField(max_length=50)
    doc_no = models.CharField(max_length=50)
    doc_number_engineer = models.CharField(max_length=100)
    test_speed = models.FloatField()
    test_speed_unit = models.TextField()
    flow_ope = models.FloatField()
    flow_ope_unit = models.TextField()
    suction_pres_ope = models.FloatField()
    suction_pres_ope_unit = models.TextField()
    discharge_pres_ope = models.FloatField()
    discharge_pres_ope_unit = models.TextField()
    diff_pres_ope = models.FloatField()
    diff_pres_ope_unit = models.TextField()
    current_i1_ope = models.FloatField()
    current_i1_ope_unit = models.TextField()
    current_i2_ope = models.FloatField()
    current_i2_ope_unit = models.TextField()
    current_i3_ope = models.FloatField()
    current_i3_ope_unit = models.TextField()
    i_avg_ope = models.FloatField()
    i_avg_ope_unit = models.TextField()
    v_avg_ope = models.FloatField()
    v_avg_ope_unit = models.TextField()
    motor_shaft_ope = models.FloatField()
    motor_shaft_ope_unit = models.TextField()
    head_ope = models.FloatField()
    head_ope_unit = models.TextField()
    head_shut = models.FloatField()
    head_shut_unit = models.TextField()
    head_max = models.FloatField()
    head_max_unit = models.TextField()
    v_pump_de_h = models.FloatField()
    v_pump_de_h_unit = models.TextField()
    v_pump_de_v = models.FloatField()
    v_pump_de_v_unit = models.TextField()
    v_pump_de_a = models.FloatField()
    v_pump_de_a_unit = models.TextField()
    v_pump_nde_h = models.FloatField()
    v_pump_nde_h_unit = models.TextField()
    v_pump_nde_v = models.FloatField()
    v_pump_nde_v_unit = models.TextField()
    v_pump_nde_a = models.FloatField()
    v_pump_nde_a_unit = models.TextField()
    v_motor_de_h = models.FloatField()
    v_motor_de_h_unit = models.TextField()
    v_motor_de_v = models.FloatField()
    v_motor_de_v_unit = models.TextField()
    v_motor_de_a = models.FloatField()
    v_motor_de_a_unit = models.TextField()
    v_motor_nde_h = models.FloatField()
    v_motor_nde_h_unit = models.TextField()
    v_motor_nde_v = models.FloatField()
    v_motor_nde_v_unit = models.TextField()
    v_motor_nde_a = models.FloatField()
    v_motor_nde_a_unit = models.TextField()
    a_pump_de_h = models.FloatField()
    a_pump_de_h_unit = models.TextField()
    a_pump_de_v = models.FloatField()
    a_pump_de_v_unit = models.TextField()
    a_pump_de_a = models.FloatField()
    a_pump_de_a_unit = models.TextField()
    a_pump_nde_h = models.FloatField()
    a_pump_nde_h_unit = models.TextField()
    a_pump_nde_v = models.FloatField()
    a_pump_nde_v_unit = models.TextField()
    a_pump_nde_a = models.FloatField()
    a_pump_nde_a_unit = models.TextField()
    a_motor_de_h = models.FloatField()
    a_motor_de_h_unit = models.TextField()
    a_motor_de_v = models.FloatField()
    a_motor_de_v_unit = models.TextField()
    a_motor_de_a = models.FloatField()
    a_motor_de_a_unit = models.TextField()
    a_motor_nde_h = models.FloatField()
    a_motor_nde_h_unit = models.TextField()
    a_motor_nde_v = models.FloatField()
    a_motor_nde_v_unit = models.TextField()
    a_motor_nde_a = models.FloatField()
    a_motor_nde_a_unit = models.TextField()
    temp_pump_nde = models.FloatField()
    temp_pump_nde_unit = models.TextField()
    temp_pump_de = models.FloatField()
    temp_motor_nde = models.FloatField()
    temp_motor_de = models.FloatField()
    env_vibration = models.TextField()
    env_vibration_unit = models.TextField(null=True, blank=True)
    env_temp = models.FloatField()
    liquid_temp = models.FloatField()
    npsha = models.FloatField(null=True, blank=True)
    npsha_unit = models.TextField()
    suction_fluid_velo = models.FloatField()
    suction_fluid_velo_unit = models.TextField()
    discharge_fluid_velo = models.FloatField()
    discharge_fluid_velo_unit = models.TextField()
    remarks = models.TextField(null=True, blank=True)
    alignment_check = models.BooleanField(default=False)
    coupling_check = models.BooleanField(default=False)
    suction_valve_check = models.BooleanField(default=False)
    painting_check = models.BooleanField(default=False)
    rotate_hand_check = models.BooleanField(default=False)
    axial_hand_check = models.BooleanField(default=False)
    gap_check = models.BooleanField(default=False)
    discharge_valve_check = models.BooleanField(default=False)
    bolt_check = models.BooleanField(default=False)
    oil_grease_check = models.BooleanField(default=False)
    electricity_check = models.BooleanField(default=False)
    service_check = models.BooleanField(default=False)
    leakage_check = models.BooleanField(default=False)
    corrosion_check = models.BooleanField(default=False)
    noise_check = models.BooleanField(default=False)
    noise_run_check = models.BooleanField(default=False)
    oil_grease_run_check = models.BooleanField(default=False)
    leakage_run_check = models.BooleanField(default=False)
    mechanical_run_check = models.BooleanField(default=False)
    cavitation_run_check = models.BooleanField(default=False)
    corrosion_run_check = models.BooleanField(default=False)
    suction_valve_run_check = models.BooleanField(default=False)
    discharge_valve_run_check = models.BooleanField(default=False)
    painting_run_check = models.BooleanField(default=False)
    electric_connectivity_run_check = models.BooleanField(default=False)
    service_piping_run_check = models.BooleanField(default=False)
    bolt_nut_run_check = models.BooleanField(default=False)
    barrier_fluid_run_pres_check = models.BooleanField(default=False)
    alignment_remark = models.TextField(null=True, blank=True)
    coupling_remark = models.TextField(null=True, blank=True)
    suction_valve_remark = models.TextField(null=True, blank=True)
    painting_remark = models.TextField(null=True, blank=True)
    rotating_remark = models.TextField(null=True, blank=True)
    axial_hand_remark = models.TextField(null=True, blank=True)
    gap_remark = models.TextField(null=True, blank=True)
    discharge_valve_remark = models.TextField(null=True, blank=True)
    bolt_remark = models.TextField(null=True, blank=True)
    oil_remark = models.TextField(null=True, blank=True)
    electricity_remark = models.TextField(null=True, blank=True)
    service_remark = models.TextField(null=True, blank=True)
    leakage_remark = models.TextField(null=True, blank=True)
    corrosion_remark = models.TextField(null=True, blank=True)
    noise_remark = models.TextField(null=True, blank=True)
    noise_run_remark = models.TextField(null=True, blank=True)
    oil_run_remark = models.TextField(null=True, blank=True)
    leakage_run_remark = models.TextField(null=True, blank=True)
    mechanical_run_remark = models.TextField(null=True, blank=True)
    cavitation_run_remark = models.TextField(null=True, blank=True)
    corrosion_run_remark = models.TextField(null=True, blank=True)
    suction_valve_run_remark = models.TextField(null=True, blank=True)
    discharge_valve_run_remark = models.TextField(null=True, blank=True)
    painting_run_remark = models.TextField(null=True, blank=True)
    electric_connectivity_run_remark = models.TextField(null=True, blank=True)
    service_piping_run_remark = models.TextField(null=True, blank=True)
    bolt_nut_run_remark = models.TextField(null=True, blank=True)
    barrier_fluid_run_pres_remark = models.TextField(null=True, blank=True)
    speed_suggest = models.TextField(null=True, blank=True)
    flow_suggest = models.TextField(null=True, blank=True)
    npshr_suggest = models.TextField(null=True, blank=True)
    velocity_suggest = models.TextField(null=True, blank=True)
    boiling_point_suggest = models.TextField(null=True, blank=True)
    current_suggest = models.TextField(null=True, blank=True)
    power_suggest = models.TextField(null=True, blank=True)
    api_suggest = models.TextField(null=True, blank=True)
    buffer_suggest = models.TextField(null=True, blank=True)
    bearing_suggest = models.TextField(null=True, blank=True)
    vibration_suggest = models.TextField(null=True, blank=True)
    bearing_temp_suggest = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField()

    def save(self, *args, **kwargs):
        self.timestamp = timezone.now()
        return super(PumpDetail, self).save(*args, **kwargs)

    class Meta:
        db_table = 'tbl_engineering_check'


class FactoryTable(models.Model):
    id = models.AutoField(primary_key=True)
    fac_number = models.CharField(max_length=20, null=True)
    equipment = models.CharField(max_length=50, null=True)
    brand = models.CharField(max_length=50)
    model_short = models.CharField(max_length=20)
    model = models.CharField(max_length=50, null=True)
    data_type = models.CharField(max_length=10, null=True)
    se_quence = models.IntegerField()
    rpm = models.IntegerField()
    imp_dia = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    flow = models.DecimalField(max_digits=15, decimal_places=4, null=True)
    head = models.DecimalField(max_digits=15, decimal_places=4, null=True)
    eff = models.IntegerField(null=True, blank=True)
    npshr = models.DecimalField(max_digits=15, decimal_places=4, null=True)
    kw = models.DecimalField(max_digits=15, decimal_places=4, null=True)
    curve_format = models.CharField(max_length=20)
    eff_rl = models.CharField(max_length=10)
    eff_status = models.IntegerField()
    eff_distance = models.DecimalField(max_digits=15, decimal_places=4)
    tolerance = models.IntegerField()
    scale_xy = models.DecimalField(max_digits=15, decimal_places=4)
    update_time = models.DateTimeField()
    dry_sat = models.CharField(max_length=10)
    liquid = models.DecimalField(max_digits=15, decimal_places=4)

    class Meta:
        db_table = 'factory_table'