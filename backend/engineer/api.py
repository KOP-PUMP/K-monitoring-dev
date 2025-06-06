from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV, PumpDetail, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV, MediaLOV
from pump_data.schema.pump_lov import KMonitoringLOV_schema, PumpDetailLOV_schema, PumpDetail_schema, MotorDetailLOV_schema, ShaftSealLOV_schema, PumpMaterialLOV_schema, MediaLOV_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from datetime import datetime
from django.http import JsonResponse , FileResponse
from openpyxl import Workbook, load_workbook
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import uuid
import os

@api_controller('/report', tags=['Report'])
class ReportController:
    @http_post('/')
    def create_report_lov(self, request, payload: PumpDetail_schema):
        try:
            # Construct the absolute path
            template_path = os.path.join(os.path.dirname(__file__),'report_templates', 'engineer_form.xlsx')

            # Load workbook and access the active sheet
            wb = load_workbook(template_path)
            ws = wb.active
            sheet1 = wb.worksheets[0]
            sheet2 = wb.worksheets[1]
            sheet3 = wb.worksheets[2]
            sheet4 = wb.worksheets[3]

            #Fill cells
            sheet1['AV1'] = payload.doc_customer
            sheet1['AV2'] = payload.company_code
            sheet1['AV3'] = payload.pump_code_name

            current_time = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
            filename = f"report_{current_time}.xlsx"
            file_path = os.path.join(os.path.dirname(__file__),'report', filename)
            wb.save(file_path)    

            #return JsonResponse({
            #    "success": True,
            #    "message": f"Report {filename} created successfully",
            #}, status=200)
            
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=filename)
        
        except Exception as e:
            return JsonResponse({"error": {"error": str(e)}}, status=400)