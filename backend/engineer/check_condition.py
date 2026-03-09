from django.http import JsonResponse
from factory_curve.schema.factory_curve import CalPumpPayload_schema
from engineer.schema.engineer import EngineerReportCheckPayload_schema
from pump_data.models import KMonitoringLOV
from factory_curve.models import FactoryCurve
from django.forms.models import model_to_dict
from scipy.optimize import curve_fit
from scipy.interpolate import griddata
import numpy as np
from sklearn.metrics import r2_score
from dataclasses import dataclass
from typing import Optional, List, Dict, Any, Tuple
from numpy.typing import NDArray
from dateutil import parser


G = 9.80665  # m/s²

# ---------- curve models ----------
def logistic(x, A, k, x0):
    # A / (1 + exp(-k*(x - x0)))
    return A / (1.0 + np.exp(-k * (x - x0)))

def gaussian(x, A, mu, sigma):
    # A * exp(-(x - mu)^2 / (2*sigma^2))
    return A * np.exp(-((x - mu) ** 2) / (2.0 * (sigma ** 2)))

def exponential(x, A, B, C):
    # A * exp(-B * x) + C  (stable for pump-like decays)
    return A * np.exp(-B * x) + C

def quadratic(x, a, b, c):
    return a * x**2 + b * x + c

def _eff_num(label: str) -> float:
    return float(str(label).strip('%LR '))


class FitResult:
    def __init__(self, best_fit_method, best_r2_score, best_equation, best_coefficients, flow_limit=None, head_limit=None):
        self.best_fit_method = best_fit_method
        self.best_r2_score = best_r2_score
        self.best_equation = best_equation
        self.best_coefficients = best_coefficients
        self.flow_limit = flow_limit
        self.head_limit = head_limit

    # Convert the FitResult object to a dictionary
    def to_dict(self):
        return {
            "best_fit_method": self.best_fit_method,
            "best_r2_score": self.best_r2_score,
            "best_equation": self.best_equation,
            "best_coefficients": self.best_coefficients,
            "flow_limit": self.flow_limit,
            "head_limit": self.y,
        }


