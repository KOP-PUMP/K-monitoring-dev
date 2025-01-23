from django.db import models
import uuid

# Create your models here.

#Model for list of values


#This is section of LOV data model include unit and pump lov
class KMonitoringLOV(models.Model):
    id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    type_name = models.CharField(max_length=100 , blank=False, null=False)
    product_name = models.CharField(max_length=100 , blank=False, null=False)
    data_value = models.CharField(max_length=100,blank=True, null=True)
    data_value2 = models.CharField(max_length=100,blank=True, null=True)
    data_value3 = models.CharField(max_length=100,blank=True, null=True)
    data_value4 = models.CharField(max_length=100,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.type_name
    
    # class Meta:
    #    db_table = 'tbl_k_monitoring_lov'
    
class PumpDetailLOV(models.Model):
    id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    pump_design = models.CharField(max_length=100 , blank=False, null=False)
    pump_type = models.CharField(max_length=100 , blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.pump_design
    
    # class Meta:
    #    db_table = 'tbl_pump_detail_lov'
    
class PumpStandardLOV(models.Model):
    id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    standard_name = models.CharField(max_length=100 , blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.standard_name
    
    # class Meta:
    #    db_table = 'tbl_pump_standard_lov' 

class MotorDetailLOV(models.Model):
    id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    ie_class = models.CharField(max_length=100 , blank=False, null=False)
    standard = models.CharField(max_length=100 , blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.ie_class
    
    # class Meta:
    #    db_table = 'tbl_motor_detail_lov'

class VibrationLOV(models.Model):
    id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    voltage = models.CharField(max_length=100 , blank=False, null=False)
    acceptable = models.CharField(max_length=100 , blank=False, null=False)
    unsatisfied = models.CharField(max_length=100 , blank=False, null=False)
    unacceptable = models.CharField(max_length=100 , blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.voltage
        
    # class Meta:
    #    db_table = 'tbl_vibration_lov'

#This is section of LOV data model include unit and pump lov
class PumpDetail(models.Model):
    #key is UUID
    pump_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    #1.Pump general detail group. Cell color "Yellow"
    location = models.TextField(max_length=100,blank=True, null=True)
    brand = models.TextField(max_length=100,blank=True, null=True)
    model = models.TextField(max_length=100,blank=True, null=True)
    tag_no = models.TextField(max_length=100,blank=True, null=True)
    serial_no = models.TextField(max_length=100,blank=True, null=True)
    pump_standard_id = models.ForeignKey(PumpDetailLOV, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_standard_id')
        #missing standard name from lov data that have value (DIN,ANSI,ISO,API)
    #standard_name = models.TextField(max_length=100,blank=True, null=True)
    pump_standard = models.TextField(max_length=100,blank=True, null=True)
    pump_type_id = models.ForeignKey(PumpDetailLOV, on_delete=models.SET_NULL, null=True, blank=True, related_name='pump_type_id')
    pump_type_name = models.CharField(max_length=50)
    pump_design = models.TextField(max_length=100,blank=True, null=True)   
    stage = models.TextField(max_length=100,blank=True, null=True)
    #2. Pump technical detail group. cell color "Red"
    #3. Motor General Details group. cell color "Green" 
    #4. Impeller Details group. cell color "Orange"
    #5. Motor General Details group. cell color "Blue"
    #6. Coupling Details group. cell color "Purple"
    #7. Mechanical Seal Details group. color "Gray"
    #8. Mechanical Seal group. color "Brown"
    #9. Flange Details group. color "Pink"
    #10. Bearing Details group. color "Turquoise"