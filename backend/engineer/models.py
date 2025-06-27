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