class ReportCheckResult:
    # Initialize
    def __init__(self, pump_data : CalPumpPayload_schema, check_result=None):
        self.pump_data = pump_data
        self.check_result = check_result

        self.imp_grouped: Dict[str, List[Dict[str, Any]]] = {}
        self.imp_key: List[str] = []

        self.eff_grouped: Dict[str, List[Dict[str, Any]]] = {}
        self.eff_key: List[str] = []
        
        self.npshr_grouped: Dict[str, List[Dict[str, Any]]] = {}

        
        self.data: List[Dict[str, Any]] = []

        self.imp_fits: Dict[Any, FitResult] = {}
        self.eff_fits: Dict[Any, FitResult] = {}
        self.npshr_fits: Dict[Any, FitResult] = {}
        self.desired_imp_fit: Optional[FitResult] = None

        self.desire_imp_curve_data: List[Dict[str, float]] = []
        self.efficiency_curve_data: List[Dict[str, float]] = []
        self.intersections: Dict[str, List[Dict[str, float]]] = {}

    # ---------- utilities ----------
    def FindUnitConversion(self, unit_group: str, unit: str):
        result = KMonitoringLOV.objects.filter(
            type_name="pump_unit", product_name=unit_group, data_value=unit
        ).first()
        return result
    
    def FindUnitStandardConversion(self, unit_group: str, unit: str, desire_unit: str):
        given_unit_conv = float(model_to_dict(self.FindUnitConversion(unit_group, unit))["data_value2"])
        desire_conv = float(model_to_dict(self.FindUnitConversion(unit_group, desire_unit))["data_value2"])
        return desire_conv/ given_unit_conv

    @staticmethod
    def distance_interpolate(y_up, y_low, d_up, d_low):
        return y_low + (d_low * (y_up - y_low)) / (d_up + d_low)
  
    @staticmethod
    def normalize_data(target, limit_min, limit_max):
        return (target - limit_min) / (limit_max - limit_min)

    def get_min_max_flow(self, group_data, key):
        flows = [float(p["flow"]) for p in group_data[key] if p.get("flow") is not None]
        return {"min_flow_limit": min(flows), "max_flow_limit": max(flows)} if flows else None

    def get_min_max_head(self, group_data, key):
        heads = [float(p["head"]) for p in group_data[key] if p.get("head") is not None]
        return {"min_head_limit": min(heads), "max_head_limit": max(heads)} if heads else None
    # ---------- fit family ----------
    def _poly_fit_family(self, x: NDArray, y: NDArray, reverse: bool = False, degs=range(1, 4)) -> Optional[FitResult]:
        if reverse:
            x, y = y, x
            label = "Polynomial (Reverse)"
        else:
            label = "Polynomial"

        best: Optional[FitResult] = None
        for d in degs:
            try:
                coeffs = np.polyfit(x, y, d)
                model = np.poly1d(coeffs)
                yhat = model(x)
                r2 = float(r2_score(y, yhat))
                fr = FitResult(
                    best_fit_method=label,
                    best_r2_score=r2,
                    best_equation=str(model).replace("\n", " "),
                    best_coefficients=coeffs.tolist(),
                )
                if best is None or fr.best_r2_score > best.best_r2_score:
                    best = fr
                if (not reverse and r2 > 0.999) or (reverse and r2 > 0.9):
                    return fr
            except Exception:
                continue
        return best

    def _logistic_fit(self, x: NDArray, y: NDArray) -> Optional[FitResult]:
        try:
            p0 = [float(np.max(y)), 1.0, float(np.median(x))]
            params, _ = curve_fit(logistic, x, y, p0=p0, maxfev=20000)
            yhat = logistic(x, *params)
            r2 = float(r2_score(y, yhat))
            return FitResult(
                best_fit_method="Logistic",
                best_r2_score=r2,
                best_equation=f"{params[0]} / (1 + exp(-{params[1]}*(x - {params[2]})))",
                best_coefficients=params.tolist(),
            )
        except Exception:
            return None

    def _gaussian_fit(self, x: NDArray, y: NDArray) -> Optional[FitResult]:
        try:
            p0 = [float(np.max(y)), float(np.median(x)), float(np.std(x) or 1.0)]
            params, _ = curve_fit(gaussian, x, y, p0=p0, maxfev=20000)
            yhat = gaussian(x, *params)
            r2 = float(r2_score(y, yhat))
            return FitResult(
                best_fit_method="Gaussian",
                best_r2_score=r2,
                best_equation=f"{params[0]} * exp(-((x - {params[1]})**2)/(2*{params[2]}**2))",
                best_coefficients=params.tolist(),
            )
        except Exception:
            return None

    def _exponential_fit(self, x: NDArray, y: NDArray) -> Optional[FitResult]:
        try:
            # initial guess: A ~ (y0 - y_end), B ~ small, C ~ y_end
            A0 = float(max(y) - min(y) or 1.0)
            B0 = 0.01
            C0 = float(min(y))
            params, _ = curve_fit(exponential, x, y, p0=[A0, B0, C0], maxfev=20000)
            yhat = exponential(x, *params)
            r2 = float(r2_score(y, yhat))
            return FitResult(
                best_fit_method="Exponential",
                best_r2_score=r2,
                best_equation=f"{params[0]} * exp(-{params[1]}*x) + {params[2]}",
                best_coefficients=params.tolist(),
            )
        except Exception:
            return None

    def _parabolic_fit(self, x: NDArray, y: NDArray) -> Optional[FitResult]:
        try:
            params, _ = curve_fit(quadratic, x, y, p0=[1.0, 1.0, float(np.mean(y))], maxfev=20000)
            yhat = quadratic(x, *params)
            r2 = float(r2_score(y, yhat))
            return FitResult(
                best_fit_method="Parabolic",
                best_r2_score=r2,
                best_equation=f"{params[0]}*x^2 + {params[1]}*x + {params[2]}",
                best_coefficients=params.tolist(),
            )
        except Exception:
            return None

    def curve_fitting(self, group_data: Dict[Any, List[Dict[str, Any]]], key_group: List[Any]) -> Dict[Any, FitResult]:
        results: Dict[Any, FitResult] = {}
        
        for key in key_group:
            pts = group_data[key]
            valid = []
            
            if key_group == ["npshr"]:
                for p in pts:
                    try:
                        f = float(p["flow"])
                        n = float(p["npshr"])
                        valid.append((f, n))
                    except Exception:
                        continue
                if not valid:
                    continue

                x = np.array([f for f, _ in valid], dtype=float)
                y = np.array([n for _, n in valid], dtype=float)
            else:
                for p in pts:
                    try:
                        f = float(p["flow"])
                        h = float(p["head"])
                        valid.append((f, h))
                    except Exception:
                        continue
                if not valid:
                    continue
                
                x = np.array([f for f, _ in valid], dtype=float)
                y = np.array([h for _, h in valid], dtype=float)
            
            # Try families in order
            trials: List[Optional[FitResult]] = []
            trials.append(self._poly_fit_family(x, y, reverse=False, degs=range(1, 4)))
            if (not trials[-1]) or trials[-1].best_r2_score < 0.999:
                trials.append(self._poly_fit_family(x, y, reverse=False, degs=range(3, 7)))
            #if (not trials[-1]) or trials[-1].best_r2_score < 0.9:
            #    trials.append(self._poly_fit_family(x, y, reverse=True, degs=range(1, 4)))
            #if (not trials[-1]) or trials[-1].best_r2_score < 0.9:
            #    trials.append(self._poly_fit_family(x, y, reverse=True, degs=range(4, 7)))
            #if (not trials[-1]) or trials[-1].best_r2_score < 0.9:
            #    trials.append(self._logistic_fit(x, y))
            #if (not trials[-1]) or trials[-1].best_r2_score < 0.9:
            #    trials.append(self._gaussian_fit(x, y))
            #if (not trials[-1]) or trials[-1].best_r2_score < 0.9:
            #    trials.append(self._exponential_fit(x, y))
            #if (not trials[-1]) or trials[-1].best_r2_score < 0.9:
            #    trials.append(self._parabolic_fit(x, y))

            # choose best
            best = None
            for t in trials:
                if t is None:
                    continue
                if (best is None) or (t.best_r2_score > best.best_r2_score):
                    best = t
            if best is None:
                return "best fit not found"
                continue
             
            # attach limits
            best.flow_limit = self.get_min_max_flow(group_data, key)
            best.head_limit = self.get_min_max_head(group_data, key)
            results[key] = best
        return results

    def interpolate(self, target: float, upper: str, lower: str, group: str) -> List[Dict[str, float]]:
        #print(f"Interpolate target={target}, upper={upper}, lower={lower}, group={group}")
        data_group = self.imp_grouped if group == "imp" else self.eff_grouped

        lower_pts = sorted(data_group[lower], key=lambda p: float(p["flow"]))
        upper_pts = sorted(data_group[upper], key=lambda p: float(p["flow"]))

       
        n = min(len(lower_pts), len(upper_pts))
        lower_pts, upper_pts = lower_pts[:n], upper_pts[:n]
        out = []
        for (lower_pt), (upper_pt) in zip(lower_pts, upper_pts):
            f_low = float(lower_pt['flow']); h_low = float(lower_pt['head'])
            f_up = float(upper_pt['flow']); h_up = float(upper_pt['head'])
            lower = float(lower); upper = float(upper)

            f_interp = 0.5 * (f_low + f_up)
            h_interp = h_low + (h_up - h_low) * (target - lower) / (upper - lower)
            out.append({"flow": round(f_interp,4), "head": round(h_interp, 4)})

        return out
    
    def interpolate_from_curve(self, data_points, y_target, group_name):
        # Step 1: Find the closest two points to the given y_target
        # Sort the points based on the y-values
        
        closest_points = []
        distances = 10
        for point in data_points:
            try:
                if abs(point[group_name] - y_target) < distances:
                    data = point
                    distances = abs(point[group_name] - y_target)
                    data["distance"] = distances
                    closest_points.append(data)
            except Exception:
                continue
        
        sorted_points = sorted(closest_points, key=lambda p: p["distance"])
        #print(sorted_points)
        # Get the closest two points
        if group_name == "head":
            x_lower = float(sorted_points[0]["flow"])
            x_upper = float(sorted_points[1]["flow"])
            y_lower = float(sorted_points[0]["head"])
            y_upper = float(sorted_points[1]["head"])
        else:
            x_lower = float(sorted_points[0]["head"])
            x_upper = float(sorted_points[1]["head"])
            y_lower = float(sorted_points[0]["flow"])
            y_upper = float(sorted_points[1]["flow"])
        
        
        # Interpolation formula
        x_target = x_lower + (y_target - y_lower) * (x_upper - x_lower) / (y_upper - y_lower)
        return x_target

    def _predict_head_or_flow(self, method: str, coeffs: List[float], flow: float, head: float) -> Tuple[Optional[float], Optional[float]]:
        """Return (head_pred, flow_pred) depending on method."""
        if method == "Polynomial":
            m = np.poly1d(coeffs)
            return float(m(flow)), None
        if method == "Polynomial (Reverse)":
            m = np.poly1d(coeffs)
            return None, float(m(head))
        if method == "Logistic":
            A, k, x0 = coeffs
            return float(logistic(flow, A, k, x0)), None
        if method == "Gaussian":
            A, mu, sigma = coeffs
            return float(gaussian(flow, A, mu, sigma)), None
        if method == "Exponential":
            A, B, C = coeffs
            return float(exponential(flow, A, B, C)), None
        if method == "Parabolic":
            a, b, c = coeffs
            return float(quadratic(flow, a, b, c)), None
        return None, None

    def intersection(self, secondary_keys: List[Any], secondary_data : List[Dict[str, float]], main_key: str, main_fits: Dict[Any, FitResult]) -> Dict[str, List[Dict[str, float]]]:
        #return {"desire_fit": {k: v.to_dict() for k, v in main_fits.items()}}
        
        tolerance = 0.5
        used = set()
        grouped: Dict[str, List[Dict[str, float]]] = {}

        fit = main_fits.get(main_key)

        # Loop through each efficiency curve key (secondary fits)
        for key in secondary_keys:
            
            # Get flow and head limits from the efficiency curve fit
            flims = fit.flow_limit
            hlims = fit.head_limit
            fmin = flims.get("min_flow_limit")
            fmax = flims.get("max_flow_limit")
            hmin = hlims.get("min_head_limit")
            hmax = hlims.get("max_head_limit")
    

            # Loop through each point in the efficiency curve (secondary curve)
            for pt in secondary_data[key]:
                flow = float(pt["flow"])
                head = float(pt["head"])
                k = (round(flow, 4), round(head, 4))
                if k in used:
                    continue

                # Skip points that are outside the flow and head limits
                if not (fmin <= flow <= fmax and hmin <= head <= hmax):
                    continue

                coeffs = main_fits[main_key].best_coefficients  # Get the main curve's coefficients (polynomial)
                model_poly = np.poly1d(coeffs)  # Create the polynomial model from the coefficients
                
                # Get the predicted head using the desired impeller curve equation (using flow from the eff curve)
                predicted_head = model_poly(flow)  # Predict the head from the main curve (desired impeller curve)

                # Check if the predicted head is within tolerance of the actual head from the efficiency curve
                if abs(head - predicted_head) <= tolerance:
                    # Accept this point as an intersection
                    grouped.setdefault(str(key), []).append({
                        "flow": round(flow, 3),
                        "head": round(head, 3),
                        "eff": str(key),
                        "method": fit.best_fit_method or "",
                        "r2": fit.best_r2_score,
                    })
                    used.add(k)

        # Group the intersections by efficiency (eff)
        final: Dict[str, List[Dict[str, float]]] = {}
        for label, pts in grouped.items():
            pts_sorted = sorted(pts, key=lambda p: p["flow"])
            clusters: List[List[Dict[str, float]]] = []
            cur = [pts_sorted[0]]
            for a, b in zip(pts_sorted, pts_sorted[1:]):
                if abs(b["flow"] - a["flow"]) > 10.0:
                    clusters.append(cur)
                    cur = [b]
                else:
                    cur.append(b)
            if cur:
                clusters.append(cur)
    
            chosen = []
            for cl in clusters:
                if len(cl) == 1:
                    chosen.append(cl[0])
                else:
                    avgf = sum(p["flow"] for p in cl) / len(cl)
                    best = min(cl, key=lambda p: abs(p["flow"] - avgf))
                    chosen.append(best)
            final[label] = chosen
    
        return final

    # ---------- efficiency estimate at arbitrary (Q,H) ----------
    def estimate_eff(self, flow: float, head: float) -> Optional[float]:
        
        """Try 2D interpolation; fallback to distance-to-curves interpolation."""
        # 1) 2D interpolation on scatter
        if self.efficiency_curve_data:
            pts = np.array([(p["flow"], p["head"]) for p in self.efficiency_curve_data], dtype=float)
            vals = np.array([_eff_num(p["eff"]) for p in self.efficiency_curve_data], dtype=float)
            eff_keys = sorted(list(set(float(label.replace('%', '').replace('L', '').replace('R', '').strip()) for label in self.eff_key)))
            try:
                eff = griddata(pts, vals, (flow, head), method="linear")
    
                if eff is not None and not np.isnan(eff):
                    return float(np.clip(eff, 0.0, 100.0))

                # FALLBACK (Out of Bounds)
                nearest_eff = griddata(pts, vals, (flow, head), method="nearest")

                if nearest_eff is not None and not np.isnan(nearest_eff):
                    # Snap the messy 'nearest' result to one of our clean levels
                    current_level = min(eff_keys, key=lambda x: abs(x - nearest_eff))
                    idx = eff_keys.index(current_level)
                    if idx == 0:
                        return float(np.clip(nearest_eff, 0.0, 100.0))
                    else:
                        # Step down 1 level
                        return float(eff_keys[max(0, idx - 1)])
            except Exception:
                pass
                
        # 2) distance to efficiency curves (Same as nearest method from above)
        #candidates = []
        #for label, fit in self.eff_fits.items():
        #    flims = fit.flow_limit or {}
        #    hlims = fit.head_limit or {}
        #    if not (flims.get("min_flow_limit", -np.inf) <= flow <= flims.get("max_flow_limit", np.inf)):
        #        continue
        #    if not (hlims.get("min_head_limit", -np.inf) <= head <= hlims.get("max_head_limit", np.inf)):
        #        continue
        #    hpred, fpred = self._predict_head_or_flow(fit.best_fit_method, fit.best_coefficients, flow, head)
        #    if fpred is not None:
        #        d = abs(flow - fpred)  # compare in flow domain for reverse models
        #    elif hpred is not None:
        #        d = abs(head - hpred)
        #    else:
        #        continue
        #    candidates.append((_eff_num(str(label)), d, label))
