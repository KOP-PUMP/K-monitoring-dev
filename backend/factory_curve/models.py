from django.db import models

# Create your models here.
class FactoryCurve(models.Model):
  id = models.AutoField(primary_key=True, editable=False)
  fac_number = models.CharField(max_length=100,blank=True, null=True)
  equipment = models.CharField(max_length=100,blank=True, null=True)
  brand = models.CharField(max_length=100,blank=True, null=True)
  model_short = models.CharField(max_length=100,blank=True, null=True)
  model = models.CharField(max_length=100,blank=True, null=True)
  data_type = models.CharField(max_length=100,blank=True, null=True)
  se_quence = models.CharField(max_length=100,blank=True, null=True)
  rpm = models.CharField(max_length=100,blank=True, null=True)
  imp_dia = models.CharField(max_length=100,blank=True, null=True)
  flow = models.CharField(max_length=100,blank=True, null=True)
  head = models.CharField(max_length=100,blank=True, null=True)
  eff = models.CharField(max_length=100,blank=True, null=True)
  npshr = models.CharField(max_length=100,blank=True, null=True)
  kw = models.CharField(max_length=100,blank=True, null=True)
  curve_format = models.CharField(max_length=100,blank=True, null=True)
  eff_rl = models.CharField(max_length=100,blank=True, null=True)
  eff_status = models.CharField(max_length=100,blank=True, null=True)
  eff_distance = models.CharField(max_length=100,blank=True, null=True)
  tolerance = models.CharField(max_length=100,blank=True, null=True)
  scale_xy = models.CharField(max_length=100,blank=True, null=True)
  update_time = models.CharField(max_length=100,blank=True, null=True)
  dry_sat = models.CharField(max_length=100,blank=True, null=True)
  liquid = models.CharField(max_length=100,blank=True, null=True)

  def __str__(self):
    return self.fac_number
  
  class Meta:
    db_table = 'tbl_factory_curve'

class FactoryCurveNumber(models.Model):
  id = models.AutoField(primary_key=True, editable=False)
  fac_number = models.CharField(max_length=100,blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
  created_by = models.CharField(max_length=100,blank=True, null=True)
  updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
  updated_by = models.CharField(max_length=100,blank=True, null=True)
  
  def __str__(self):
    return self.fac_number
  
  class Meta:
    db_table = 'tbl_factory_curve_number'
