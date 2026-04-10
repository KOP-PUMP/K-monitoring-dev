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
from io import BytesIO
from django.core.files.base import ContentFile
import json
import uuid
import os
from factory_curve.schema.factory_curve import CalPumpPayload_schema
from engineer.report_generate import ReportMapper
import requests
from dotenv import load_dotenv
from engineer.schema.engineer import MARSEquipmentDataOut_schema, MARSMeasurementDataOut_schema, MARSWaveSpectrumDataOut_schema

load_dotenv()

@api_controller('/engineer', tags=['Report'])
class ReportController:
    @http_post('/report')
    def create_report(self, request, payload: EngineerReportPayLoad_schema):
        try:
            id = request.GET.get('id')
            user = request.GET.get('email')
            #return JsonResponse({"massage": payload.dict()}, status=400)
            # Construct the absolute path
            
            template_path = os.path.join(settings.REPORT_TEMPLATE_DIR, 'engineer_form.xlsx')

            # Load workbook and access the active sheet
            wb = load_workbook(template_path)
            
            report_check_instance = EngineerReportCheck.objects.get(check_id=id)
            if not report_check_instance:
                return JsonResponse({"error": "Report not found"}, status=404)

            report_check_data = model_to_dict(report_check_instance)
            payload_dict = payload.dict()
            
            data_cal = EngineerReportCheckCal.objects.filter(check_id=report_check_instance).first() or {}
            data_vibe = EngineerReportCheckVibration.objects.filter(check_id=report_check_instance).first() or {}
            data_visual = EngineerReportCheckVisual.objects.filter(check_id=report_check_instance).first() or {}
            data_result = EngineerReportCheckResult.objects.filter(check_id=report_check_instance).first() or {}
            user_instance = UserProfile.objects.filter(user__user_email=user).first()
            pump_instance = report_check_instance.pump_id
            
            pump_data = model_to_dict(pump_instance)

            data_cal_dict = model_to_dict(data_cal)
            data_vibe_dict = model_to_dict(data_vibe)
            data_visual_dict = model_to_dict(data_visual)
            data_result_dict = model_to_dict(data_result)
            
            #Call mapping function
            mapper = ReportMapper(
                wb=wb, 
                pump_data=model_to_dict(report_check_instance.pump_id),
                report_check_data=report_check_data,
                data_cal_dict=data_cal_dict,
                data_vibe_dict=data_vibe_dict,
                data_visual_dict=data_visual_dict,
                data_result_dict=data_result_dict
            )
            
            mapper.map_all()
            
            buffer = BytesIO()
            wb.save(buffer)
            buffer.seek(0)

            current_time = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
            filename = f"report_{current_time}.xlsx"
            
            new_report =EngineerReport.objects.create(
                report_check_id=report_check_instance,
                pump_detail=pump_instance,
                user_detail=user_instance,
                report_name=filename,
                report_detail=payload_dict.get('report_detail') or "",
                remark=payload_dict.get('remark') or "",
                created_at=datetime.now(),
                created_by=user,
                updated_at=datetime.now(),
                updated_by=user
            )
            
            file_bytes = buffer.getvalue()
            new_report.report_file.save(filename, ContentFile(file_bytes), save=False)
            new_report.save()    
            
            download_buffer = BytesIO(file_bytes)
            download_buffer.seek(0)

            return FileResponse(
                        download_buffer,
                        as_attachment=True,
                        filename=filename,
                        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    )
            
        except Exception as e:
            return JsonResponse({"error": {"error": str(e)}}, status=400)
        
    @http_get('/report', response=list[EngineerReport_schema])
    def get_report(self, request):
        id = request.GET.get('id')
        report_check_instance = EngineerReportCheck.objects.get(check_id=id)
        
        if not report_check_instance:
            return JsonResponse({"error": "Report not found"}, status=404)
        
        report_files = EngineerReport.objects.filter(report_check_id=report_check_instance).order_by('-created_at')

        result = list(report_files.values())
        return JsonResponse(result, safe=False, status=200)


    @http_get('/report/download')
    def download_report(self, request):
        report_id = request.GET.get('id')
        #report_id = "514bbdca-8bf0-4374-8091-a1662887bb36"
        #return JsonResponse({"report_id": report_id}, status=200)
        if not report_id:
            return JsonResponse({"error": "Report ID is required"}, status=400)
        
        report = get_object_or_404(EngineerReport, pk=report_id)

        if not report.report_file:
            raise Http404("Report not found")
        
        return FileResponse(
        report.report_file.open('rb'),
        as_attachment=True,
        filename=report.report_name
    )
        
    @http_delete('/report')
    def delete_report(self, request):
        report_id = request.GET.get('id')
        
        report = get_object_or_404(EngineerReport, pk=report_id)
        
        if not report_id: 
            return JsonResponse({"error": "Report ID is required"}, status=400)
        
        try:
            if report.report_file:
                report.report_file.delete(save=False)

            report.delete()

            return JsonResponse({"message": "Report deleted successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
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
                fluid_temp_result=check_result.get('fluid_temp_result', ''),
                fluid_temp_suggest=check_result.get('fluid_temp_suggest', ''),
                fluid_temp_remark=check_result.get('fluid_temp_remark', ''),
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
    
        
@api_controller('/mars', tags=['sensors'])
class MarsController:
    @http_post('/equipment')
    def get_equipment_from_mars(self, payload: MARSEquipmentDataOut_schema):
        try:
            response = requests.post(
                f"{os.getenv('URL_MARS')}/latest_data",
                json=payload.dict(),
                timeout=10
            )
            if response.status_code == 200:
                data = response.json() 
                coordinate_id = {
                    "x_id": data[0].get("asset_id"),
                    "y_id": data[1].get("asset_id"),
                    "z_id": data[2].get("asset_id"),
                }
    
                return JsonResponse(coordinate_id, safe=False)
    
            else:
                return JsonResponse(
                    {"error": "Mars API error", "detail": response.text},
                    status=response.status_code
                )
    
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @http_post('/measurements')
    def get_all_measurement_from_mars(self, payload: MARSMeasurementDataOut_schema):
        try:
            response = requests.post(
                f"{os.getenv('URL_MARS')}/history_data",
                json=payload.dict(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json() 
                return JsonResponse(data, safe=False)
            else:
                return JsonResponse({"error": "No data received from MARS"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    
    @http_post('/wave')
    def get_wave_data_from_mars(self, payload: MARSWaveSpectrumDataOut_schema):
        try:
            response = requests.post(
                f"{os.getenv('URL_MARS')}/wave",
                json=payload.dict(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return JsonResponse(data, safe=False)
            else:
                return JsonResponse({"error": "No data received from MARS"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @http_post('/spectrum_wave')
    def get_spectrum_data_from_mars(self, payload: MARSWaveSpectrumDataOut_schema):
        try:
            response = requests.post(
                f"{os.getenv('URL_MARS')}/spectrum_wave",
                json=payload.dict(),
                timeout=10
            )
            print(f"Request payload: {payload.dict()}")
            print(f"MARS response status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                return JsonResponse(data, safe=False)
            else:
                return JsonResponse({"error": "No data received from MARS"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    