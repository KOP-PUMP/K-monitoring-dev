from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV, PumpDetail, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV, MediaLOV
from engineer.models import EngineerReport
from users.models import UserProfile, CustomUser
from engineer.schema.engineer import EngineerReportPayLoad_schema, EngineerReport_schema
from pump_data.schema.pump_lov import KMonitoringLOV_schema, PumpDetailLOV_schema, PumpDetail_schema, MotorDetailLOV_schema, ShaftSealLOV_schema, PumpMaterialLOV_schema, MediaLOV_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from datetime import datetime
from django.http import JsonResponse , FileResponse, Http404
from openpyxl import Workbook, load_workbook
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import uuid
import os

@api_controller('/engineer', tags=['Report'])
class ReportController:
    @http_post('/report')
    def create_report_lov(self, request, payload: EngineerReportPayLoad_schema):
        try:
            #return JsonResponse({"massage": payload.dict()}, status=400)
            # Construct the absolute path
            template_path = os.path.join(os.path.dirname(__file__),'report_templates', 'engineer_form.xlsx')

            # Load workbook and access the active sheet
            wb = load_workbook(template_path)
            ws = wb.active
            sheet1 = wb.worksheets[0]
            sheet2 = wb.worksheets[1]
            sheet3 = wb.worksheets[2]
            sheet4 = wb.worksheets[3]

            pump_detail_dict = payload.dict()
            
            # Fill cells using the dictionary
            sheet1['G6'] = pump_detail_dict.get('company_name_en', 'Advanced Biochemical (Thailand) Co., Ltd.')
            sheet1['G7'] = pump_detail_dict.get('company_name_en', 'Advanced Biochemical (Thailand) Co., Ltd.')
            sheet1['G8'] = pump_detail_dict.get('pump_brand', 'KOP')
            sheet1['G9'] = pump_detail_dict.get('motor_brand', 'Siemens')
            sheet1['G10'] = pump_detail_dict.get('suggest_motor', '30.03')
            sheet1['Q10'] = pump_detail_dict.get('voltage', '400')
            sheet1['U8'] = pump_detail_dict.get('pump_model', 'KOP KDIN 150-20')
            sheet1['U9'] = pump_detail_dict.get('motor_model', '1LE0021-2AB4')
            sheet1['AJ7'] = pump_detail_dict.get('tag_no', '40151503AS21')
            sheet1['AJ8'] = pump_detail_dict.get('serial_no', '45903-1007-0123')
            sheet1['AJ9'] = pump_detail_dict.get('motor_serial_no', 'LMH-2209/800028751851/004')
            sheet1['AE10'] = pump_detail_dict.get('pump_stage', '1')
            sheet1['AL10'] = pump_detail_dict.get('pump_speed', '1450')
            sheet1['AJ6'] = datetime.now().strftime("%Y-%m-%d")
            
            sheet2['G6'] = pump_detail_dict.get('company_name_en', 'Advanced Biochemical (Thailand) Co., Ltd.')
            sheet2['G7'] = pump_detail_dict.get('company_name_en', 'Advanced Biochemical (Thailand) Co., Ltd.')
            sheet2['G8'] = pump_detail_dict.get('pump_brand', 'KOP')
            sheet2['G9'] = pump_detail_dict.get('motor_brand', 'Siemens')
            sheet2['G10'] = pump_detail_dict.get('suggest_motor', '30.03')
            sheet2['Q10'] = pump_detail_dict.get('voltage', '400')
            sheet2['U8'] = pump_detail_dict.get('pump_model', 'KOP KDIN 150-20')
            sheet2['U9'] = pump_detail_dict.get('motor_model', '1LE0021-2AB4')
            sheet2['AJ7'] = pump_detail_dict.get('tag_no', '40151503AS21')
            sheet2['AJ8'] = pump_detail_dict.get('serial_no', '45903-1007-0123')
            sheet2['AJ9'] = pump_detail_dict.get('motor_serial_no', 'LMH-2209/800028751851/004')
            sheet2['AE10'] = pump_detail_dict.get('pump_stage', '1')
            sheet2['AL10'] = pump_detail_dict.get('pump_speed', '1450')
            sheet2['AJ6'] = datetime.now().strftime("%Y-%m-%d")

            sheet3['G6'] = pump_detail_dict.get('company_name_en', 'Advanced Biochemical (Thailand) Co., Ltd.')
            sheet3['G7'] = pump_detail_dict.get('company_name_en', 'Advanced Biochemical (Thailand) Co., Ltd.')
            sheet3['G8'] = pump_detail_dict.get('pump_brand', 'KOP')
            sheet3['G9'] = pump_detail_dict.get('motor_brand', 'Siemens')
            sheet3['G10'] = pump_detail_dict.get('suggest_motor', '30.03')
            sheet3['Q10'] = pump_detail_dict.get('voltage', '400')
            sheet3['U8'] = pump_detail_dict.get('pump_model', 'KOP KDIN 150-20')
            sheet3['U9'] = pump_detail_dict.get('motor_model', '1LE0021-2AB4')
            sheet3['AJ7'] = pump_detail_dict.get('tag_no', '40151503AS21')
            sheet3['AJ8'] = pump_detail_dict.get('serial_no', '45903-1007-0123')
            sheet3['AJ9'] = pump_detail_dict.get('motor_serial_no', 'LMH-2209/800028751851/004')
            sheet3['AE10'] = pump_detail_dict.get('pump_stage', '1')
            sheet3['AL10'] = pump_detail_dict.get('pump_speed', '1450')
            sheet3['AJ6'] = datetime.now().strftime("%Y-%m-%d")
            

            current_time = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
            filename = f"report_{current_time}.xlsx"
            file_path = os.path.join(os.path.dirname(__file__),'report', filename)
            wb.save(file_path)


            pump_instance = PumpDetail.objects.get(pump_id=pump_detail_dict.get('pump_detail'))
            user_instance = UserProfile.objects.get(user__user_email=payload.user_detail)

            print({"pump_instance": pump_instance, "user_instance": user_instance, "filename": filename, "file_path": file_path})
            
            new_report = EngineerReport.objects.create(
                pump_detail=pump_instance,
                user_detail=user_instance,
                report_name=filename,
                report_file=file_path,
                created_by=payload.created_by,
                updated_by=payload.updated_by
            )    

            return JsonResponse({"Success": "Report created successfully and saved"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": {"error": str(e)}}, status=400)
        
    @http_get('/report', response=list[EngineerReport_schema])
    def get_report(self, request):
        access_user = request.GET.get('user')
        access_user_role = request.GET.get('user_role')
        pump_detail = request.GET.get('pump_detail')

        user = get_object_or_404(CustomUser, user_email=access_user, user_role=access_user_role)
        if user is None:
            return JsonResponse({"error": "Not allowed"}, status=404)

        try:
            if user.user_role in ["Engineer", "Admin", "Developer"]:
                report = EngineerReport.objects.filter(pump_detail=pump_detail)
            elif user.user_role == "Customer":
                report = EngineerReport.objects.filter(
                    pump_detail=pump_detail,
                    user_detail__user__user_email=user.user_email
                )
            else:
                return JsonResponse({"error": "Report not found"}, status=404)

            result = []
            for r_obj in report:
                r = {
                    "report_id": str(r_obj.report_id),
                    "pump_detail": str(r_obj.pump_detail_id) if r_obj.pump_detail else None,
                    "user_detail": r_obj.user_detail_id if r_obj.user_detail else None,
                    "report_name": r_obj.report_name,
                    "report_detail": r_obj.report_detail,
                    "remark": r_obj.remark,
                    "report_file": r_obj.report_file.url if r_obj.report_file else None,
                    "created_at": r_obj.created_at.isoformat(),
                    "created_by": r_obj.created_by,
                    "updated_at": r_obj.updated_at.isoformat(),
                    "updated_by": r_obj.updated_by,
                }
                result.append(r)

            return JsonResponse(result, safe=False, status=200)

        except EngineerReport.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)

    @http_get('/report/download')
    def open_report_local(self, request):
        report_id = request.GET.get('id')
        #report_id = "514bbdca-8bf0-4374-8091-a1662887bb36"
        #return JsonResponse({"report_id": report_id}, status=200)
        if report_id is None:
            return JsonResponse({"error": "Report ID is required"}, status=400)
        
        report = get_object_or_404(EngineerReport, pk=report_id)

        try:
            file_path = report.report_file.path

            print(file_path)

            if not os.path.exists(file_path):
                raise FileNotFoundError

            os.system(f'open "{file_path}"')

            return JsonResponse({"message": "File opened successfully"}, status=200)

        except FileNotFoundError:
            raise Http404("File not found")
        
    @http_delete('/report/{id}')
    def delete_report(self, request, id: str):
        uuid_id = UUID(id)
        data = get_object_or_404(EngineerReport, pk=uuid_id)
        data.delete()
        return JsonResponse({"success": True, "message": "Report deleted successfully"}, status=200)
