
from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV, PumpDetail, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV, MediaLOV
from pump_data.api import get_customer_company_code
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
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core import serializers
from io import BytesIO
from django.core.files.base import ContentFile
import json
import uuid
import os
from factory_curve.schema.factory_curve import CalPumpPayload_schema
from engineer.report_generate_pdf import PDFReportBuilder
import requests
from dotenv import load_dotenv
from engineer.schema.engineer import MARSEquipmentDataOut_schema,EngineerVibrationAnalysisPayload_schema, MARSMeasurementDataOut_schema
from typing import List
load_dotenv()

@api_controller('/engineer', tags=['Report'])
class ReportController:
    @http_post('/report', auth=JWTAuth())
    def create_report(self, request, payload: EngineerReportPayLoad_schema):
        try:
            id = request.GET.get('id')
            user = request.GET.get('email')

            print(f"Received data: {id}, {user}")
            print("start get report check instance")
            report_check_instance = EngineerReportCheck.objects.get(check_id=id)
            if not report_check_instance:
                return JsonResponse({"error": "Report not found"}, status=404)
            print("start get report instance")
            report_check_data = model_to_dict(report_check_instance)
            payload_dict = payload.dict()
            
            print("Start get all data")
            print("get data cal")
            data_cal = EngineerReportCheckCal.objects.filter(check_id=report_check_instance).first()
            print("get data vibe")
            data_vibe = EngineerReportCheckVibration.objects.filter(check_id=report_check_instance).first()
            print("get data visual")
            data_visual = EngineerReportCheckVisual.objects.filter(check_id=report_check_instance).first()
            print("get data result")
            data_result = EngineerReportCheckResult.objects.filter(check_id=report_check_instance).first()
            print("get data user instance")
            user_instance = UserProfile.objects.filter(user__user_email=user).first()
            pump_instance = report_check_instance.pump_id
            
            print("start dict pump data")
            pump_data = model_to_dict(pump_instance) if pump_instance else {}
            print("start dict cal data")
            data_cal_dict = model_to_dict(data_cal) if data_cal else {}
            print("start dict vibe data")
            data_vibe_dict = model_to_dict(data_vibe) if data_vibe else {}
            print("start dict visual data")
            data_visual_dict = model_to_dict(data_visual) if data_visual else {}
            print("start dict result data")
            data_result_dict = model_to_dict(data_result) if data_result else {}
            
            print("get curve data for chart")
            # Not persisted anywhere (curve_cal's arrays are only ever kept
            # in-memory when the Cal tab was submitted) — recompute it fresh
            # from the pump's own data so the report can plot it. A failure
            # here (e.g. curve no longer matches) shouldn't block the report,
            # it just means no chart on this page.
            curve_result = None
            if pump_instance:
                try:
                    curve_result = ReportCheckResult(pump_data).curve_cal(False)
                except Exception:
                    curve_result = None

            print("start building PDF")
            builder = PDFReportBuilder(
                pump_data=pump_data,
                report_check_data=report_check_data,
                data_cal_dict=data_cal_dict,
                data_vibe_dict=data_vibe_dict,
                data_visual_dict=data_visual_dict,
                data_result_dict=data_result_dict,
                curve_result=curve_result,
            )
            file_bytes = builder.render_pdf()

            current_time = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")
            filename = f"report_{current_time}.pdf"

            new_report = EngineerReport.objects.create(
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

            new_report.report_file.save(filename, ContentFile(file_bytes), save=False)
            new_report.save()

            download_buffer = BytesIO(file_bytes)
            download_buffer.seek(0)

            return FileResponse(
                        download_buffer,
                        as_attachment=True,
                        filename=filename,
                        content_type="application/pdf",
                    )

        except Exception as e:
            return JsonResponse({"error": {"error": str(e)}}, status=400)
        
    @http_get('/report', response=list[EngineerReport_schema], auth=JWTAuth())
    def get_report(self, request):
        id = request.GET.get('id')
        company_code = get_customer_company_code(request.auth)

        try:
            report_check_instance = EngineerReportCheck.objects.get(check_id=id)
        except EngineerReportCheck.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)

        if company_code is not None and (
            report_check_instance.pump_id is None
            or report_check_instance.pump_id.company_code != company_code
        ):
            return JsonResponse({"error": "Report not found"}, status=404)

        report_files = EngineerReport.objects.filter(report_check_id=report_check_instance).order_by('-created_at')

        result = list(report_files.values())
        return JsonResponse(result, safe=False, status=200)


    @http_get('/report/download', auth=JWTAuth())
    def download_report(self, request):
        report_id = request.GET.get('id')
        #report_id = "514bbdca-8bf0-4374-8091-a1662887bb36"
        #return JsonResponse({"report_id": report_id}, status=200)
        if not report_id:
            return JsonResponse({"error": "Report ID is required"}, status=400)

        report = get_object_or_404(EngineerReport, pk=report_id)

        company_code = get_customer_company_code(request.auth)
        if company_code is not None and (
            report.pump_detail is None
            or report.pump_detail.company_code != company_code
        ):
            raise Http404("Report not found")

        if not report.report_file:
            raise Http404("Report not found")

        return FileResponse(
        report.report_file.open('rb'),
        as_attachment=True,
        filename=report.report_name
    )

    @http_delete('/report', auth=JWTAuth())
    def delete_report(self, request):
        report_id = request.GET.get('id')

        if not report_id:
            return JsonResponse({"error": "Report ID is required"}, status=400)

        report = get_object_or_404(EngineerReport, pk=report_id)

        company_code = get_customer_company_code(request.auth)
        if company_code is not None and (
            report.pump_detail is None
            or report.pump_detail.company_code != company_code
        ):
            return JsonResponse({"error": "Report not found"}, status=404)

        try:
            if report.report_file:
                report.report_file.delete(save=False)

            report.delete()

            return JsonResponse({"message": "Report deleted successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    @http_get('/report-check', auth=JWTAuth())
    def get_report_check(self, request):
        check_id = request.GET.get('id')
        company_code = get_customer_company_code(request.auth)
        if check_id:
            try:
                uuid_id = UUID(check_id)
                data = EngineerReportCheck.objects.filter(pump_id__pump_id=uuid_id)
                if company_code is not None:
                    data = data.filter(pump_id__company_code=company_code)
                data = list(data.values())
                return JsonResponse(data,safe=False, status=200)
            except EngineerReportCheck.DoesNotExist:
                return JsonResponse({"error": "Report not found"}, status=404)
        else:
            query = EngineerReportCheck.objects.all()
            if company_code is not None:
                query = query.filter(pump_id__company_code=company_code)
            media_lovs = list(query.values())
            return JsonResponse({"data": media_lovs}, status=200)

    @http_post('/report-check', auth=JWTAuth())
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
    
    @http_delete('/report-check/{id}', auth=JWTAuth())
    def delete_report_check(self, request, id: str):
        try:
            print(f"Deleting report check with ID: {id}")
            uuid_id = UUID(id)
            data = get_object_or_404(EngineerReportCheck, pk=uuid_id)

            company_code = get_customer_company_code(request.auth)
            if company_code is not None and (
                data.pump_id is None or data.pump_id.company_code != company_code
            ):
                return JsonResponse({"error": "Report not found"}, status=404)

            # EngineerReport.report_check_id is SET_NULL (not CASCADE) — deleting
            # the check alone would silently orphan every generated report file
            # for it (row stays, no longer linked to anything, file left on disk
            # forever). Clean those up explicitly first.
            for generated_report in EngineerReport.objects.filter(report_check_id=data):
                if generated_report.report_file:
                    generated_report.report_file.delete(save=False)
                generated_report.delete()

            # Cal / Vibration / Visual / Result rows all use CASCADE, so this
            # removes them automatically.
            data.delete()
            return JsonResponse({"success": True, "message": "Report deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
    @http_post('/report-check-cal/get-result', auth=JWTAuth())
    def get_report_check_cal_result(self, request, payload: EngineerReportCheckCal_schema):
        try:
            payload_dict = payload.dict()
            rc = ReportCheckResult(payload_dict)
            pump_cal_result = rc.curve_cal(False)


            return JsonResponse({"data": pump_cal_result}, safe=False,status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    @http_post('/report-check-cal', auth=JWTAuth())
    def create_report_check_cal(self, request, payload: EngineerReportCheckCal_schema):
        try:
            payload_dict = payload.dict()
            report_instance = get_object_or_404(EngineerReportCheck, check_id=payload_dict.get('check_id'))
            pump_detail = model_to_dict(report_instance.pump_id)
            
            if not report_instance:
                return JsonResponse({"error": "Report not found"}, status=404)
            
            rc = ReportCheckResult(pump_detail)
            pump_cal_result = rc.curve_cal(False)

            # The Cal group's field measurements below are always worth saving on
            # their own — if the curve comparison can't be computed yet (curve not
            # matched, insufficient data), that just means no verdict yet, not a
            # reason to reject the engineer's input. Leave check_result empty in
            # that case rather than failing the whole submission.
            check_result = {}
            if not pump_cal_result.get("error"):
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
                oprData["bearing_last_chg_dt"] = pump_detail.get("bearing_last_chg_dt")
                oprData["pump_max_temp"] = pump_detail.get("pump_max_temp")
                oprData["motor_efficiency"] = pump_detail.get("motor_efficiency")
                oprData["suction_pipe_id"] = pump_detail.get("suction_pipe_id")
                oprData["discharge_pipe_id"] = pump_detail.get("discharge_pipe_id")
                oprData["npshr_curve_data"] = pump_cal_result["npshr_curve_data"]
                oprData["npshr_curve_fit"] = pump_cal_result["npshr_curve_fit"]
                oprData["design_operation_point"] = pump_cal_result["operation_point"]
                oprData["hydraulic_power_kW"] = pump_cal_result["hydraulic_power_kW"]

                check_result = rc.report_check_cal(oprData)

            report_data = {**payload_dict}
            report_data.update(check_id=report_instance)

            # Operation Head, Shaft Power, Hydraulic Power, NPSHa and Suction/
            # Discharge Fluid Velocity are auto-generated from the other Cal
            # inputs rather than typed in by hand — overwrite whatever was
            # submitted for them with the freshly computed values whenever the
            # calc succeeded. Operation Shut Off Head is a fixed pump/curve
            # characteristic, not derived from this test — just read through
            # from the pump's own registered record.
            if pump_detail.get('shut_off_head') not in (None, ''):
                report_data['head_shut'] = pump_detail.get('shut_off_head')
                report_data['head_shut_unit'] = pump_detail.get('shut_off_head_unit')
                check_result['calc_head_shut'] = pump_detail.get('shut_off_head')
                check_result['calc_head_shut_unit'] = pump_detail.get('shut_off_head_unit')
            if pump_detail.get('max_head') not in (None, ''):
                report_data['head_max'] = pump_detail.get('max_head')
                report_data['head_max_unit'] = pump_detail.get('max_head_unit')
                check_result['calc_head_max'] = pump_detail.get('max_head')
                check_result['calc_head_max_unit'] = pump_detail.get('max_head_unit')
            if check_result.get('calc_head_ope') not in (None, ''):
                report_data['head_ope'] = str(check_result['calc_head_ope'])
                report_data['head_ope_unit'] = 'm'
            if check_result.get('calc_shaft_power') not in (None, ''):
                report_data['shaft_ope'] = str(check_result['calc_shaft_power'])
                report_data['shaft_ope_unit'] = 'kW'
            if check_result.get('calc_npsha') not in (None, ''):
                report_data['npsha'] = str(check_result['calc_npsha'])
            if check_result.get('calc_suction_velo') not in (None, ''):
                report_data['suction_fluid_velo'] = str(check_result['calc_suction_velo'])
                report_data['suction_fluid_velo_unit'] = 'm/s'
            if check_result.get('calc_discharge_velo') not in (None, ''):
                report_data['discharge_fluid_velo'] = str(check_result['calc_discharge_velo'])
                report_data['discharge_fluid_velo_unit'] = 'm/s'
            if check_result.get('calc_hyd_power') not in (None, ''):
                report_data['hyd_power_measure'] = str(check_result['calc_hyd_power'])
                report_data['hyd_power_measure_unit'] = 'kW'

            print("report_id", payload_dict.get('check_id'))
            # Update the existing Result row's auto-computed fields if one already
            # exists (e.g. the engineer filled in the Result tab before this Cal
            # tab), otherwise create a fresh one. A blind .create() here would leave
            # two EngineerReportCheckResult rows for the same report, and whichever
            # one a later .first() happens to pick would be missing half the data.
            EngineerReportCheckResult.objects.update_or_create(
                check_id=report_instance,
                defaults={
                    "range_30_110_result": check_result.get('range_30_110_result', ''),
                    "range_30_110_suggest": check_result.get('range_30_110_suggest', ''),
                    "npshr_npsha_result": check_result.get('npshr_npsha_result', ''),
                    "npshr_npsha_suggest": check_result.get('npshr_npsha_suggest', ''),
                    "pump_standard_result": check_result.get('pump_standard_result', ''),
                    "pump_standard_suggest": check_result.get('pump_standard_suggest', ''),
                    "power_result": check_result.get('power_result', ''),
                    "power_suggest": check_result.get('power_suggest', ''),
                    "fluid_temp_result": check_result.get('fluid_temp_result', ''),
                    "fluid_temp_suggest": check_result.get('fluid_temp_suggest', ''),
                    "bearing_temp_result": check_result.get('bearing_temp_result', ''),
                    "bearing_temp_suggest": check_result.get('bearing_temp_suggest', ''),
                },
            )

            EngineerReportCheckCal.objects.create(**report_data)
            report_instance.status = "Finish Operating Check"
            report_instance.save()    

            return JsonResponse({"success": True, "data": check_result}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    @http_put('/report-check-cal/{id}', auth=JWTAuth())
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

            # As with create_report_check_cal: the field measurements are always
            # worth saving. If the curve comparison can't be computed at all right
            # now, leave the existing computed verdicts untouched (report_check_cal
            # already leaves any individual check blank on its own if it's the
            # specific one missing data — this only skips recomputation entirely
            # when there's no curve fit at all to check against).
            check_result = None
            if not pump_cal_result.get("error"):
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
                oprData["pump_max_temp"] = pump_data.get("pump_max_temp")
                oprData["vapor_pressure"] = pump_data.get("vapor_pressure")
                oprData["vapor_pressure_unit"] = pump_data.get("vapor_pressure_unit")
                oprData["motor_efficiency"] = pump_data.get("motor_efficiency")
                oprData["suction_pipe_id"] = pump_data.get("suction_pipe_id")
                oprData["discharge_pipe_id"] = pump_data.get("discharge_pipe_id")
                oprData["npshr_curve_data"] = pump_cal_result["npshr_curve_data"]
                oprData["npshr_curve_fit"] = pump_cal_result["npshr_curve_fit"]
                oprData["design_operation_point"] = pump_cal_result["operation_point"]
                oprData["hydraulic_power_kW"] = pump_cal_result["hydraulic_power_kW"]

                check_result = rc.report_check_cal(oprData)

            for attr, value in payload.report_data.dict(exclude_unset=True).items():
                setattr(report_cal_instance, attr, value)

            # Operation Head, Shaft Power, Hydraulic Power, NPSHa and Suction/
            # Discharge Fluid Velocity are auto-generated from the other Cal
            # inputs rather than typed in by hand — overwrite whatever was
            # submitted for them whenever the calc succeeded. Operation Shut Off
            # Head is a fixed pump/curve characteristic, not derived from this
            # test — just read through from the pump's own registered record.
            calc_head_ope = (check_result or {}).get('calc_head_ope')
            calc_shaft_power = (check_result or {}).get('calc_shaft_power')
            calc_hyd_power = (check_result or {}).get('calc_hyd_power')
            calc_npsha = (check_result or {}).get('calc_npsha')
            calc_suction_velo = (check_result or {}).get('calc_suction_velo')
            calc_discharge_velo = (check_result or {}).get('calc_discharge_velo')
            if pump_data.get('shut_off_head') not in (None, ''):
                report_cal_instance.head_shut = pump_data.get('shut_off_head')
                report_cal_instance.head_shut_unit = pump_data.get('shut_off_head_unit')
            if pump_data.get('max_head') not in (None, ''):
                report_cal_instance.head_max = pump_data.get('max_head')
                report_cal_instance.head_max_unit = pump_data.get('max_head_unit')
            if calc_head_ope not in (None, ''):
                report_cal_instance.head_ope = str(calc_head_ope)
                report_cal_instance.head_ope_unit = 'm'
            if calc_shaft_power not in (None, ''):
                report_cal_instance.shaft_ope = str(calc_shaft_power)
                report_cal_instance.shaft_ope_unit = 'kW'
            if calc_npsha not in (None, ''):
                report_cal_instance.npsha = str(calc_npsha)
            if calc_suction_velo not in (None, ''):
                report_cal_instance.suction_fluid_velo = str(calc_suction_velo)
                report_cal_instance.suction_fluid_velo_unit = 'm/s'
            if calc_discharge_velo not in (None, ''):
                report_cal_instance.discharge_fluid_velo = str(calc_discharge_velo)
                report_cal_instance.discharge_fluid_velo_unit = 'm/s'
            if calc_hyd_power not in (None, ''):
                report_cal_instance.hyd_power_measure = str(calc_hyd_power)
                report_cal_instance.hyd_power_measure_unit = 'kW'
            report_cal_instance.save()

            if check_result is not None:
                # calc_* keys feed report_cal_instance above, not the Result row —
                # EngineerReportCheckResult has no matching fields for them.
                for attr, value in check_result.items():
                    if attr.startswith('calc_'):
                        continue
                    setattr(report_result_instance, attr, value)
                report_result_instance.save()
            else:
                # Nothing recomputed — report back the untouched existing values so
                # the Result tab keeps showing them instead of appearing to go blank.
                check_result = {
                    key: getattr(report_result_instance, key)
                    for key in (
                        "range_30_110_result", "range_30_110_suggest",
                        "npshr_npsha_result", "npshr_npsha_suggest",
                        "pump_standard_result", "pump_standard_suggest",
                        "power_result", "power_suggest",
                        "fluid_temp_result", "fluid_temp_suggest",
                        "bearing_temp_result", "bearing_temp_suggest",
                    )
                }

            if pump_data.get('shut_off_head') not in (None, ''):
                check_result['calc_head_shut'] = pump_data.get('shut_off_head')
                check_result['calc_head_shut_unit'] = pump_data.get('shut_off_head_unit')
            if pump_data.get('max_head') not in (None, ''):
                check_result['calc_head_max'] = pump_data.get('max_head')
                check_result['calc_head_max_unit'] = pump_data.get('max_head_unit')

            return check_result
            #return JsonResponse({"success": True, "message": "Report Cal. updated successfully"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error update report cal": str(e)}, status=400)

    @http_post('/report-check-vibe', auth=JWTAuth())
    def create_report_check_vibe(self, request, payload: EngineerReportCheckVibe_schema):
        try:
            payload_dict = payload.dict()
            pump_instance = EngineerReportCheck.objects.get(check_id=payload_dict.get('check_id'))

            if not pump_instance:
                return JsonResponse({"error": "Report not found"}, status=404)

            new_report = {k: v for k, v in payload_dict.items() if k != 'check_id'}
            new_report['check_id'] = pump_instance

            EngineerReportCheckVibration.objects.create(**new_report)

            pump_instance.status = "Finish Vibration Check"
            pump_instance.save()

            return JsonResponse({"success": True, "message": "Report created successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    @http_put('/report-check-vibe/{id}', auth=JWTAuth())
    def update_report_check_vibe(self, request, id: str, payload: EngineerReportCheckVibe_schema):
        try:
            uuid_id = UUID(id)
            report_instance = EngineerReportCheckVibration.objects.get(check_id=uuid_id)

            for attr, value in payload.dict(exclude_unset=True).items():
                if attr == 'check_id':
                    continue
                setattr(report_instance, attr, value)
            report_instance.save()

            return JsonResponse({"success": True, "message": "Report vibration updated successfully"}, status=200)

        except EngineerReportCheckVibration.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    @http_post('/report-check-visual', auth=JWTAuth())
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

    @http_put('/report-check-visual/{id}', response=EngineerReportCheckVisual_schema, auth=JWTAuth())
    def update_report_check_visual(self, request, id: str, payload: EngineerReportCheckVisual_schema):
        uuid_id = UUID(id)
        report_instance = EngineerReportCheckVisual.objects.get(check_id=uuid_id)

        if not report_instance:
            return JsonResponse({"error": "Report not found"}, status=404)


        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(report_instance, attr, value) 
        report_instance.save()

        return JsonResponse({"success": True, "message": "Report visual updated successfully"}, status=200)

    @http_post('/report-check-result', auth=JWTAuth())
    def submit_report_check_result(self, request, payload: EngineerReportCheckResult_schema):
        try:
            payload_dict = payload.dict()
            
            pump_instance = EngineerReportCheck.objects.get(check_id=payload_dict.get('check_id'))
            
            if not pump_instance:
                return JsonResponse({"error": "Report not found"}, status=404)
            
            new_report = {}

            new_report.update(payload_dict)
            new_report.pop('check_id', None)

            # A row may already exist for this check (e.g. the Cal tab was saved
            # first and created it with the auto-computed fields) — update it
            # instead of creating a second row that a later .first() could pick
            # over this one, silently dropping half the report's data.
            EngineerReportCheckResult.objects.update_or_create(
                check_id=pump_instance,
                defaults=new_report,
            )

            pump_instance.status = "Check result submitted"
            pump_instance.save()

            return JsonResponse({"success": True, "message": "Report check result submitted"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
    @http_put('/report-check-result/{id}', auth=JWTAuth())
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
        
    @http_get('/report-check-data', auth=JWTAuth())
    def get_report_check_data(self, request):
        uuid_id = request.GET.get('id')
        check_data = {}
        
        def get_model_data(model, key, pk_name):
            try:
                # .filter().first() prevents the MultipleObjectsReturned error
                # It just takes the most recent/first one found
                instance = model.objects.filter(check_id=uuid_id).first()
                if instance:
                    place_holder = json.loads(serializers.serialize('json', [instance]))[0]
                    data = place_holder["fields"]
                    data[pk_name] = place_holder["pk"]
                    return data
                return {}
            except Exception:
                return {}
        
        check_data['data_cal'] = get_model_data(EngineerReportCheckCal, 'data_cal', 'check_cal_id')
        check_data['data_vibe'] = get_model_data(EngineerReportCheckVibration, 'data_vibe', 'check_vibration_id')
        check_data['data_visual'] = get_model_data(EngineerReportCheckVisual, 'data_visual', 'check_visual_id')
        check_data['data_result'] = get_model_data(EngineerReportCheckResult, 'data_result', 'check_result_id')
    
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
                print(f"Received data from MARS: {data}") 
                coordinate_id = {
                    "z_id": data[0].get("asset_id"),
                    "x_id": data[1].get("asset_id"),
                    "y_id": data[2].get("asset_id"),
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
    def get_all_measurement_from_mars(self, payload: List[MARSMeasurementDataOut_schema]):
        payload_dicts = [item.dict() for item in payload]
        try:
            response_x = requests.post(
                f"{os.getenv('URL_MARS')}/history_data",
                json=payload_dicts[0],
                timeout=10
            )
            response_y = requests.post(
                f"{os.getenv('URL_MARS')}/history_data",
                json=payload_dicts[1],
                timeout=10
            )
            response_z = requests.post(
                f"{os.getenv('URL_MARS')}/history_data",
                json=payload_dicts[2],
                timeout=10
            )
            if response_x.status_code == 200 and response_y.status_code == 200 and response_z.status_code == 200:
                data = [response_x.json(), response_y.json(), response_z.json()]
                return JsonResponse(data, safe=False)
            else:
                return JsonResponse({"error": "No data received from MARS"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @http_post('/analysis-data')
    def get_analysis_data(self,payload: List[EngineerVibrationAnalysisPayload_schema]):
        payload_dicts = [item.dict() for item in payload]
        try:
            response_x = requests.post(
                f"{os.getenv('URL_MARS')}/wave",
                json=payload_dicts[0],
                timeout=10
            )
            print(f"X response status: {response_x.status_code}")
            
            response_y = requests.post(
                f"{os.getenv('URL_MARS')}/wave",
                json=payload_dicts[1],
                timeout=10
            )
            
            print(f"Y response status: {response_y.status_code}")
            response_z = requests.post(
                f"{os.getenv('URL_MARS')}/wave",
                json=payload_dicts[2],
                timeout=10
            )
            print(f"Z response status: {response_z.status_code}")
            
            
            if response_x.status_code == 200 and response_y.status_code == 200 and response_z.status_code == 200:
                data = [response_x.json(), response_y.json(), response_z.json()]
                
                response = requests.post(
                f"{os.getenv('URL_ANALYSIS')}/fft_3axis_full",
                json=data,
                timeout=10
                )
                
                print(f"Analysis response status: {response.status_code}")
            
                if response.status_code == 200:
                    analysis_data = response.json() 
                    return JsonResponse(analysis_data, safe=False)
                else:
                    return JsonResponse({"error": "No data received from Analysis API"}, status=500)
                
            else:
                return JsonResponse({"error": "No data received from MARS"}, status=500)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
            
        
    #@http_post('/wave')
    #def get_wave_data_from_mars(self, payload: List[MARSWaveSpectrumDataOut_schema]):
    #    payload_dicts = [item.dict() for item in payload]
    #    try:
    #        response_x = requests.post(
    #            f"{os.getenv('URL_MARS')}/wave",
    #            json=payload_dicts[0],
    #            timeout=10
    #        )
    #        print(f"X response status: {response_x.status_code}")
    #        
    #        response_y = requests.post(
    #            f"{os.getenv('URL_MARS')}/wave",
    #            json=payload_dicts[1],
    #            timeout=10
    #        )
    #        
    #        print(f"Y response status: {response_y.status_code}")
    #        response_z = requests.post(
    #            f"{os.getenv('URL_MARS')}/wave",
    #            json=payload_dicts[2],
    #            timeout=10
    #        )
    #        print(f"Z response status: {response_z.status_code}")
    #        
    #        if response_x.status_code == 200 and response_y.status_code == 200 and response_z.status_code == 200:
    #            data = [response_x.json(), response_y.json(), response_z.json()]
    #            return JsonResponse(data, safe=False)
    #        else:
    #            return JsonResponse({"error": "No data received from MARS"}, status=500)
    #    except Exception as e:
    #        return JsonResponse({"error": str(e)}, status=500)
        
    #@http_post('/spectrum_wave')
    #def get_spectrum_data_from_mars(self, payload: MARSWaveSpectrumDataOut_schema):
    #    try:
    #        response = requests.post(
    #            f"{os.getenv('URL_MARS')}/spectrum_wave",
    #            json=payload.dict(),
    #            timeout=10
    #        )
    #        if response.status_code == 200:
    #            data = response.json()
    #            return JsonResponse(data, safe=False)
    #        else:
    #            return JsonResponse({"error": "No data received from MARS"}, status=500)
    #    except Exception as e:
    #        return JsonResponse({"error": str(e)}, status=500)
    