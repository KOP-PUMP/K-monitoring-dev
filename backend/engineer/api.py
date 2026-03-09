from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV, PumpDetail, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV, MediaLOV
from engineer.models import EngineerReport, EngineerReportCheck, EngineerReportCheckCal, EngineerReportCheckVibration, EngineerReportCheckVisual, EngineerReportCheckResult
from users.models import UserProfile, CustomUser
from engineer.schema.engineer import EngineerReportPayLoad_schema, EngineerReport_schema, EngineerReportCheck_schema, EngineerReportCheckCal_schema, EngineerReportCheckVibe_schema, EngineerReportCheckVisual_schema, EngineerReportCheckResult_schema, EngineerReportCheckResultSubmit_schema, ReportCheckCalPayload_schema, EngineerReportData_schema
from pump_data.schema.pump_lov import KMonitoringLOV_schema, PumpDetailLOV_schema, PumpDetail_schema, MotorDetailLOV_schema, ShaftSealLOV_schema, PumpMaterialLOV_schema, MediaLOV_schema
from engineer.check_condition import ReportCheckResult
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from datetime import datetime
from django.http import JsonResponse , FileResponse, Http404
from openpyxl import Workbook, load_workbook
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core import serializers
import json
import uuid
import os
from factory_curve.schema.factory_curve import CalPumpPayload_schema


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
    
    @http_post('/report-create')
    def create_report(self, request, payload : EngineerReportData_schema):
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
            
            data_cal = pump_detail_dict.get('data_cal')
            data_vibe = pump_detail_dict.get('data_vibe')
            data_visual = pump_detail_dict.get('data_visual')
            data_result = pump_detail_dict.get('data_result')
            pump_data = pump_detail_dict.get('pump_data')
            user_data = pump_detail_dict.get('user_data')
            
            pump_instance = PumpDetail.objects.get(pump_id=pump_data.get('pump_id'))
            user_instance = UserProfile.objects.get(user__user_email=user_data)
            
            if not user_instance or not pump_instance:
                return JsonResponse({"error": "User/Pump instance not found"}, status=404)
            
            # Fill cells using the dictionary
            sheet1['G6'] = pump_data.get('company_name_en', "")
            sheet1['G7'] = pump_data.get('company_name_en', "")
            sheet1['G8'] = pump_data.get('pump_brand', "")
            sheet1['G9'] = pump_data.get('motor_brand', "")
            sheet1['G10'] = pump_data.get('suggest_motor', "")
            sheet1['Q10'] = pump_data.get('voltage', "")
            sheet1['U8'] = pump_data.get('pump_model', "")
            sheet1['U9'] = pump_data.get('motor_model', "")
            sheet1['AJ7'] = pump_data.get('tag_no', "")
            sheet1['AJ8'] = pump_data.get('serial_no', "")
            sheet1['AJ9'] = pump_data.get('motor_serial_no', "")
            sheet1['AE10'] = pump_data.get('pump_stage', "")
            sheet1['AL10'] = pump_data.get('pump_speed', "")
            sheet1['AJ6'] = datetime.now().strftime("%Y-%m-%d")
            
            sheet2['G6'] = pump_data.get('company_name_en', "")
            sheet2['G7'] = pump_data.get('company_name_en', "")
            sheet2['G8'] = pump_data.get('pump_brand', "")
            sheet2['G9'] = pump_data.get('motor_brand', "")
            sheet2['G10'] = pump_data.get('suggest_motor', "")
            sheet2['Q10'] = pump_data.get('voltage', "")
            sheet2['U8'] = pump_data.get('pump_model', "")
            sheet2['U9'] = pump_data.get('motor_model', "")
            sheet2['AJ7'] = pump_data.get('tag_no', "")
            sheet2['AJ8'] = pump_data.get('serial_no', "")
            sheet2['AJ9'] = pump_data.get('motor_serial_no', "")
            sheet2['AE10'] = pump_data.get('pump_stage', "")
            sheet2['AL10'] = pump_data.get('pump_speed', "")
            sheet2['AJ6'] = datetime.now().strftime("%Y-%m-%d")

            sheet3['G6'] = pump_data.get('company_name_en', "")
            sheet3['G7'] = pump_data.get('company_name_en', "")
            sheet3['G8'] = pump_data.get('pump_brand', "")
            sheet3['G9'] = pump_data.get('motor_brand', "")
            sheet3['G10'] = pump_data.get('suggest_motor', "")
            sheet3['Q10'] = pump_data.get('voltage', "")
            sheet3['U8'] = pump_data.get('pump_model', "")
            sheet3['U9'] = pump_data.get('motor_model', "")
            sheet3['AJ7'] = pump_data.get('tag_no', "")
            sheet3['AJ8'] = pump_data.get('serial_no', "")
            sheet3['AJ9'] = pump_data.get('motor_serial_no', "")
            sheet3['AE10'] = pump_data.get('pump_stage', "")
            sheet3['AL10'] = pump_data.get('pump_speed', "")
            sheet3['AJ6'] = datetime.now().strftime("%Y-%m-%d")
            
            #visual check
            #pump stop condition
            sheet1['A43'] = "1"
            sheet1['L43'] = ""
            sheet1['O43'] = ""
            sheet1['A44'] = "2"
            sheet1['L44'] = ""
            sheet1['O44'] = ""
            sheet1['A45'] = "3"
            sheet1['L45'] = ""
            sheet1['O45'] = ""
            sheet1['A46'] = "4"
            sheet1['L46'] = ""
            sheet1['O46'] = ""
            sheet1['A47'] = "5"
            sheet1['L47'] = ""
            sheet1['O47'] = ""
            sheet1['A48'] = "6"
            sheet1['L48'] = ""
            sheet1['O48'] = ""
            sheet1['A49'] = "7"
            sheet1['L49'] = ""
            sheet1['O49'] = ""
            sheet1['A50'] = "8"
            sheet1['L50'] = ""
            sheet1['O50'] = ""
            sheet1['A51'] = "9"
            sheet1['L51'] = ""
            sheet1['O51'] = ""
            sheet1['A52'] = "10"
            sheet1['L52'] = ""
            sheet1['O52'] = ""
            sheet1['A53'] = "11"
            sheet1['L53'] = ""
            sheet1['O53'] = ""

            #pump running condition
            sheet1['V43'] = "1"
            sheet1['AH43'] = ""
            sheet1['AK43'] = ""
            sheet1['V44'] = "2"
            sheet1['AH44'] = ""
            sheet1['AK44'] = ""
            sheet1['V45'] = "3"
            sheet1['AH45'] = ""
            sheet1['AK45'] = ""
            sheet1['V46'] = "4"
            sheet1['AH46'] = ""
            sheet1['AK46'] = ""
            sheet1['V47'] = "5"
            sheet1['AH47'] = ""
            sheet1['AK47'] = ""
            sheet1['V48'] = "6"
            sheet1['AH48'] = ""
            sheet1['AK48'] = ""
            sheet1['V49'] = "7"
            sheet1['AH49'] = ""
            sheet1['AK49'] = ""
            sheet1['V50'] = "8"
            sheet1['AH50'] = ""
            sheet1['AK50'] = ""
            sheet1['V51'] = "9"
            sheet1['AH51'] = ""
            sheet1['AK51'] = ""
            sheet1['V52'] = "10"
            sheet1['AH52'] = ""
            sheet1['AK52'] = ""
            sheet1['V53'] = "11"
            sheet1['AH53'] = ""
            sheet1['AK53'] = ""
            

            current_time = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
            filename = f"report_{current_time}.xlsx"
            file_path = os.path.join(os.path.dirname(__file__),'report', filename)
            wb.save(file_path)
            
            EngineerReport.objects.create(
                pump_detail=pump_instance,
                user_detail=user_instance,
                report_name=filename,
                report_file=file_path,
                created_by=user_data,
                updated_by=user_data
            )    

            return JsonResponse({"Success": "Report created successfully and saved"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": {"error": str(e)}}, status=400)
        
    @http_get('/report-open', response=list[EngineerReport_schema])
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
    def open_report(self, request):
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
    
    @http_get('/report-check')
    def get_report_check(self, request):
        check_id = request.GET.get('id')
        if check_id:
            try:
                uuid_id = UUID(check_id)
                data = EngineerReportCheck.objects.filter(pump_id__pump_id=uuid_id)
                data = list(data.values())
                return JsonResponse(data,safe=False, status=200)
            except EngineerReportCheck.DoesNotExist:
                return JsonResponse({"error": "Report not found"}, status=404)
        else:
            media_lovs = list(EngineerReportCheck.objects.all().values())
            return JsonResponse({"data": media_lovs}, status=200)

    @http_post('/report-check')
    def create_report_check(self, request, payload: EngineerReportCheck_schema):
        try:
            payload_dict = payload.dict()

            pump_instance = PumpDetail.objects.get(pump_id=payload_dict.get('pump_id'))

            if not pump_instance:
                return JsonResponse({"error": "Pump not found"}, status=404)

            new_report = EngineerReportCheck.objects.create(
                pump_id = pump_instance,
                doc_customer = payload.doc_customer,
                doc_no = payload.doc_no,
                doc_number_engineer = payload.doc_number_engineer,
                status = payload.status,
                created_at = payload.created_at,
                created_by = payload.created_by,
                updated_at = payload.updated_at,
                updated_by = payload.updated_by,
            )

            return JsonResponse({"success": True, "message": "Report created successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    @http_delete('/report-check/{id}')
    def delete_report_check(self, request, id: str):
        try:
            print(f"Deleting report check with ID: {id}")
            uuid_id = UUID(id)
            data = get_object_or_404(EngineerReportCheck, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Report deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
        
    @http_post('/report-check-cal/get-result')
    def get_report_check_cal_result(self, request, payload: EngineerReportCheckCal_schema):
        try:
            payload_dict = payload.dict()
            rc = ReportCheckResult(payload_dict)
            pump_cal_result = rc.curve_cal(False)


            return JsonResponse({"data": pump_cal_result}, safe=False,status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    @http_post('/report-check-cal')
    def create_report_check_cal(self, request, payload: EngineerReportCheckCal_schema):
        try:
            payload_dict = payload.dict()
            report_instance = get_object_or_404(EngineerReportCheck, check_id=payload_dict.get('check_id'))
            pump_detail = model_to_dict(report_instance.pump_id)
            
            if not report_instance:
                return JsonResponse({"error": "Report not found"}, status=404)
            
            rc = ReportCheckResult(pump_detail)
            pump_cal_result = rc.curve_cal(False)
            
            oprData = {**payload_dict}
            oprData["desire_imp_curve_data"] = pump_cal_result["desire_imp_curve_data"]
            oprData["desire_imp_curve_fit"] = pump_cal_result["desire_imp_curve_fit"]
            oprData["min_flow_point"] = pump_cal_result["min_flow_point"]
            oprData["max_flow_point"] = pump_cal_result["max_flow_point"]
            oprData["bep_point"] = pump_cal_result["bep_point"]
            oprData["media_density"] = pump_detail["media_density"]
            oprData["media_density_unit"] = pump_detail["media_density_unit"]
            oprData["vapor_pressure"] = pump_detail["vapor_pressure"]
            oprData["vapor_pressure_unit"] = pump_detail["vapor_pressure_unit"]
            oprData["npshr_curve_data"] = pump_cal_result["npshr_curve_data"]
            oprData["npshr_curve_fit"] = pump_cal_result["npshr_curve_fit"]
            oprData["design_operation_point"] = pump_cal_result["operation_point"]
            oprData["hydraulic_power_kW"] = pump_cal_result["hydraulic_power_kW"]
            
            
            check_result = rc.report_check_cal(oprData)
            
            if not check_result:
                return JsonResponse({"error": "Failed to create report check cal"}, status=400)
            
            report_data = {**payload_dict}
            report_data.update(check_id=report_instance)
            
            print("report_id", payload_dict.get('check_id'))
            #Update or Create Report Check Result
            
            EngineerReportCheckResult.objects.create(
                check_id=report_instance,
                speed_suggest=check_result.get('speed_suggest', ''),
                flow_suggest=check_result.get('flow_suggest', ''),
                npshr_suggest=check_result.get('npshr_suggest', ''),
                velocity_suggest=check_result.get('velocity_suggest', ''),
                boiling_point_suggest=check_result.get('boiling_point_suggest', ''),
                current_suggest=check_result.get('current_suggest', ''),
                power_suggest=check_result.get('power_suggest', ''),
                api_suggest=check_result.get('api_suggest', ''),
                buffer_suggest=check_result.get('buffer_suggest', ''),
                bearing_suggest=check_result.get('bearing_suggest', ''),
                vibration_suggest=check_result.get('vibration_suggest', ''),
                bearing_temp_suggest=check_result.get('bearing_temp_suggest', ''),
                timestamp=check_result.get('timestamp', ''),
                range_30_110_result=check_result.get('range_30_110_result', ''),
                range_30_110_suggest=check_result.get('range_30_110_suggest', ''),
                range_30_110_remark=check_result.get('range_30_110_remark', ''),
                npshr_npsha_result=check_result.get('npshr_npsha_result', ''),
                npshr_npsha_suggest=check_result.get('npshr_npsha_suggest', ''),
                npshr_npsha_remark=check_result.get('npshr_npsha_remark', ''),
                pump_standard_result=check_result.get('pump_standard_result', ''),
                pump_standard_suggest=check_result.get('pump_standard_suggest', ''),
                pump_standard_remark=check_result.get('pump_standard_remark', ''),
                power_result=check_result.get('power_result', ''),
                power_remark=check_result.get('power_remark', ''),
                fulid_temp_result=check_result.get('fulid_temp_result', ''),
                fulid_temp_suggest=check_result.get('fulid_temp_suggest', ''),
                fulid_temp_remark=check_result.get('fulid_temp_remark', ''),
                bearing_temp_result=check_result.get('bearing_temp_result', ''),
                bearing_temp_remark=check_result.get('bearing_temp_remark', ''),
                v_pump_de_h_result=check_result.get('v_pump_de_h_result', ''),
                v_pump_de_v_result=check_result.get('v_pump_de_v_result', ''),
                v_pump_de_a_result=check_result.get('v_pump_de_a_result', ''),
                v_pump_nde_h_result=check_result.get('v_pump_nde_h_result', ''),
                v_pump_nde_v_result=check_result.get('v_pump_nde_v_result', ''),
                v_pump_nde_a_result=check_result.get('v_pump_nde_a_result', ''),
                v_motor_de_h_result=check_result.get('v_motor_de_h_result', ''),
                v_motor_de_v_result=check_result.get('v_motor_de_v_result', ''),
                v_motor_de_a_result=check_result.get('v_motor_de_a_result', ''),
                v_motor_nde_h_result=check_result.get('v_motor_nde_h_result', ''),
                v_motor_nde_v_result=check_result.get('v_motor_nde_v_result', ''),
                v_motor_nde_a_result=check_result.get('v_motor_nde_a_result', ''),
                a_pump_de_h_result=check_result.get('a_pump_de_h_result', ''),
                a_pump_de_v_result=check_result.get('a_pump_de_v_result', ''),
                a_pump_de_a_result=check_result.get('a_pump_de_a_result', ''),
                a_pump_nde_h_result=check_result.get('a_pump_nde_h_result', ''),
                a_pump_nde_v_result=check_result.get('a_pump_nde_v_result', ''),
                a_pump_nde_a_result=check_result.get('a_pump_nde_a_result', ''),
                a_motor_de_h_result=check_result.get('a_motor_de_h_result', ''),
                a_motor_de_v_result=check_result.get('a_motor_de_v_result', ''),
                a_motor_de_a_result=check_result.get('a_motor_de_a_result', ''),
                a_motor_nde_h_result=check_result.get('a_motor_nde_h_result', ''),
                a_motor_nde_v_result=check_result.get('a_motor_nde_v_result', ''),
                a_motor_nde_a_result=check_result.get('a_motor_nde_a_result', ''),
                v_pump_suggest=check_result.get('v_pump_suggest', ''),
                v_pump_remark=check_result.get('v_pump_remark', ''),
                v_motor_suggest=check_result.get('v_motor_suggest', ''),
                v_motor_remark=check_result.get('v_motor_remark', ''),
                a_pump_suggest=check_result.get('a_pump_suggest', ''),
                a_pump_remark=check_result.get('a_pump_remark', ''),
                a_motor_suggest=check_result.get('a_motor_suggest', ''),
                a_motor_remark=check_result.get('a_motor_remark', ''),
            )

            EngineerReportCheckCal.objects.create(**report_data)
            report_instance.status = "Finish Operating Check"
            report_instance.save()    

            return JsonResponse({"success": True, "data": check_result}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    @http_put('/report-check-cal/{id}')
    def update_report_check_cal(self, request, id: str, payload: ReportCheckCalPayload_schema):
        try:
            uuid_id = UUID(id)
            report_instance = get_object_or_404(EngineerReportCheck, pk=uuid_id)
            report_cal_instance = get_object_or_404(EngineerReportCheckCal, check_id=report_instance)
            report_result_instance = get_object_or_404(EngineerReportCheckResult, check_id=report_instance)
            
            if not report_instance or not report_cal_instance or not report_result_instance:
                return JsonResponse({"error": "Report not found"}, status=404)

            report_data = payload.report_data.dict()
            pump_data = payload.pump_data.dict()
            
            rc = ReportCheckResult(pump_data)
            pump_cal_result = rc.curve_cal(False)
        
            oprData = payload.report_data.dict()
            
            print(f"pump data: {pump_data}")
            oprData["desire_imp_curve_data"] = pump_cal_result["desire_imp_curve_data"]
            oprData["desire_imp_curve_fit"] = pump_cal_result["desire_imp_curve_fit"]
            oprData["min_flow_point"] = pump_cal_result["min_flow_point"]
            oprData["max_flow_point"] = pump_cal_result["max_flow_point"]
            oprData["bep_point"] = pump_cal_result["bep_point"]
            oprData["media_density"] = pump_data.get("media_density")
            oprData["media_density_unit"] = pump_data.get("media_density_unit")
            oprData["bearing_last_chg_dt"] = pump_data.get("bearing_last_chg_dt")
            oprData["vapor_pressure"] = pump_data.get("vapor_pressure")
            oprData["vapor_pressure_unit"] = pump_data.get("vapor_pressure_unit")
            oprData["npshr_curve_data"] = pump_cal_result["npshr_curve_data"]
            oprData["npshr_curve_fit"] = pump_cal_result["npshr_curve_fit"]
            oprData["design_operation_point"] = pump_cal_result["operation_point"]
            oprData["hydraulic_power_kW"] = pump_cal_result["hydraulic_power_kW"]

            #return oprData
            #print("oprData", oprData["bearing_last_chg_dt"])
            check_result = rc.report_check_cal(oprData)
            
            for attr, value in payload.report_data.dict(exclude_unset=True).items():
                setattr(report_cal_instance, attr, value) 
            report_cal_instance.save()
            
            for attr, value in check_result.items():
                setattr(report_result_instance, attr, value)
            report_result_instance.save()

            return check_result
            #return JsonResponse({"success": True, "message": "Report Cal. updated successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error update report cal": str(e)}, status=400)

    @http_post('/report-check-vibe')
    def create_report_check_vibe(self, request, payload: EngineerReportCheckVibe_schema):
        try:
            payload_dict = payload.dict()
            print(payload_dict.get('check_id'))
            pump_instance = EngineerReportCheck.objects.get(check_id=payload_dict.get('check_id'))
            
            if not pump_instance:
                return JsonResponse({"error": "Report not found"}, status=404)
            
            new_report = {}

            new_report.update(payload_dict)
            new_report['check_id'] = pump_instance

            EngineerReportCheckVibration.objects.create(**new_report)

            pump_instance.status = "Finish Vibration Check"
            pump_instance.save()


            return JsonResponse({"success": True, "message": "Report created successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        check_id = request.GET.get('id')
        try:
            uuid_id = UUID(check_id)
            data = get_object_or_404(EngineerReportCheckVibration, pk=uuid_id)
            data = model_to_dict(data)
            return JsonResponse(data, status=200)
        except EngineerReportCheckVibration.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)

    @http_put('/report-check-vibe/{id}', response=EngineerReportCheckVibe_schema)
    def update_report_check_vibe(self, request, id: str, payload: EngineerReportCheckVibe_schema):
        uuid_id = UUID(id)
        report_instance = EngineerReportCheckVibration.objects.get(check_id=uuid_id)

        if not report_instance:
            return JsonResponse({"error": "Report not found"}, status=404)


        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(report_instance, attr, value) 
        report_instance.save()

        return JsonResponse({"success": True, "message": "Report vibration updated successfully"}, status=200)

    @http_post('/report-check-visual')
    def create_report_check_visual(self, request, payload: EngineerReportCheckVisual_schema):
        try:
            payload_dict = payload.dict()
            print(payload_dict.get('check_id'))
            pump_instance = EngineerReportCheck.objects.get(check_id=payload_dict.get('check_id'))
            
            if not pump_instance:
                return JsonResponse({"error": "Report not found"}, status=404)
            
            new_report = {}

            new_report.update(payload_dict)
            new_report['check_id'] = pump_instance

            EngineerReportCheckVisual.objects.create(**new_report)

            pump_instance.status = "Finish Visual Check"
            pump_instance.save()


            return JsonResponse({"success": True, "message": "Report created successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

        check_id = request.GET.get('id')
        try:
            uuid_id = UUID(check_id)
            data = get_object_or_404(EngineerReportCheckVisual, pk=uuid_id)
            data = model_to_dict(data)
            return JsonResponse(data, status=200)
        except EngineerReportCheckVisual.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)

    @http_put('/report-check-visual/{id}', response=EngineerReportCheckVisual_schema)
    def update_report_check_visual(self, request, id: str, payload: EngineerReportCheckVisual_schema):
        uuid_id = UUID(id)
        report_instance = EngineerReportCheckVisual.objects.get(check_id=uuid_id)

        if not report_instance:
            return JsonResponse({"error": "Report not found"}, status=404)


        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(report_instance, attr, value) 
        report_instance.save()

        return JsonResponse({"success": True, "message": "Report visual updated successfully"}, status=200)

    @http_post('/report-check-result')
    def submit_report_check_result(self, request, payload: EngineerReportCheckResult_schema):
        try:
            payload_dict = payload.dict()
            
            pump_instance = EngineerReportCheck.objects.get(check_id=payload_dict.get('check_id'))
            
            if not pump_instance:
                return JsonResponse({"error": "Report not found"}, status=404)
            
            new_report = {}

            new_report.update(payload_dict)
            new_report['check_id'] = pump_instance

            EngineerReportCheckResult.objects.create(**new_report)
            
            pump_instance.status = "Check result submitted"
            pump_instance.save()

            return JsonResponse({"success": True, "message": "Report check result submitted"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
    @http_put('/report-check-result/{id}')
    def update_report_check_result(self, request, id: str, payload: EngineerReportCheckResult_schema):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(EngineerReportCheckResult, pk=uuid_id)
            for attr, value in payload.dict(exclude_unset=True, exclude={'check_id'}).items():
                setattr(data, attr, value) 
            data.save()
            return JsonResponse({"success": True, "message": "Report check result submitted"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
    @http_get('/report-check-data')
    def get_report_check_data(self, request):
        uuid_id = request.GET.get('id')
        check_data = {}
        place_holder = {}
        try:
            data_cal = EngineerReportCheckCal.objects.get(check_id=uuid_id)
            place_holder = json.loads(serializers.serialize('json', [data_cal]))[0]
            check_data['data_cal'] = place_holder["fields"]
            check_data['data_cal']['check_cal_id'] = place_holder["pk"]
        except EngineerReportCheckCal.DoesNotExist:
            check_data['data_cal'] = {}
    
        try:
            data_vibe = EngineerReportCheckVibration.objects.get(check_id=uuid_id)
            place_holder = json.loads(serializers.serialize('json', [data_vibe]))[0]
            check_data['data_vibe'] = place_holder["fields"]
            check_data['data_vibe']['check_vibration_id'] = place_holder["pk"]
        except EngineerReportCheckVibration.DoesNotExist:
            check_data['data_vibe'] = {}
    
        try:
            data_visual = EngineerReportCheckVisual.objects.get(check_id=uuid_id)
            place_holder = json.loads(serializers.serialize('json', [data_visual]))[0]
            check_data['data_visual'] = place_holder["fields"]
            check_data['data_visual']['check_visual_id'] = place_holder["pk"]
        except EngineerReportCheckVisual.DoesNotExist:
            check_data['data_visual'] = {}
    
        try:
            data_result = EngineerReportCheckResult.objects.get(check_id=uuid_id)
            place_holder = json.loads(serializers.serialize('json', [data_result]))[0]
            check_data['data_result'] = place_holder["fields"]
            check_data['data_result']['check_result_id'] = place_holder["pk"]
        except EngineerReportCheckResult.DoesNotExist:
            check_data['data_result'] = {}
    
        try:
            report_check = EngineerReportCheck.objects.get(check_id=uuid_id)
            pump_instance = report_check.pump_id
            place_holder = json.loads(serializers.serialize('json', [pump_instance]))[0]
            check_data['pump_data'] = place_holder["fields"]
            check_data['pump_data']['pump_id'] = place_holder["pk"]
        except EngineerReportCheck.DoesNotExist:
            return JsonResponse({"error": "Pump data not found"}, status=404)
    
        return JsonResponse(check_data, status=200)
    