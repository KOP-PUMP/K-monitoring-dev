from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from factory_curve.models import FactoryCurve, FactoryCurveNumber
from pump_data.models import KMonitoringLOV
from factory_curve.schema.factory_curve import FactoryCurve_schema, FactoryCurveNumber_schema, CalPumpResponse_schema, CalPumpPayload_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from django.http import JsonResponse
import bisect
import math
import numpy as np
from sklearn.metrics import r2_score
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
from scipy.interpolate import griddata
import re


#, auth=JWTAuth()
@api_controller('/factory-curve/', tags=['factory_curve'])
class FactoryCurveController:
    @http_get('/data', response=list[FactoryCurve_schema])
    def get_factory_curve(self, request):
        # Get query parameters
        model = request.GET.get('model')
        size = request.GET.get('size')
        speed = request.GET.get('speed')
        fac_number = request.GET.get('factory_no')
        model_input = f"{model} {size}  {speed}RPM"
        
        if fac_number:
            try:
                data = list(FactoryCurve.objects.filter(fac_number=fac_number))

                if not data: 
                    return JsonResponse({"error": f"Factory curve not found for {fac_number}"}, status=404)
                
                serialized_data = [model_to_dict(item) for item in data]
                return JsonResponse(serialized_data, safe=False, status=200)
            except FactoryCurve.DoesNotExist:
                return JsonResponse({"error": f"Factory curve not found for {fac_number}"}, status=404)

        # Filter FactoryCurve objects based on the query parameters
        data = list(FactoryCurve.objects.filter(model=model_input))

        if not data:
            return JsonResponse({"error": f"Factory curve not found for the given model:{model_input}"}, status=404)

        # Serialize data to return as response
        serialized_data = [model_to_dict(item) for item in data]
        return JsonResponse(serialized_data, safe=False, status=200)
    @http_post('/cal')
    def get_cal_factory_curve(self, request, payload: CalPumpPayload_schema):
        # Get query parameters
        impeller_dia = float(payload.design_impeller_dia)
        model = payload.pump_model
        speed = payload.pump_speed 
        model_input = f"{model}  {speed}RPM"
        #model_input = re.sub(r'\s+', '', model_input)
        cal_result = {}

        def FindUnitConversion(unit_group : str , unit : str):
            return KMonitoringLOV.objects.filter(type_name = 'pump_unit' ,product_name = unit_group, data_value = unit).first()

        operation_flow_unit = FindUnitConversion('unit_flow',payload.design_flow_unit)
        operation_flow_unit_conversion = model_to_dict(operation_flow_unit) if operation_flow_unit else None
        operation_flow_unit_conversion = float(operation_flow_unit_conversion["data_value2"])
        operation_head_unit = FindUnitConversion('unit_head',payload.design_head_unit)
        operation_head_unit_conversion = model_to_dict(operation_head_unit) if operation_head_unit else None
        operation_head_unit_conversion = float(operation_head_unit_conversion["data_value2"])
        media_density_unit = FindUnitConversion('unit_density',payload.media_density_unit)
        media_density_unit_conversion = model_to_dict(media_density_unit) if media_density_unit else None
        media_density_unit_conversion = float(media_density_unit_conversion["data_value2"])
        
        media_density = float(payload.media_density) * media_density_unit_conversion
        operation_flow = float(payload.design_flow) * operation_flow_unit_conversion
        operation_head = float(payload.design_head) * operation_head_unit_conversion

        #return JsonResponse({
        #    "data": [
        #        media_density,
        #        operation_flow,
        #        operation_head
        #    ]
        #}, safe=False, status=200)
        
        # Filter FactoryCurve objects based on the query parameters
        #data = list(FactoryCurve.objects.filter(model__regex=f'^{re.escape(model_input)}$'))
        data = list(FactoryCurve.objects.filter(model=model_input))
        def distance_interpolate(y_up,y_low,distance_target_to_upper,distance_target_to_lower):
            return y_low + (distance_target_to_lower * (y_up - y_low)) / (distance_target_to_upper + distance_target_to_lower)

        def get_eff_data(target_flow,target_head,eff_key,eff_grouped,fitting_result_eff_curve,best_candidate):
            eff_data = [
                model_to_dict(point) for point in data
                if point.head is not None and point.flow is not None and point.eff is not None
            ]
            #return JsonResponse( {"data" : eff_data} ,status = 200)
            # Convert to arrays
            flow_data = np.array([float(point['flow']) for point in eff_data])
            head_data = np.array([float(point['head']) for point in eff_data])
            efficiency = np.array([int(point['eff'].strip("%")) for point in eff_data])
            flow_limit_min = flow_data.min()
            flow_limit_max = flow_data.max()
            head_limit_min = head_data.min()
            head_limit_max = head_data.max()
        
            #best_candidate["point_flow"] = 448.3786
            #best_candidate["point_head"] = 7.5749
            #Normalize for accurate range
            norm_target_flow = (target_flow - flow_limit_min) / (flow_limit_max - flow_limit_min)
            norm_target_head = (target_head - head_limit_min) / (head_limit_max - head_limit_min)
            points_at_eff = np.column_stack((flow_data,head_data))
            predicted_eff = griddata(points_at_eff, efficiency, (target_flow, target_head), method='cubic')
            #return JsonResponse({"data": predicted_eff.tolist()},status = 200)
            predicted_eff = predicted_eff.tolist()
            #If the point is out of 2D mapping range use distance method
            if predicted_eff != predicted_eff:
                curve_equation = fitting_result_eff_curve
                eff_position = "???"
                closest_point = {}
                closest_eff_curve = None
                distance = 1000
                #Find the closest eff curve point using distance method
                for eff in eff_key:
                    for point in eff_grouped[eff]:
                        norm_selected_flow = (float(point['flow']) - flow_limit_min) / (flow_limit_max - flow_limit_min)
                        norm_selected_head = (float(point['head']) - head_limit_min) / (head_limit_max - head_limit_min)
                        diff = np.sqrt((norm_selected_flow - norm_target_flow)**2 + (norm_selected_head - norm_target_head)**2)
                        #diff = np.sqrt((float(point['flow']) - target_flow)**2 + ((float(point['head']) - target_head)**2))
                        #closest_eff_curve.append({"eff" : eff, "distance" : diff})
                        if diff < distance:
                            distance = diff
                            closest_point = { "flow" : float(point['flow']), "head" : float(point['head']), "eff" : eff , "method" : fitting_result_eff_curve[eff]["best_fit_method"],"diff" : diff}
                #return JsonResponse({"data": closest_point},status = 200)
                #Find the positioning of the closest eff curve point (upper or lower than the target point)
                coeffs = fitting_result_eff_curve[closest_point["eff"]]["best_coefficients"]
                method = fitting_result_eff_curve[closest_point["eff"]]["best_fit_method"]
                model_poly = np.poly1d(coeffs)
                predicted_head = None
                predicted_flow = None
                if "Reverse" in closest_point["method"]:
                    predicted_flow = model_poly(target_head)
                    if predicted_flow < target_flow:
                        eff_position = "upper"
                    elif predicted_flow > target_flow:
                        eff_position = "lower"
                else:
                    predicted_head = model_poly(target_flow)
                    if predicted_head < target_head:
                        eff_position = "upper"
                    elif predicted_head > target_head:
                        eff_position = "lower"
                closest_point["position"] = eff_position
                #return JsonResponse({"data": closest_point},status = 200)
                #Find the closest point on the closest eff curve    
                closest_point_upper = {}
                closest_point_lower = {}
                if eff_position == "upper":
                    closest_point_lower = closest_point
                    distance_lower = distance
                    distance_upper = 1000
                    upper_eff = next((x for x in eff_key if int(x.strip("%LR ")) > int(closest_point["eff"].strip("%LR "))),x)
                    best_candidate["point_label"] = f"Eff. between {closest_point["eff"].strip("LR ")} and {upper_eff.strip("LR ")}"
                    for point in eff_grouped[upper_eff]:
                        norm_selected_flow = (point["flow"] - flow_limit_min) / ( flow_limit_max - flow_limit_min)
                        norm_selected_head = (point["head"] - head_limit_min) / (head_limit_max - head_limit_min)
                        
                        diff = np.sqrt((norm_selected_flow - norm_target_flow)**2 + (norm_selected_head - norm_target_head)**2)
                        if diff < distance_upper:
                            distance_upper = diff
                            closest_point_upper = point
                    interp_eff = distance_interpolate(float(upper_eff.strip("%LR ")),float(closest_point_lower["eff"].strip("%LR ")),distance_upper,distance_lower)
                    return round(interp_eff,2)
                    best_candidate["point_label"] = f"Eff. between {closest_point["eff"].strip("LR ")} and {upper_eff.strip("LR ")}"
                    best_candidate["eff"] = interp_eff
                else:
                    distance_upper = distance 
                    distance_lower = 1000
                    lower_eff = None
                    closest_point_upper = closest_point        
                    match_index = eff_key.index(closest_point["eff"])
                    if match_index == 0:
                        lower_eff = closest_point["eff"]
                        best_candidate["eff"] = lower_eff.strip("%LR ")
                        best_candidate["point_label"] = f"Eff. < {lower_eff.strip("LR ")}"
                    else:
                        for i in range(match_index - 1, -1, -1):
                            if int(eff_key[i].strip("%LR ")) < int(closest_point["eff"].strip("%LR ")):
                                lower_eff = eff_key[i]
                                break
                    for point in eff_grouped[lower_eff]:
                        norm_selected_flow = (float(point["flow"]) - flow_limit_min) / ( flow_limit_max - flow_limit_min)
                        norm_selected_head = (float(point["head"]) - head_limit_min) / (head_limit_max - head_limit_min)
                        
                        diff = np.sqrt((norm_selected_flow - norm_target_flow)**2 + (norm_selected_head - norm_target_head)**2)
                        if diff < distance_lower:
                            distance_lower = diff
                            closest_point_lower = point
                    #return JsonResponse({"data": [distance_upper,distance_lower]},status = 200)
                    interp_eff = distance_interpolate(float(closest_point_upper["eff"].strip("%LR ")),float(lower_eff.strip("%LR ")),distance_upper,distance_lower)
                    return round(interp_eff,2)
                    best_candidate["eff"] = interp_eff
                    best_candidate["point_label"] = f"Bep. {interp_eff}%"
                #return JsonResponse( {"data" : [float(closest_point_upper["eff"].strip("%LR ")),float(lower_eff.strip("%LR ")),0,distance_upper,distance_lower]} ,status = 200)
                #Find position 
                #return JsonResponse({"data" : [float(upper_eff.strip("%LR ")),float(closest_point["eff"].strip("%LR ")),float(target_flow),float(closest_point_upper["flow"]),float(closest_point["flow"])]},status = 200)
                #return JsonResponse( {"data" : cal_result["bep_point"]} ,status = 200)
            else:
                return round(predicted_eff,2)
                best_candidate["eff"] = round(predicted_eff,2)
                best_candidate["point_label"] = f"Bep. {round(predicted_eff,2)}%" 

        #return JsonResponse( {"data" : cal_result} ,status = 200)
        if not data:
            return JsonResponse({"error": f"Factory curve not found for the given model:{model_input}"}, status=404)    

        #Make Imp group
        imp_grouped = {}
        for item in data:
            imp_str = item.imp_dia
            try:
               imp = float(imp_str)
            except (ValueError, TypeError):
                continue
            if imp_str != "0.00":  # ✅ Correct string value comparison
                if imp not in imp_grouped:
                    imp_grouped[imp] = []
                imp_grouped[imp].append(model_to_dict(item))

        dia_key = sorted(imp_grouped.keys())
        #return JsonResponse({"data": imp_grouped}, status=200) 

        #Make eff group
        eff_grouped = {}
        for item in data:
            try:
                eff = item.eff_rl
            except (ValueError, TypeError):
                continue  
            
            if eff == "":
                continue 
            
            if eff not in eff_grouped:
                eff_grouped[eff] = []

            eff_grouped[eff].append(model_to_dict(item))

        eff_key = sorted(eff_grouped.keys())
        #return JsonResponse( {"data" : [eff_key,eff_value]} ,status = 200)

        #test return
        #return JsonResponse({"data":eff_grouped},status = 200)

        if impeller_dia > max(imp_grouped) or impeller_dia < min(imp_grouped):
            return JsonResponse({"error": f"Error your impeller {impeller_dia} out of range {min(imp_grouped)} - {max(imp_grouped)}"},status = 404)

        def get_eff_min_max_flow(eff):
            flows = [float(p['flow']) for p in eff_grouped[eff] if p.get('flow') is not None]
            return {"min_flow_limit" : min(flows), "max_flow_limit" : max(flows)} if flows else (0, 0)
        
        def get_eff_min_max_head(eff):
            heads = [float(p['head']) for p in eff_grouped[eff] if p.get('head') is not None]
            return ({"min_head_limit" : min(heads), "max_head_limit" : max(heads)}) if heads else (0, 0)
        
        #return JsonResponse({"data" : get_eff_min_max_flow(eff_key[0])},status = 200)

        #Find equation every efficiency curve line
        fitting_result_eff_curve = {}
        
        for eff in eff_key:
            # Filter out invalid points
            eff_flow_limit = get_eff_min_max_flow(eff)
            eff_head_limit = get_eff_min_max_head(eff)
            valid_points = [
                point for point in eff_grouped[eff]
                if point.get('head') is not None and point.get('flow') is not None  
            ]

            # Convert to arrays
            x = np.array([float(point['flow']) for point in valid_points])
            y = np.array([float(point['head']) for point in valid_points])

            # Check for empty data
            if len(x) == 0 or len(y) == 0:
                continue
            
            # Initialize best fit method variables
            best_r2 = 0
            best_fit_method = None
            best_equation = ""
            best_coeffs = []

            # Final best fit values
            final_best_r2 = 0
            final_best_fit_method = None
            final_best_equation = ""
            final_best_coeffs = []

            # Polynomial fitting (degree 1 to 3)
            for degree in range(1, 4):
                try:
                    coeffs = np.polyfit(x, y, degree)
                    model_poly = np.poly1d(coeffs)
                    y_pred = model_poly(x)
                    r2 = r2_score(y, y_pred)

                    # Log the result of the polynomial fit
                    if r2 > best_r2:
                        best_r2 = r2
                        best_fit_method = "Polynomial"
                        best_equation = str(model_poly).replace("\n", " ")
                        best_coeffs = coeffs.tolist()

                    # If R² is greater than 0.999, consider it a good fit and store final results
                    if r2 > 0.999:
                        final_best_r2 = r2
                        final_best_fit_method = "Polynomial"
                        final_best_equation = str(model_poly).replace("\n", " ")
                        final_best_coeffs = coeffs.tolist()

                        fitting_result_eff_curve[eff] = {
                            "best_fit_method": final_best_fit_method,
                            "best_r2_score": round(final_best_r2, 4),
                            "best_equation": final_best_equation,
                            "best_coefficients": final_best_coeffs,
                            "flow_limit" : eff_flow_limit,
                            "head_limit" : eff_head_limit
                        }
                        break  # Exit the loop if polynomial fit works well
                except Exception as e:
                    pass
                
            # If no good polynomial fit found, try other methods
            if not final_best_fit_method:
                for degree in range(3, 7):
                    try:
                        coeffs = np.polyfit(x, y, degree)
                        model_poly = np.poly1d(coeffs)
                        y_pred = model_poly(x)
                        r2 = r2_score(y, y_pred)

                        if r2 > best_r2:
                            best_r2 = r2
                            best_fit_method = "Polynomial"
                            best_equation = str(model_poly).replace("\n", " ")
                            best_coeffs = coeffs.tolist()

                        if r2 > 0.9:
                            final_best_r2 = r2
                            final_best_fit_method = "Polynomial"
                            final_best_equation = str(model_poly).replace("\n", " ")
                            final_best_coeffs = coeffs.tolist()

                            fitting_result_eff_curve[eff] = {
                                "best_fit_method": final_best_fit_method,
                                "best_r2_score": round(final_best_r2, 4),
                                "best_equation": final_best_equation,
                                "best_coefficients": final_best_coeffs,
                                "flow_limit" : eff_flow_limit,
                                "head_limit" : eff_head_limit
                            }
                            break  # Exit the loop if polynomial fit works well
                    except Exception as e:
                        pass
                    
            # If polynomial fitting still doesn't work well, try logistic fitting
            if best_r2 < 0.9:
                try:
                    x_reverse = y
                    y_reverse = x

                    for degree in range(1, 4):
                        coeffs = np.polyfit(x_reverse, y_reverse, degree)
                        model_poly = np.poly1d(coeffs)
                        y_pred = model_poly(x_reverse)
                        r2 = r2_score(y_reverse, y_pred)

                        # Log the result of the polynomial fit
                        if r2 > best_r2:
                            best_r2 = r2
                            best_fit_method = "Polynomial (Reverse)"
                            best_equation = str(model_poly).replace("\n", " ")
                            best_coeffs = coeffs.tolist()

                        # If R² is greater than 0.999, consider it a good fit and store final results
                        if r2 > 0.9:
                            final_best_r2 = r2
                            final_best_fit_method = "Polynomial (Reverse)"
                            final_best_equation = str(model_poly).replace("\n", " ")
                            final_best_coeffs = coeffs.tolist()

                            fitting_result_eff_curve[eff] = {
                                "best_fit_method": final_best_fit_method,
                                "best_r2_score": round(final_best_r2, 4),
                                "best_equation": final_best_equation,
                                "best_coefficients": final_best_coeffs,
                                "flow_limit" : eff_flow_limit,
                                "head_limit" : eff_head_limit
                            }
                            break  # Exit the loop if polynomial fit works well
                except Exception as e:
                    pass
            
            if best_r2 < 0.9:
                try:
                    x_reverse = y
                    y_reverse = x

                    for degree in range(4, 7):
                        coeffs = np.polyfit(x_reverse, y_reverse, degree)
                        model_poly = np.poly1d(coeffs)
                        y_pred = model_poly(x_reverse)
                        r2 = r2_score(y_reverse, y_pred)

                        # Log the result of the polynomial fit
                        if r2 > best_r2:
                            best_r2 = r2
                            best_fit_method = "Polynomial (Reverse)"
                            best_equation = str(model_poly).replace("\n", " ")
                            best_coeffs = coeffs.tolist()

                        # If R² is greater than 0.999, consider it a good fit and store final results
                        if r2 > 0.9:
                            final_best_r2 = r2
                            final_best_fit_method = "Polynomial (Reverse)"
                            final_best_equation = str(model_poly).replace("\n", " ")
                            final_best_coeffs = coeffs.tolist()

                            fitting_result_eff_curve[eff] = {
                                "best_fit_method": final_best_fit_method,
                                "best_r2_score": round(final_best_r2, 4),
                                "best_equation": final_best_equation,
                                "best_coefficients": final_best_coeffs,
                                "flow_limit" : eff_flow_limit,
                                "head_limit" : eff_head_limit
                            }
                            break  # Exit the loop if polynomial fit works well
                except Exception as e:
                    pass

            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(logistic, x, y, p0=[max(y), 1, np.median(x)])
                    y_pred = logistic(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        best_r2 = r2
                        best_fit_method = "Logistic"
                        best_equation = f"{params[0]} / (1 + np.exp(-{params[1]} * (x - {params[2]})))"
                        best_coeffs = params.tolist()

                    if r2 > 0.9:
                        final_best_r2 = r2
                        final_best_fit_method = "Logistic"
                        final_best_equation = f"{params[0]} / (1 + np.exp(-{params[1]} * (x - {params[2]})))"
                        final_best_coeffs = params.tolist()

                        fitting_result_eff_curve[eff] = {
                            "best_fit_method": final_best_fit_method,
                            "best_r2_score": round(final_best_r2, 4),
                            "best_equation": final_best_equation,
                            "best_coefficients": final_best_coeffs,
                            "flow_limit" : eff_flow_limit,
                            "head_limit" : eff_head_limit
                        }
                        break  # Exit the loop if logistic fit works well
                except Exception as e:
                    pass
                
            # If logistic doesn't work well, try Gaussian fitting
            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(gaussian, x, y, p0=[max(y), np.median(x), 1])
                    y_pred = gaussian(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        best_r2 = r2
                        best_fit_method = "Gaussian"
                        best_equation = f"{params[0]} * np.exp(-(x - {params[1]})**2 / (2 * {params[2]}**2))"
                        best_coeffs = params.tolist()

                    if r2 > 0.9:
                        final_best_r2 = r2
                        final_best_fit_method = "Gaussian"
                        final_best_equation = f"{params[0]} * np.exp(-(x - {params[1]})**2 / (2 * {params[2]}**2))"
                        final_best_coeffs = params.tolist()

                        fitting_result_eff_curve[eff] = {
                            "best_fit_method": final_best_fit_method,
                            "best_r2_score": round(final_best_r2, 4),
                            "best_equation": final_best_equation,
                            "best_coefficients": final_best_coeffs,
                            "flow_limit" : eff_flow_limit,
                            "head_limit" : eff_head_limit
                        }
                        break  # Exit the loop if Gaussian fit works well
                except Exception as e:
                    pass
                
            # If Gaussian doesn't work well, try Exponential fitting
            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(exponential, x, y, p0=[max(y), 1, min(y)])
                    y_pred = exponential(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        best_r2 = r2
                        best_fit_method = "Exponential"
                        best_equation = f"{params[0]} * np.exp(-{params[1]} * x) + {params[2]}"
                        best_coeffs = params.tolist()

                    if r2 > 0.9:
                        final_best_r2 = r2
                        final_best_fit_method = "Exponential"
                        final_best_equation = f"{params[0]} * np.exp(-{params[1]} * x) + {params[2]}"
                        final_best_coeffs = params.tolist()

                        fitting_result_eff_curve[eff] = {
                            "best_fit_method": final_best_fit_method,
                            "best_r2_score": round(final_best_r2, 4),
                            "best_equation": final_best_equation,
                            "best_coefficients": final_best_coeffs,
                            "flow_limit" : eff_flow_limit,
                            "head_limit" : eff_head_limit
                        }
                        break  # Exit the loop if exponential fit works well
                except Exception as e:
                    pass
                
            # If no good fit is found, try Parabolic fitting
            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(quadratic, x, y, p0=[1, 1, 1])
                    y_pred = quadratic(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        best_r2 = r2
                        best_fit_method = "Parabolic"
                        best_equation = f"{params[0]}x² + {params[1]}x + {params[2]}"
                        best_coeffs = params.tolist()

                    if r2 > 0.9:
                        final_best_r2 = r2
                        final_best_fit_method = "Parabolic"
                        final_best_equation = f"{params[0]}x² + {params[1]}x + {params[2]}"
                        final_best_coeffs = params.tolist()

                        fitting_result_eff_curve[eff] = {
                            "best_fit_method": final_best_fit_method,
                            "best_r2_score": round(final_best_r2, 4),
                            "best_equation": final_best_equation,
                            "best_coefficients": final_best_coeffs,
                            "flow_limit" : eff_flow_limit,
                            "head_limit" : eff_head_limit
                        }
                        break  # Exit the loop if parabolic fit works well
                except Exception as e:
                    pass
                
            # If none of the methods work, store the best available result
            if not final_best_fit_method:
                fitting_result_eff_curve[eff] = {
                    "best_fit_method": best_fit_method,
                    "best_r2_score": round(best_r2, 4),
                    "best_equation": best_equation,
                    "best_coefficients": best_coeffs,
                    "flow_limit" : eff_flow_limit,
                    "head_limit" : eff_head_limit    
                }

        # Return the final result after processing all efficiency curves
        #return JsonResponse({"equation": fitting_result_eff_curve}, status=200)

        #Find equation every impeller curve line
        fitting_result_imp_curve = {} 
            
        for dia in dia_key:
            # Filter out invalid points
            valid_points = [
                point for point in imp_grouped[dia]
                if point.get('head') is not None and point.get('flow') is not None  
            ]

            # Convert to arrays
            x = np.array([float(point['flow']) for point in valid_points])
            y = np.array([float(point['head']) for point in valid_points])

            # Check for empty data
            if len(x) == 0 or len(y) == 0:
                continue
            
            # Initialize best fit method variables
            imp_best_r2 = 0
            imp_best_fit_method = None
            imp_best_equation = ""
            imp_best_coeffs = []

            # Final best fit values
            imp_final_best_r2 = 0
            imp_final_best_fit_method = None
            imp_final_best_equation = ""
            imp_final_best_coeffs = []

            # Polynomial fitting (degree 1 to 3)
            for degree in range(1, 4):
                try:
                    coeffs = np.polyfit(x, y, degree)
                    model_poly = np.poly1d(coeffs)
                    y_pred = model_poly(x)
                    r2 = r2_score(y, y_pred)

                    # Log the result of the polynomial fit
                    if r2 > best_r2:
                        imp_best_r2 = r2
                        imp_best_fit_method = "Polynomial"
                        imp_best_equation = str(model_poly).replace("\n", " ")
                        imp_best_coeffs = coeffs.tolist()

                    # If R² is greater than 0.999, consider it a good fit and store final results
                    if r2 > 0.999:
                        imp_final_best_r2 = r2
                        imp_final_best_fit_method = "Polynomial"
                        imp_final_best_equation = str(model_poly).replace("\n", " ")
                        imp_final_best_coeffs = coeffs.tolist()

                        fitting_result_imp_curve[dia] = {
                            "best_fit_method": imp_final_best_fit_method,
                            "best_r2_score": round(imp_final_best_r2, 4),
                            "best_equation": imp_final_best_equation,
                            "best_coefficients": imp_final_best_coeffs,
                        }
                        break  # Exit the loop if polynomial fit works well
                except Exception as e:
                    pass
                
            # If no good polynomial fit found, try other methods
            if not imp_final_best_fit_method:
                for degree in range(3, 7):
                    try:
                        coeffs = np.polyfit(x, y, degree)
                        model_poly = np.poly1d(coeffs)
                        y_pred = model_poly(x)
                        r2 = r2_score(y, y_pred)

                        if r2 > best_r2:
                            imp_best_r2 = r2
                            imp_best_fit_method = "Polynomial"
                            imp_best_equation = str(model_poly).replace("\n", " ")
                            imp_best_coeffs = coeffs.tolist()

                        if r2 > 0.9:
                            imp_final_best_r2 = r2
                            imp_final_best_fit_method = "Polynomial"
                            imp_final_best_equation = str(model_poly).replace("\n", " ")
                            imp_final_best_coeffs = coeffs.tolist()

                            fitting_result_imp_curve[dia] = {
                                "best_fit_method": imp_final_best_fit_method,
                                "best_r2_score": round(imp_final_best_r2, 4),
                                "best_equation": imp_final_best_equation,
                                "best_coefficients": imp_final_best_coeffs,
                            }
                            break  # Exit the loop if polynomial fit works well
                    except Exception as e:
                        pass
                    
            # If polynomial fitting still doesn't work well, try logistic fitting
            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(logistic, x, y, p0=[max(y), 1, np.median(x)])
                    y_pred = logistic(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        imp_best_r2 = r2
                        imp_best_fit_method = "Logistic"
                        imp_best_equation = f"{params[0]} / (1 + np.exp(-{params[1]} * (x - {params[2]})))"
                        imp_best_coeffs = params.tolist()

                    if r2 > 0.9:
                        imp_final_best_r2 = r2
                        imp_final_best_fit_method = "Logistic"
                        imp_final_best_equation = f"{params[0]} / (1 + np.exp(-{params[1]} * (x - {params[2]})))"
                        imp_final_best_coeffs = params.tolist()

                        fitting_result_imp_curve[dia] = {
                            "best_fit_method": imp_final_best_fit_method,
                            "best_r2_score": round(imp_final_best_r2, 4),
                            "best_equation": imp_final_best_equation,
                            "best_coefficients": imp_final_best_coeffs,
                        }
                        break  # Exit the loop if logistic fit works well
                except Exception as e:
                    pass
                
            # If logistic doesn't work well, try Gaussian fitting
            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(gaussian, x, y, p0=[max(y), np.median(x), 1])
                    y_pred = gaussian(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        imp_best_r2 = r2
                        imp_best_fit_method = "Gaussian"
                        imp_best_equation = f"{params[0]} * np.exp(-(x - {params[1]})**2 / (2 * {params[2]}**2))"
                        imp_best_coeffs = params.tolist()

                    if r2 > 0.9:
                        imp_final_best_r2 = r2
                        imp_final_best_fit_method = "Gaussian"
                        imp_final_best_equation = f"{params[0]} * np.exp(-(x - {params[1]})**2 / (2 * {params[2]}**2))"
                        imp_final_best_coeffs = params.tolist()

                        fitting_result_eff_curve[dia] = {
                            "best_fit_method": imp_final_best_fit_method,
                            "best_r2_score": round(imp_final_best_r2, 4),
                            "best_equation": imp_final_best_equation,
                            "best_coefficients": imp_final_best_coeffs,
                        }
                        break  # Exit the loop if Gaussian fit works well
                except Exception as e:
                    pass
                
            # If Gaussian doesn't work well, try Exponential fitting
            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(exponential, x, y, p0=[max(y), 1, min(y)])
                    y_pred = exponential(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        imp_best_r2 = r2
                        imp_best_fit_method = "Exponential"
                        imp_best_equation = f"{params[0]} * np.exp(-{params[1]} * x) + {params[2]}"
                        imp_best_coeffs = params.tolist()

                    if r2 > 0.9:
                        imp_final_best_r2 = r2
                        imp_final_best_fit_method = "Exponential"
                        imp_final_best_equation = f"{params[0]} * np.exp(-{params[1]} * x) + {params[2]}"
                        imp_final_best_coeffs = params.tolist()

                        fitting_result_eff_curve[dia] = {
                            "best_fit_method": imp_final_best_fit_method,
                            "best_r2_score": round(imp_final_best_r2, 4),
                            "best_equation": imp_final_best_equation,
                            "best_coefficients": imp_final_best_coeffs,
                        }
                        break  # Exit the loop if exponential fit works well
                except Exception as e:
                    pass
                
            # If no good fit is found, try Parabolic fitting
            if best_r2 < 0.9:
                try:
                    params, _ = curve_fit(quadratic, x, y, p0=[1, 1, 1])
                    y_pred = quadratic(x, *params)
                    r2 = r2_score(y, y_pred)

                    if r2 > best_r2:
                        imp_best_r2 = r2
                        imp_best_fit_method = "Parabolic"
                        imp_best_equation = f"{params[0]}x² + {params[1]}x + {params[2]}"
                        imp_best_coeffs = params.tolist()

                    if r2 > 0.9:
                        imp_final_best_r2 = r2
                        imp_final_best_fit_method = "Parabolic"
                        imp_final_best_equation = f"{params[0]}x² + {params[1]}x + {params[2]}"
                        imp_final_best_coeffs = params.tolist()

                        fitting_result_imp_curve[dia] = {
                            "best_fit_method": imp_final_best_fit_method,
                            "best_r2_score": round(imp_final_best_r2, 4),
                            "best_equation": imp_final_best_equation,
                            "best_coefficients": imp_final_best_coeffs,
                        }
                        break  # Exit the loop if parabolic fit works well
                except Exception as e:
                    pass
                
            # If none of the methods work, store the best available result
            if not imp_final_best_fit_method:
                fitting_result_imp_curve[dia] = {
                    "best_fit_method": imp_best_fit_method,
                    "best_r2_score": round(imp_best_r2, 4),
                    "best_equation": imp_best_equation,
                    "best_coefficients": imp_best_coeffs,    
                }

        # Return the final result after processing all efficiency curves
        #return JsonResponse({"equation": fitting_result_imp_curve}, status=200)


        #Test fiting data eff curve
        #x_flow = np.array([pt['flow'] for pt in eff_grouped[eff_key[4]]])
        #y_head = np.array([pt['head'] for pt in eff_grouped[eff_key[4]]])

        #model_poly = np.poly1d(fitting_result_eff_curve[eff_key[4]]["best_coefficients"])

        # Extract flow and head values from the grouped data for eff_key[2]
        #flow_values = [point['flow'] for point in eff_grouped[eff_key[4]] if point.get('flow') is not None]

        # Ensure all flow values are converted to floats (in case they're strings)
        #flow_values = [float(f) for f in flow_values]  # Convert to float

        # Ensure there are values in the list before trying to get min/max
        #if flow_values:
        #    min_flow = min(flow_values)
        #    max_flow = max(flow_values)

        #eff_num_points = 500
        #eff_flow_values = np.linspace(min_flow, max_flow, eff_num_points)
        #eff_head_values = model_poly(eff_flow_values)  # Use eff_flow_values instead of flow_values
        #eff_curve = eff_key[4]

        # ✅ Build curve data
        #eff_curve_data = [
        #    {"flow": round(float(f), 3), "head": round(float(h), 3), "eff": f"{eff_curve}"}
        #    for f, h in zip(eff_flow_values, eff_head_values)
        #]

        # Return the result as a JSON response
        #return JsonResponse({"data": curve_data}, status=200)

        target_dia = impeller_dia
        lower_dia = max([d for d in dia_key if d <= impeller_dia], default=min(dia_key))
        upper_dia = min([d for d in dia_key if d >= impeller_dia], default=max(dia_key))
        available_dias = sorted(fitting_result_imp_curve.keys())  # All fitted diameters

        # --- Shared function ---
        def get_min_max_flow(dia):
            flows = [float(p['flow']) for p in imp_grouped[dia] if p.get('flow') is not None]
            return (min(flows), max(flows)) if flows else (0, 0)
        
        if target_dia in available_dias:
            # ✅ Case 1: Curve exists
            fitting_result_imp_curve[target_dia]
            coeffs = fitting_result_imp_curve[target_dia]['coefficients']
            model_poly = np.poly1d(coeffs)
            min_flow, max_flow = get_min_max_flow(target_dia)

            cal_result["desire_curve_data"] = imp_grouped[round(float(target_dia),2)]

        else:
            # ✅ Case 2: Interpolate data from two curves
        #Method 1: interpolate curve of upper and lower then find equation then generate curve
            # Step 1: Get flow/head pairs from lower and upper diameters
            lower_points = [
                (float(p['flow']), float(p['head']))
                for p in imp_grouped[lower_dia]
                if p.get('flow') is not None and p.get('head') is not None
            ]
            upper_points = [
                (float(p['flow']), float(p['head']))
                for p in imp_grouped[upper_dia]
                if p.get('flow') is not None and p.get('head') is not None
            ]

            # Step 2: Sort and truncate to min length
            lower_points = sorted(lower_points, key=lambda x: x[0])
            upper_points = sorted(upper_points, key=lambda x: x[0])
            min_len = min(len(lower_points), len(upper_points))
            lower_points = lower_points[:min_len]
            upper_points = upper_points[:min_len]

            # Step 3: Interpolate point-by-point
            interpolated_points = []
            for (f_low, h_low), (f_up, h_up) in zip(lower_points, upper_points):
                f_interp = (f_low + f_up) / 2
                h_interp = h_low + ((h_up - h_low) * (target_dia - lower_dia) / (upper_dia - lower_dia))
                interpolated_points.append((f_interp, h_interp))

            # Step 4: Fit polynomial on interpolated points
            x_interp = np.array([pt[0] for pt in interpolated_points])
            y_interp = np.array([pt[1] for pt in interpolated_points])
            degree = 3  # or make dynamic
            coeffs = np.polyfit(x_interp, y_interp, degree)
            model_poly = np.poly1d(coeffs)
            equation = str(model_poly).replace("\n", " ")

            # Step 5: Calculate R² score for the fit
            y_pred = model_poly(x_interp)
            r2 = r2_score(y_interp, y_pred)

            fitting_result_imp_curve[target_dia] = {
                "best_fit_method": "Polynomial",
                "best_r2_score": round(r2, 4),
                "best_equation": equation,
                "best_coefficients": coeffs.tolist(),
            }

            #return JsonResponse({"data": cal_result['equation']})
            # Step 5: Use interpolated point range
            min_flow_lower, max_flow_lower = get_min_max_flow(lower_dia)
            min_flow_upper, max_flow_upper = get_min_max_flow(upper_dia)
            min_flow = (min_flow_upper + min_flow_lower)/ 2
            max_flow = (max_flow_upper + max_flow_lower)/ 2


        #Method 2: interpolate the coefficients of equation then generate curve
            #lower_coeffs = fitting_result_imp_curve.get(lower_dia, {}).get("coefficients")
            #upper_coeffs = fitting_result_imp_curve.get(upper_dia, {}).get("coefficients")
#
            #if not lower_coeffs or not upper_coeffs:
            #    return JsonResponse({"error": "Not enough data to interpolate between diameters."}, status=400)
#
            #if len(lower_coeffs) != len(upper_coeffs):
            #    return JsonResponse({"error": "Equations have different degrees. Cannot interpolate."}, status=400)
#
            ## Linear interpolation between lower and upper diameters
            #interpolated_coeffs = [
            #    l + ((u - l) * (target_dia - lower_dia) / (upper_dia - lower_dia))
            #    for l, u in zip(lower_coeffs, upper_coeffs)
            #]
#
            #model_poly = np.poly1d(interpolated_coeffs)
            #degree = len(interpolated_coeffs) - 1
            #equation = str(model_poly).replace("\n", " ")
#
            #cal_result['equation'] = {
            #    "degree": degree,
            #    "equation": equation,
            #    "coefficients": interpolated_coeffs,
            #    "source_diameters": [lower_dia, upper_dia]
            #}
#
            #min_low, max_low = get_min_max_flow(lower_dia)
            #min_high, max_high = get_min_max_flow(upper_dia)
            #min_flow = (min_low + min_high) / 2
            #max_flow = (max_low + max_high) / 2

            # ✅ Step 6: Generate flow points and calculate head
            num_points = 500
            flow_values = np.linspace(min_flow, max_flow, num_points)
            head_values = model_poly(flow_values)
            imp_dia = impeller_dia
    
            # ✅ Build curve data
            curve_data = [
                {"flow": round(float(f), 3), "head": round(float(h), 3), "imp_dia": f"{imp_dia}"}
                for f, h in zip(flow_values, head_values)
            ]
    
            # ✅ Add to cal_result
            cal_result["desire_curve_data"] = curve_data

            #return JsonResponse({"data": eff_key}, status=200)

            eff_curve_data = []
            for eff in eff_key:
                for point in eff_grouped[eff]:
                    eff_curve_data.append({
                        "flow": point["flow"],
                        "head": point["head"],
                        "eff": point["eff"],
                    })

            cal_result["total_curve_data"] = eff_curve_data
        #return JsonResponse({"data": cal_result["total_curve_data"]}, status=200)

        used_points = set()
        eff_intersections = []
   
        tolerance = 0.7

        for eff in eff_key:
            curve_info = fitting_result_eff_curve.get(eff)
            flow_limit_min = curve_info["flow_limit"]["min_flow_limit"]
            flow_limit_max = curve_info["flow_limit"]["max_flow_limit"]
            head_limit_min = curve_info["head_limit"]["min_head_limit"]
            head_limit_max = curve_info["head_limit"]["max_head_limit"]

            if not curve_info or not curve_info.get("best_coefficients"):
                continue
            
            coeffs = curve_info["best_coefficients"]
            method = curve_info["best_fit_method"]
            model_poly = np.poly1d(coeffs)

            for pt in cal_result["desire_curve_data"]:
                flow = pt["flow"]
                head = pt["head"]
                key = (round(flow, 3), round(head, 3))

                if key in used_points:
                    continue  # prevent sharing across effs
                
                # Skip if point is out of bounds
                if not (flow_limit_min <= flow <= flow_limit_max and head_limit_min <= head <= head_limit_max):
                    continue
                
                # Calculate predicted value
                if "Reverse" in method:
                    predicted_flow = model_poly(head)
                    diff = abs(predicted_flow - flow)
                else:
                    predicted_head = model_poly(flow)
                    diff = abs(predicted_head - head)

                # Accept if within tolerance and inside limits
                if diff < tolerance:
                    used_points.add(key)
                    eff_intersections.append({
                        "point_flow": round(flow, 3),
                        "point_head": round(head, 3),
                        "point_label": f"Intersection of {eff}%",
                        "eff": eff
                    })

            
        #return JsonResponse({"data": eff_intersections}, status=200)
            

        # Step 1: Group intersections by efficiency
        grouped_by_eff = {}
        for point in eff_intersections:
            eff = point['eff']
            if eff not in grouped_by_eff:
                grouped_by_eff[eff] = []
            grouped_by_eff[eff].append(point)

        # Step 2: Process each group to split by flow gap and pick best in each
        final_filtered_points = {}

        for eff, points in grouped_by_eff.items():
            # Sort by flow
            sorted_points = sorted(points, key=lambda p: p['point_flow'])

            groups = []
            current_group = [sorted_points[0]]
            current_close_point = []

            for prev, curr in zip(sorted_points, sorted_points[1:]):
                if abs(curr['point_flow'] - prev['point_flow']) > 10:
                    groups.append(current_group)
                    current_group = [curr]
                else:
                    current_group.append(curr)
            if current_group:
                groups.append(current_group)

            # Pick best point from each group (closest to center flow)
            for group in groups:
                if len(group) == 1:
                    final_filtered_points[eff] = [group[0]]
                else:
                    avg_flow = sum(p['point_flow'] for p in group) / len(group)
                    closest_point = min(group, key=lambda p: abs(p['point_flow'] - avg_flow))
                    current_close_point.append(closest_point)
                    final_filtered_points[eff] = current_close_point

        # Step 3: Store in result and return
        cal_result["intersection_points"] = final_filtered_points
        #return JsonResponse({"data": cal_result["intersection_points"]}, status=200)

        intersec_eff_keys = list(final_filtered_points.keys())
        #return JsonResponse({"data": intersec_eff_keys}, status=200)


        # Step 1: Find BEP_eff
        BEP_eff = max(intersec_eff_keys, key=lambda e: float(e.strip('%LR ')))  # safely strip L or space

        #return JsonResponse({"data": BEP_eff}, status=200)

        # Step 2: Get points with this efficiency
        bep_points = final_filtered_points[BEP_eff]
        #return JsonResponse({"data": bep_points}, status=200)

        # Step 3: Select the BEP point
        if len(bep_points) == 1:
            cal_result["bep_point"] = {
                "point_flow": bep_points[0]["point_flow"],
                "point_head": bep_points[0]["point_head"],
                "point_label": f"{bep_points[0]["eff"]} BEP", 
                "eff" : bep_points[0]["eff"].strip('%LR ')
            }
        elif len(bep_points) == 2:
            # Sort by flow
            bep_points = sorted(bep_points, key=lambda p: p["point_flow"])
            flow1 = bep_points[0]["point_flow"]
            flow2 = bep_points[1]["point_flow"]
            head1 = bep_points[0]["point_head"]
            head2 = bep_points[1]["point_head"]
            center_flow = (flow1 + flow2) / 2
            center_head = (head1 + head2) / 2

            # Get curve equation for BEP_eff
            curve_info = fitting_result_imp_curve.get(imp_dia)
            coeffs = curve_info["best_coefficients"]
            method = curve_info["best_fit_method"]
            model_poly = np.poly1d(coeffs)
            # Look for closest point in desire_curve_data near center_flow
            best_candidate = None
            min_diff = float("inf")
            
            if "Reverse" in method:
                center_flow = model_poly(center_head)
            else:
                center_head = model_poly(center_flow)

            best_candidate = {
                "point_flow": center_flow,
                "point_head": center_head,
                "point_label": "??? BEP", 
                "eff" : "???"
            }

            #Find BEP point and its actual eff
            upper_eff = None
            for eff in eff_key:
                if float(eff.strip('%LR ')) > float(BEP_eff.strip('%LR ')):
                    upper_eff = eff

            if upper_eff == None:
                best_candidate["eff"] = BEP_eff  # Set efficiency directly for BEP
                cal_result["bep_point"] = best_candidate
            else:
                bep_eff = get_eff_data(float(best_candidate["point_flow"]),float(best_candidate["point_head"]),eff_key,eff_grouped,fitting_result_eff_curve,best_candidate)
                best_candidate["eff"] = bep_eff
                best_candidate["point_label"] = f"Bep. {bep_eff}%" 
                cal_result["bep_point"] = best_candidate

        #return JsonResponse( {"data" : cal_result} ,status = 200)

        min_flow = float(cal_result["bep_point"]["point_flow"]) * 0.3
        max_flow = float(cal_result["bep_point"]["point_flow"]) * 1.1

        coeffs = fitting_result_imp_curve[impeller_dia]['best_coefficients']
        
        model_poly = np.poly1d(coeffs)
        min_head = model_poly(min_flow)
        max_head = model_poly(max_flow)

        cal_result["min_flow_point"] = {"point_flow" : round(min_flow,2), "point_head" : round(min_head,2), "point_label" : "Min Flow", "eff" : "???"}
        cal_result["max_flow_point"] = {"point_flow" : round(max_flow,2), "point_head" : round(max_head,2), "point_label" : "Max Flow", "eff" : "???"}
        cal_result["operation_point"] = {"point_flow" : round(operation_flow,2), "point_head" : round(operation_head,2), "point_label" : "Operation Point"}

        #return JsonResponse( {"data" : cal_result} ,status = 200)
    
        min_flow_eff = get_eff_data(cal_result["min_flow_point"]["point_flow"],cal_result["min_flow_point"]["point_head"],eff_key,eff_grouped,fitting_result_eff_curve,cal_result["min_flow_point"])
        max_flow_eff = get_eff_data(cal_result["max_flow_point"]["point_flow"],cal_result["max_flow_point"]["point_head"],eff_key,eff_grouped,fitting_result_eff_curve,cal_result["max_flow_point"])
        operation_eff = get_eff_data(cal_result["operation_point"]["point_flow"],cal_result["operation_point"]["point_head"],eff_key,eff_grouped,fitting_result_eff_curve,cal_result["operation_point"])
        

        #cal_result["min_flow_point"]["eff"] = min_flow_eff
        #cal_result["min_flow_point"]["point_label"] = f"Min flow {min_flow_eff}%"
        cal_result["max_flow_point"]["eff"] = max_flow_eff
        cal_result["max_flow_point"]["point_label"] = f"Max flow {max_flow_eff}%"
        cal_result["operation_point"]["eff"] = operation_eff
        cal_result["operation_point"]["point_label"] = f"Operation {operation_eff}%"

        #Find power
        cal_result["hydraulic_power"] = (media_density * 9.81 * float(cal_result["operation_point"]["point_flow"]) * float(cal_result["operation_point"]["point_head"]))/(3600)
        cal_result["power_min_flow"] = (media_density * 9.81 * float(cal_result["min_flow_point"]["point_flow"]) * float(cal_result["min_flow_point"]["point_head"]))/(3600 * (float(cal_result["min_flow_point"]["eff"])/100))
        cal_result["power_max_flow"] = (media_density * 9.81 * float(cal_result["max_flow_point"]["point_flow"]) * float(cal_result["max_flow_point"]["point_head"]))/(3600 * (float(cal_result["max_flow_point"]["eff"])/100))
        cal_result["power_bep"] = (media_density * 9.81 * float(cal_result["bep_point"]["point_flow"]) * float(cal_result["bep_point"]["point_head"]))/(3600 * (float(cal_result["bep_point"]["eff"])/100))
        cal_result["power_required_cal"] = cal_result["hydraulic_power"] * (float(cal_result["operation_point"]["eff"]) / 100)
        
        #Find Shut off head
        coeffs = fitting_result_imp_curve[impeller_dia]['best_coefficients']
        model_poly = np.poly1d(coeffs)
        cal_result["shut_off_head"] = model_poly(0)

        #Find npshr
        fitting_result_npshr_curve = {}
        npshr_data = [
                model_to_dict(point) for point in data
                if point.npshr is not None and point.flow is not None
            ]
        
        x = np.array([float(point['flow']) for point in npshr_data])
        y = np.array([float(point['npshr']) for point in npshr_data])

        npshr_best_r2 = 0
        npshr_best_fit_method = None
        npshr_best_equation = ""
        npshr_best_coeffs = []

        npshr_final_best_r2 = 0
        npshr_final_best_fit_method = None
        npshr_final_best_equation = ""
        npshr_final_best_coeffs = []

        for degree in range(1, 4):
            try:
                coeffs = np.polyfit(x, y, degree)
                model_poly = np.poly1d(coeffs)
                y_pred = model_poly(x)
                r2 = r2_score(y, y_pred)
                if r2 > npshr_best_r2:
                    npshr_best_r2 = r2
                    npshr_best_fit_method = "Polynomial"
                    npshr_best_equation = str(model_poly).replace("\n", " ")
                    npshr_best_coeffs = coeffs.tolist()
                if r2 > 0.999:
                    npshr_final_best_r2 = r2
                    npshr_final_best_fit_method = "Polynomial"
                    npshr_final_best_equation = str(model_poly).replace("\n", " ")
                    npshr_final_best_coeffs = coeffs.tolist()
                    fitting_result_npshr_curve = {
                        "best_fit_method": npshr_final_best_fit_method,
                        "best_r2_score": round(npshr_final_best_r2, 4),
                        "best_equation": npshr_final_best_equation,
                        "best_coefficients": npshr_final_best_coeffs,
                    }
                    break
            except Exception as e:
                pass

        if npshr_best_r2 < 0.999:
            for degree in range(3, 7):
                try:
                    coeffs = np.polyfit(x, y, degree)
                    model_poly = np.poly1d(coeffs)
                    y_pred = model_poly(x)
                    r2 = r2_score(y, y_pred)
                    if r2 > npshr_best_r2:
                        npshr_best_r2 = r2
                        npshr_best_fit_method = "Polynomial"
                        npshr_best_equation = str(model_poly).replace("\n", " ")
                        npshr_best_coeffs = coeffs.tolist()
                    if r2 > 0.9:
                        npshr_final_best_r2 = r2
                        npshr_final_best_fit_method = "Polynomial"
                        npshr_final_best_equation = str(model_poly).replace("\n", " ")
                        npshr_final_best_coeffs = coeffs.tolist()
                        fitting_result_npshr_curve = {
                            "best_fit_method": npshr_final_best_fit_method,
                            "best_r2_score": round(npshr_final_best_r2, 4),
                            "best_equation": npshr_final_best_equation,
                            "best_coefficients": npshr_final_best_coeffs,
                        }
                        break 
                except Exception as e:
                    pass
        # If none of the methods work, store the best available result
        if not npshr_final_best_fit_method:
            fitting_result_npshr_curve = {
                "best_fit_method": npshr_best_fit_method,
                "best_r2_score": round(npshr_best_r2, 4),
                "best_equation": npshr_best_equation,
                "best_coefficients": npshr_best_coeffs,    
            }

        coeffs = fitting_result_npshr_curve['best_coefficients']
        model_poly = np.poly1d(coeffs)
        cal_result["npshr"] = model_poly(float(cal_result["operation_point"]["point_flow"]))
        cal_result["unit"] = {
            "unit_flow": "m3/h",
            "unit_power": "kW",
            "unit_head": "m",
            "unit_npshr": "m",
            "unit_eff": "%",
        }
        
        #return JsonResponse({"data": fitting_result_npshr_curve}, status = 200)
        #return JsonResponse({"data": cal_result["npshr_point"]}, status = 200)

        return JsonResponse({"data": cal_result}, status = 200)

    @http_get('/number', response=list[FactoryCurveNumber_schema])
    def get_factory_curve_number(self, request):
        data = list(FactoryCurveNumber.objects.all().values())
        return JsonResponse({"data": data}, status=200)
    