#
        #if not candidates:
        #    return None
        ## pick two closest and inverse-distance interpolate efficiencies
        #print(f"candidates: {candidates}")
        #candidates.sort(key=lambda t: t[1])
        #e1, d1, _ = candidates[0]
        #if len(candidates) == 1 or d1 == 0:
        #    return float(e1)
        #e2, d2, _ = candidates[1]
        #w1 = 1.0 / max(d1, 1e-6); w2 = 1.0 / max(d2, 1e-6)
        #est = (e1 * w1 + e2 * w2) / (w1 + w2)
        #return float(np.clip(est, 0.0, 100.0))

    def pressure_unit_to_bar(self, pressure: float, unit: str) -> Optional[float]:
        try:
            if unit != "bar" :
                if unit == "Pa":
                    unit_conv = float(model_to_dict(self.FindUnitConversion("unit_pressure", "bar"))['data_value2'])
                else:
                    not_pa_unit_conv = float(model_to_dict(self.FindUnitConversion("unit_pressure", unit))['data_value2'])
                    bar_unit_conv = float(model_to_dict(self.FindUnitConversion("unit_pressure", "bar"))['data_value2'])
                    unit_conv =  bar_unit_conv / not_pa_unit_conv
            else:                                                       
                unit_conv = 1
            return pressure * unit_conv
        except Exception:
            return None
    
    # ---------- Main: end-to-end calculation ----------
    def curve_cal(self, use_test: bool = False):
        # 0) Inputs & units
        if use_test:
            # Test 1
            # impeller_dia = 197
            # model = "KDIN 150-20"
            # speed = "1450"
            # model_input = f"{model}  {speed}RPM"
            # media_density = 998.0  # kg/m3
            # operation_flow = 225.0  # m3/h
            # operation_head = 11.3   # m
            
            # Test 2
            impeller_dia = 255
            model = "KDIN 200-32"
            speed = "1450"
            model_input = f"{model}  {speed}RPM"
            media_density = 998.0  # kg/m3
            operation_flow = 635.0  # m3/h
            operation_head = 11.5   # m
        else:
            impeller_dia = int(self.pump_data["design_impeller_dia"])
            model = self.pump_data["pump_model"]
            speed = self.pump_data["pump_speed"]
            model_input = f"{model}  {speed}RPM"
            
            # conversions
            fc = self.FindUnitConversion("unit_flow", self.pump_data["design_flow_unit"])
            hc = self.FindUnitConversion("unit_head", self.pump_data["design_head_unit"])
            dc = self.FindUnitStandardConversion("unit_density", self.pump_data["media_density_unit"], "kg/m3")
            if not (fc and hc and dc):
                return {"error": "Missing unit conversion configuration."}

            fc = float(model_to_dict(fc)["data_value2"])
            hc = float(model_to_dict(hc)["data_value2"])
            media_density = float(self.pump_data["media_density"]) * dc
            operation_flow = float(self.pump_data["design_flow"]) * fc
            operation_head = float(self.pump_data["design_head"]) * hc

        # 1) Load data for the model
        qs = FactoryCurve.objects.filter(model=model_input)
        self.data = [model_to_dict(o) for o in qs]
        if not self.data:
            return {"error": f"Factory curve not found for model: {model_input}"}
            
        # 2) Group by impeller dia & efficiency & npshr
        for item in self.data:
            flow  = item.get("flow")
            head  = item.get("head")
            npshr = item.get("npshr")
            imp   = item.get("imp_dia")
            eff   = item.get("eff_rl")

            # --- 1) NPSHr grouping (allow head to be None) ---
            if flow is not None and npshr is not None:
                try:
                    f_npshr  = float(flow)
                    npshr_v  = float(npshr)
                    self.npshr_grouped.setdefault("npshr", []).append(
                        {"flow": f_npshr, "npshr": npshr_v}
                    )
                except (TypeError, ValueError):
                    # Bad row for NPSHr; skip just this part
                    pass
                
            # --- 2) Guard: imp/eff need both flow and head ---
            if flow is None or head is None:
                continue
            try:
                f = float(flow)
                h = float(head)
            except (TypeError, ValueError):
                continue
            
            # --- 3) Impeller-grouped points ---
            if imp is not None:
                imp_key = str(imp).strip()
                if imp_key and imp_key.lower() != "none":
                    self.imp_grouped.setdefault(imp_key, []).append({"flow": f, "head": h})

            # --- 4) Efficiency “label”-grouped points ---
            if eff is not None:
                eff_label = str(eff).strip()
                if eff_label and eff_label.lower() != "none":
                    self.eff_grouped.setdefault(eff_label, []).append(
                        {"flow": f, "head": h, "eff": eff_label}
                    )
            
        if not self.imp_grouped or not self.eff_grouped:
            return {"error": "Insufficient data for grouping."}
        
        self.imp_key = sorted([key for key in self.imp_grouped.keys() if key != ""])
        self.eff_key = self.eff_grouped.keys()
        
        # scatter list for interpolation
        for label in self.eff_key:
            for p in self.eff_grouped[label]:
                self.efficiency_curve_data.append({"flow": p["flow"], "head": p["head"], "eff": label})

        # 3) Fit curves (imp & eff)
        self.imp_fits = self.curve_fitting(self.imp_grouped, self.imp_key)
        #self.eff_fits = self.curve_fitting(self.eff_grouped, self.eff_key)
        self.npshr_fits = self.curve_fitting(self.npshr_grouped, ["npshr"])

        #debug
        # return {"imp_fits": {k: v.to_dict() for k, v in self.imp_fits.items()}}
        # return {"eff_fits": {k: v.to_dict() for k, v in self.eff_fits.items()}}
        
        # 4) Desired impeller curve
        impeller_dia_str = f"{impeller_dia}.00"
        if impeller_dia_str in self.imp_fits:
            
            imp_data = {}
            imp_data[impeller_dia_str] = self.imp_grouped[impeller_dia_str]
            self.imp_desire_fit = self.curve_fitting(imp_data, [impeller_dia_str])
            self.desire_imp_curve_data = [{"flow": round(float(p["flow"]),4), "head": round(float(p["head"]),4), "imp_dia": impeller_dia_str} for p in self.imp_grouped[impeller_dia_str]]
            
            x = np.array([float(p["flow"]) for p in self.imp_grouped[impeller_dia_str]])
            y= np.array([float(p["head"]) for p in self.imp_grouped[impeller_dia_str]])
            coeffs = np.polyfit(x, y, 3)
            m = np.poly1d(coeffs)
            fit = FitResult("Polynomial", float(r2_score(y, m(x))), str(m).replace("\n"," "), coeffs.tolist())
            fit.flow_limit = {"min_flow_limit": float(min(x)), "max_flow_limit": float(max(x))}
            fit.head_limit = {"min_head_limit": float(min(y)), "max_head_limit": float(max(y))}
            self.desired_imp_fit = fit
            
        else:
            #interpolate between nearest diams and fit a poly3
            #lower = max([float(d) for d in self.imp_key if float(d) <= impeller_dia_str], default=min(self.imp_key))
            #upper = min([float(d) for d in self.imp_key if float(d) >= impeller_dia_str], default=max(self.imp_key))
            #pairs = self.interpolate(impeller_dia_str, upper, lower, "imp")
            
            pairs = {}
 
            lower = max([d for d in self.imp_key if float(d) <= impeller_dia], default=min(self.imp_key))
            upper = min([d for d in self.imp_key if float(d) >= impeller_dia], default=max(self.imp_key))
            
            pairs[impeller_dia_str] = self.interpolate(impeller_dia, upper, lower, "imp")

            self.imp_desire_fit = self.curve_fitting(pairs, [impeller_dia_str])
            #debug
            #return {"desire_fit": {k: v.to_dict() for k, v in desire_fit.items()}}
        
            x = np.array([p["flow"] for p in pairs[impeller_dia_str]]); y = np.array([p["head"] for p in pairs[impeller_dia_str]])
            coeffs = np.polyfit(x, y, 3)
            m = np.poly1d(coeffs)
            fit = FitResult("Polynomial", float(r2_score(y, m(x))), str(m).replace("\n"," "), coeffs.tolist())
            fit.flow_limit = {"min_flow_limit": float(min(x)), "max_flow_limit": float(max(x))}
            fit.head_limit = {"min_head_limit": float(min(y)), "max_head_limit": float(max(y))}
            self.desired_imp_fit = fit

            qmin = fit.flow_limit["min_flow_limit"]; qmax = fit.flow_limit["max_flow_limit"]
            q = np.linspace(qmin, qmax, 500); h = m(q)
            self.desire_imp_curve_data = [{"flow": round(float(f),4), "head": round(float(hh),4), "imp_dia": f"{impeller_dia}"} for f, hh in zip(q, h)]

        #Old method for finding BEP change to new method
        # 5) Intersections with efficiency curves
        #self.intersections = self.intersection(self.eff_key,self.eff_grouped,impeller_dia_str, self.imp_desire_fit)
        
        # 6) BEP determination
        #if not self.intersections:
        #    return {"error": "No intersections found with efficiency curves."}

        #eff_labels = list(self.intersections.keys())
        #bep_label = max(eff_labels, key=lambda s: _eff_num(s))
        #bep_candidates = self.intersections[bep_label]
        
        #if len(bep_candidates) == 1:
        #    bep_pt = bep_candidates[0]
        #else:
        #    # choose midpoint by flow of two best
        #    pts_sorted = sorted(bep_candidates, key=lambda p: p["flow"])
        #    f1, h1 = pts_sorted[0]["flow"], pts_sorted[0]["head"]
        #    f2, h2 = pts_sorted[1]["flow"], pts_sorted[1]["head"]
        #    f_mid = 0.5 * (f1 + f2)
        #    # project onto desired curve
        #    coeffs = self.desired_imp_fit.best_coefficients
        #    if self.desired_imp_fit.best_fit_method in ("Polynomial", "Parabolic"):
        #        m = np.poly1d(coeffs); h_mid = float(m(f_mid))
        #    else:
        #        # use nearest point in dense curve
        #        idx = int(np.argmin([abs(p["flow"] - f_mid) for p in self.desire_imp_curve_data]))
        #        h_mid = float(self.desire_imp_curve_data[idx]["head"])
        #    bep_pt = {"flow": round(float(f_mid), 3), "head": round(float(h_mid), 3), "eff": bep_label}

        # 6) BEP determination
        bep_eff = 0.0
        bep_pt = None
        
        for point in self.desire_imp_curve_data:
            flow = float(point["flow"])
            head = float(point["head"])
            eff = self.estimate_eff(flow, head)

            if eff is not None and eff > bep_eff:
                bep_eff = eff
                bep_pt = {
                    "flow": round(float(flow), 4),
                    "head": round(float(head), 4),
                    "eff": round(bep_eff,2)
                }


        # 7) Min/Max/Operation points and efficiencies
        f_bep = float(bep_pt["flow"])
        f_min = 0.3 * f_bep
        f_max = 1.1 * f_bep

        # head from desired curve polynomial
        coeffs = self.desired_imp_fit.best_coefficients
        method = self.desired_imp_fit.best_fit_method or "Polynomial"
        if method in ("Polynomial", "Parabolic"):
            m = np.poly1d(coeffs)
            h_min = float(m(f_min)); h_max = float(m(f_max))
        else:
            # fallback via dense list
            def head_at(qt):
                idx = int(np.argmin([abs(p["flow"] - qt) for p in self.desire_imp_curve_data]))
                return float(self.desire_imp_curve_data[idx]["head"])
            h_min, h_max = head_at(f_min), head_at(f_max)

        h_op = None
        if method in ("Polynomial", "Parabolic"):
            h_op = float(np.poly1d(coeffs)(operation_flow))
        else:
            idx = int(np.argmin([abs(p["flow"] - operation_flow) for p in self.desire_imp_curve_data]))
            h_op = float(self.desire_imp_curve_data[idx]["head"])

        # efficiencies
        eff_min = self.estimate_eff(f_min, h_min)
        eff_max = self.estimate_eff(f_max, h_max)
        eff_op = self.estimate_eff(operation_flow, h_op)
        eff_bep = bep_pt["eff"]

        min_flow_point = {"point_flow": round(f_min, 4), "point_head": round(h_min, 4), "point_label": f"Min Flow {round(eff_min,2) or '??'}%", "eff": round(eff_min,2)}
        max_flow_point = {"point_flow": round(f_max, 4), "point_head": round(h_max, 4), "point_label": f"Max Flow {round(eff_max,2) or '??'}%", "eff": round(eff_max,2)}
        operation_point = {"point_flow": round(operation_flow, 4), "point_head": round(h_op, 4), "point_label": f"Operation {round(eff_op,2) or '??'}%", "eff": round(eff_op,2)}
        bep_point = {"point_flow": round(bep_pt["flow"], 4), "point_head": round(bep_pt["head"], 4), "point_label": f"BEP {round(eff_bep,2)}%", "eff": round(eff_bep,2)}

        # 8) Power (kW)
        def hydraulic_kw(q_m3h: float, h_m: float) -> float:
            # rho*g*(Q/3600)*H / 1000
            return float(media_density * G * (q_m3h / 3600.0) * h_m / 1000.0)

        def brake_kw(q_m3h: float, h_m: float, eta_pct: Optional[float]) -> Optional[float]:
            if not eta_pct or eta_pct <= 0.0:
                return None
            return hydraulic_kw(q_m3h, h_m) / (eta_pct / 100.0)

        hydraulic_power_kW = hydraulic_kw(operation_flow, h_op)
        power_min_flow_kW = brake_kw(f_min, h_min, eff_min)
        power_max_flow_kW = brake_kw(f_max, h_max, eff_max)
        power_bep_kW      = brake_kw(float(bep_pt["flow"]), float(bep_pt["head"]), eff_bep)
        power_required_cal_kW = brake_kw(operation_flow, h_op, eff_op)

        # 9) Shut-off head (H at Q=0)
        if method in ("Polynomial", "Parabolic"):
            shut_off_head = float(np.poly1d(coeffs)(0.0))
        else:
            # choose min-flow near 0
            shut_off_head = float(min(p["head"] for p in self.desire_imp_curve_data))

        # 10) NPSHr fit & eval at operation
        nps_points = []
        for d in self.data:
            n = d.get("npshr"); f = d.get("flow")
            try:
                if n is not None and f is not None:
                    nps_points.append((float(f), float(n)))
            except Exception:
                pass
        npshr_val = None
        if nps_points:
            X = np.array([p[0] for p in nps_points]); Y = np.array([p[1] for p in nps_points])
            try:
                c = np.polyfit(X, Y, 3); m = np.poly1d(c)
                npshr_val = float(m(operation_flow))
            except Exception:
                try:
                    c = np.polyfit(X, Y, 2); m = np.poly1d(c)
                    npshr_val = float(m(operation_flow))
                except Exception:
                    npshr_val = float(np.interp(operation_flow, X, Y))

        # 11) Units
        units = {"unit_flow": "m3/h", "unit_power": "kW", "unit_head": "m", "unit_npshr": "m", "unit_eff": "%"}
        
        #new_eff_data = []
