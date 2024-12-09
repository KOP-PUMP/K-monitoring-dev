from django.db import models
import uuid

# Create your models here.

#Model for list of values

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

class PumpDetail(models.Model):
    pump_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    doc_customer = models.CharField(max_length=100 , blank=False, null=False)
    doc_no = models.CharField(max_length=100 , blank=False, null=False) 
    doc_date = models.CharField(max_length=100 , blank=False, null=False)
       