#
        #for p in self.efficiency_curve_data:
        #    new_eff_data.append({
        #        "flow": round(p["flow"],4),
        #        "head": round(p["head"],4),
        #        "eff": p["eff"],
        #    })

        # 12) Package result
        result = {
            "desire_imp_curve_data": self.desire_imp_curve_data,
            "desire_imp_curve_fit" : {
                "method": self.desired_imp_fit.best_fit_method if self.desired_imp_fit else None,
                "coefficients": self.desired_imp_fit.best_coefficients if self.desired_imp_fit else None,
                "r2": self.desired_imp_fit.best_r2_score if self.desired_imp_fit else None
                },
            "efficiency_curve_data":  self.efficiency_curve_data,
            "npshr_curve_data": self.npshr_grouped,
            "npshr_curve_fit": {
                "method": self.npshr_fits["npshr"].best_fit_method if "npshr" in self.npshr_fits else None,
                "coefficients": self.npshr_fits["npshr"].best_coefficients if "npshr" in self.npshr_fits else None,
                "r2": self.npshr_fits["npshr"].best_r2_score if "npshr" in self.npshr_fits else None
            },
            "bep_point": bep_point,
            "min_flow_point": min_flow_point,
            "max_flow_point": max_flow_point,
            "operation_point": operation_point,
            "operation_media": {"density" : self.pump_data.get("media_density"), "media_density_unit": self.pump_data.get("media_density_unit")},
            "hydraulic_power_kW": hydraulic_power_kW,
            "power_min_flow_kW": power_min_flow_kW,
            "power_max_flow_kW": power_max_flow_kW,
            "power_bep_kW": power_bep_kW,
            "power_required_cal_kW": power_required_cal_kW,
            "shut_off_head": shut_off_head,
            "npshr": npshr_val,
            "units": units,
        }
        return result
    
    def flow_within_30_100_BEP(self, flow, head, opeData):
        try:
            #Check whether flow is over or under 30% to 100% BEP
            if flow < opeData["min_flow_point"]["point_flow"]:
                #Flow lower than 30 percent BEP
                return f"Flow lower than 30 percent BEP : Cavitation Caution (Y/N) / เช็คระยะ line  ท่อ"
            elif flow > opeData["max_flow_point"]["point_flow"]:
                #Flow over than 110 percent BEP
                return f"Flow over than 110 percent BEP : ตก Curve (หลี่ Valve)"
            elif flow >= opeData["min_flow_point"]["point_flow"] and flow <= opeData["max_flow_point"]["point_flow"]:
                #Flow between 30% and 100% of BEP
                opr_point = {"flow": round(flow,4), "head": round(head,4)}
                opr_eff = self.estimate_eff(opr_point["flow"], opr_point["head"])
                opr_point["eff"] = round(opr_eff,2) if opr_eff else None
                
                
                min_flow = float(opeData["min_flow_point"]["point_flow"])
                max_flow = float(opeData["max_flow_point"]["point_flow"])
                min_eff = float(opeData["min_flow_point"]["eff"])
                max_eff = float(opeData["max_flow_point"]["eff"])
                eff_bep_percentage = round(min_eff + (max_eff - min_eff) * (opr_point["flow"] - min_flow) / (max_flow - min_flow),1)
                
                return f"Flow between 30 and 110 percent BEP : With in Normal Length at  {eff_bep_percentage}% of BEP"
            else:
                return "Error : Cannot determine flow condition"
            
        except:
            return False

    def suction_preassure_check(self,flow,media_density, opeData):
        try:
            vapor_pressure = float(opeData.get("vapor_pressure"))
            vapor_pressure_unit = opeData.get("vapor_pressure_unit")
            vapor_pressure = self.pressure_unit_to_bar(vapor_pressure, vapor_pressure_unit)
            suction_pres_ope = float(opeData.get("suction_pres_ope"))
            suction_pres_ope_unit = opeData.get("suction_pres_ope_unit")
            coeffs = opeData.get("npshr_curve_fit")["coefficients"] 
            
            suction_pres_ope_bar = self.pressure_unit_to_bar(suction_pres_ope, suction_pres_ope_unit)
            npsha_ope = suction_pres_ope_bar * 10 / media_density
            npshr_ope = float(np.poly1d(coeffs)(flow))
            if (npshr_ope + 0.5 + vapor_pressure) > npsha_ope:
                return "Witin normal range"
            elif (npshr_ope + 0.5 + vapor_pressure) < npsha_ope:
                return "Warning : Cavitation Caution (Y/N) / เช็คทางดูด (Strainer) / เช็คระยะ line  ท่อ / ระดับน้ำของถัง / Pressure ของถังปิด / ขนาดท่อ"
            else:
                return "Error : Cannot determine suction preassure condition"
            
        except Exception as e:
            return f"Error: {str(e)}"
    
    def suction_pressure_diff_check(self, flow : float, head : float, curve_data, isFlowMeasure : bool):
        try:
            #1. Check diff of flow between curve and check at head same head
            ope_point = {"flow": flow, "head": head}
            if isFlowMeasure == True:
                #Find the diff of head and flow at the same flow
                flow_curve = self.interpolate_from_curve(curve_data, head, "head")
                head_curve = self.interpolate_from_curve(curve_data, flow, "flow")
               
                if abs(flow - flow_curve) / flow_curve >= 0.05 or abs(head - head_curve) / head_curve >= 0.05:
                    return f"Warning : Flow or Head at operation condition is different from curve more than 5% : Impeller clearance adjustment / Impeller might wear"
                elif abs(flow - flow_curve) / flow_curve < 0.05 and abs(head - head_curve) / head_curve < 0.05:
                    return f"Within normal range at diff head {abs(head - head_curve) / head_curve} flow {abs(flow - flow_curve) / flow_curve}"
                else:
                    return "Error : Cannot determine suction pressure diff condition"
            else:
                #Find the diff of head at the same flow
                head_curve = self.interpolate_from_curve(curve_data, flow, "flow")
                if abs(head - head_curve) / head_curve >= 0.05:
                    return f"Warning : Head at operation condition is different from curve more than 5% : Impeller clearance adjustment / Impeller might wear"
                elif abs(head - head_curve) / head_curve < 0.05:
                    return f"Within normal range at diff {abs(head - head_curve) / head_curve}"
                else:
                    return "Error : Cannot determine suction pressure diff condition"
        
        except Exception as e:
            return f"Error : {str(e)}"
    
    def power_check_iso9906(self, flow, head,media_density, opeData):
        try:
            power = float(opeData.get("hydraulic_power_kW"))
            cal = (flow * head * media_density * 9.81 * 1.05 ) / 3600
            
            #print({f"{flow} * {head} * {media_density} * 9.81 * 1.05 ) / 3600  = {cal}" : f"{power} < {cal}"})
            if  power <= cal:
                return f"Witnin normal range"
            elif power > cal:
                return f"More than 5 percent from curve : Impeller clearance adjustment / Impeller might wear"
            else:
                return "Error : Cannot determine power condition"
            
        except Exception as e:
            return f"Error: {str(e)}"
    
    def fluid_temp_check(self, ope_temp , max_temp):
        try:
            if ope_temp > max_temp:
                return f"CAUTION : The over specification on fluid temperature, Cavitation Caution (Y/N)"
            elif ope_temp <= max_temp:
                return f"Within Normal Temperature Limit, Cavitation Caution (Y/N)"
            else:
                return "Error Fluid Temp. Check : Cannot determine fluid temp condition"
        except Exception as e:
            return f"Error Fluid Temp. Check : {str(e)}"
    
    def bearing_housing_temp_check(self, temp, temp_unit , bearing_last_change_date):
        print(f"Last change date: {bearing_last_change_date}")
        try:
            # Convert temperature to standard unit if necessary
            if temp_unit != "C":
                conv_value = temp * self.FindUnitStandardConversion("unit_temperature", temp_unit, "C")
                temp = temp * conv_value
            
            
            if temp < 70:
                if bearing_last_change_date is None or bearing_last_change_date == "":
                    return "Within normal range, Suggest change with in 1 year from last bearing change date."
                else:
                    dt_object = parser.parse(bearing_last_change_date)
                    return f"Within normal range, Suggest change with in 1 year before {dt_object.strftime('%d/%m/%y')}"
            else:
                if bearing_last_change_date is None or bearing_last_change_date == "":
                    return "Over normal range (70 C), Suggest change with in 1 year from last bearing change date."
                else:
                    dt_object = parser.parse(bearing_last_change_date)
                    return f"Over normal range (70 C), Suggest change with in 1 month before {dt_object.strftime('%d/%m/%y')}"
        except Exception as e:
            return f"Error bearing temp. check: {str(e)}"
        
    def report_check_cal(self, opeData):
        try:
            diff_pres_ope = float(opeData.get("diff_pres_ope"))
            diff_pres_ope_unit = opeData.get("diff_pres_ope_unit")
            curve_data = opeData.get("desire_imp_curve_data")
            bearing_housing_temp = float(opeData.get("bearing_housing_temp"))
            bearing_housing_temp_unit = opeData.get("bearing_housing_temp_unit")
            diff_pres_ope = self.pressure_unit_to_bar(diff_pres_ope, diff_pres_ope_unit)
            media_density = float(opeData.get("media_density"))
            media_density_unit = opeData.get("media_density_unit")
            media_density_unit_conv = self.FindUnitStandardConversion("unit_density", media_density_unit, "sg")
            head = (diff_pres_ope * 10) / (media_density * media_density_unit_conv)
            if opeData["flow_ope"] is not None or opeData["flow_ope"] == 0 or opeData["flow_ope"] == "":
            #Flow can measure
                #Find point at operation condition
                flow = float(opeData["flow_ope"])
                if opeData["flow_ope_unit"] != "m3/h":
                    unit_conv = self.FindUnitStandardConversion("unit_flow", opeData["flow_ope_unit"], "m3/h")
                else: 
                    unit_conv = 1
                    
                flow = flow * unit_conv
                
                #1. Check whether diff pressure at the current flow amd head is no more than 5% from curve
                suction_pressure_diff_check = self.suction_pressure_diff_check(flow, head,opeData.get("desire_imp_curve_data"), True)    
            else:
            #Flow cannot measure
                #Fit curve to find flow at operation condition
                flow = self.interpolate_from_curve(curve_data, head, "head")
                
                #1. Check whether diff pressure at the current flow amd head is no more than 5% from curve
                suction_pressure_diff_check = self.suction_pressure_diff_check(float(opeData.get("design_operation_point")["point_flow"]), head ,opeData.get("desire_imp_curve_data"), False)
            
            #return opeData
            #2. Check whether flow is over or under 30% to 100% BEP    
            eff_check = self.flow_within_30_100_BEP(flow, head, opeData)
            
            #3. Check whether suction preassure is over NPSHr at operation condition
            suction_pressure_check = self.suction_preassure_check(flow, media_density * media_density_unit_conv , opeData)
            
            #4. Check whether power of pump on ISO 9906:2012
            power_check = self.power_check_iso9906(flow, head, media_density * media_density_unit_conv, opeData)
            
            bearing_housing_temp_check = self.bearing_housing_temp_check(bearing_housing_temp, bearing_housing_temp_unit, opeData.get("bearing_last_chg_dt"))
            
            result = {
                "range_30_110_result": eff_check,
                "npshr_npsha_result": suction_pressure_check,
                "pump_standard_result": suction_pressure_diff_check,
                "power_result": power_check,
                "fulid_temp_result" : "Not Implemented",
                "bearing_temp_result" : bearing_housing_temp_check
            }
            return result
        except Exception as e:
            return JsonResponse({"error 500": str(e)}, status=500)



