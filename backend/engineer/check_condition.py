import os
import requests
from django.http import JsonResponse
from factory_curve.schema.factory_curve import CalPumpPayload_schema
from engineer.schema.engineer import EngineerReportCheckPayload_schema
from pump_data.models import KMonitoringLOV
from django.forms.models import model_to_dict
from scipy.optimize import curve_fit
from scipy.interpolate import griddata
import numpy as np
from sklearn.metrics import r2_score
from dataclasses import dataclass
from typing import Optional, List, Dict, Any, Tuple
from numpy.typing import NDArray
from dateutil import parser
from dateutil.relativedelta import relativedelta


G = 9.80665  # m/s²

PEC_API_URL = os.getenv("PEC_API_URL", "https://www.pecsystem.net")


def fetch_pec_curve_data(model_input: str) -> Optional[List[Dict[str, Any]]]:
    """Fetch factory curve rows for a model directly from the PEC system's live API."""
    try:
        models_resp = requests.get(f"{PEC_API_URL}/factory_model_api.php", timeout=15)
        models_resp.raise_for_status()
        models = models_resp.json()
    except Exception:
        return None

    match = next((m for m in models if m.get("model") == model_input), None)
    if not match or not match.get("fac_number"):
        return None

    try:
        curve_resp = requests.post(
            f"{PEC_API_URL}/factory_curve_api.php",
            data={"fac_number": match["fac_number"]},
            timeout=15,
        )
        curve_resp.raise_for_status()
        curve_data = curve_resp.json()
    except Exception:
        return None

    return curve_data or None

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
            if upper == lower:
                # Requested diameter has no real neighbor on one side (e.g. only one
                # impeller size exists, or the request falls outside the whole range) —
                # both bounds collapsed to the same curve, so there's nothing to
                # interpolate between; use that single curve's head as-is.
                h_interp = h_low
            else:
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
        eff, _ = self.estimate_eff_bounded(flow, head)
        return eff

    def estimate_eff_bounded(self, flow: float, head: float) -> Tuple[Optional[float], bool]:
        """Same as estimate_eff, but also reports whether (flow, head) fell outside
        the plotted efficiency curves (i.e. the value is extrapolated/floored, not interpolated)."""

        """Try 2D interpolation; fallback to distance-to-curves interpolation."""
        # 1) 2D interpolation on scatter
        if self.efficiency_curve_data:
            pts = np.array([(p["flow"], p["head"]) for p in self.efficiency_curve_data], dtype=float)
            vals = np.array([_eff_num(p["eff"]) for p in self.efficiency_curve_data], dtype=float)
            eff_keys = sorted(list(set(float(label.replace('%', '').replace('L', '').replace('R', '').strip()) for label in self.eff_key)))
            try:
                eff = griddata(pts, vals, (flow, head), method="linear")

                if eff is not None and not np.isnan(eff):
                    return float(np.clip(eff, 0.0, 100.0)), False

                # FALLBACK (Out of Bounds): we can no longer trust "nearest contour"
                # proximity here — a contour's branch can be missing on one side of the
                # data (e.g. the 30% line only digitized on the left), so snapping to
                # whichever labeled point happens to be spatially closest and stepping
                # down one level can land on a number with no real relationship to the
                # true efficiency. The only value we can honestly stand behind is the
                # lowest efficiency level confirmed anywhere in this pump's own curve data.
                if eff_keys:
                    return float(min(eff_keys)), True
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
        return None, False

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
            impeller_dia = float(self.pump_data["design_impeller_dia"])
            model = self.pump_data["pump_model"]
            speed = self.pump_data["pump_speed"]
            model_input = f"{model}  {speed}RPM"
            
            # conversions — always convert TO this engine's internal working units
            # (m3/h for flow, m for head), not a raw multiply by the selected
            # unit's own LOV factor: that only happens to work when the selected
            # unit already IS the standard one (factor 1), and silently gives the
            # wrong value for any other unit (e.g. l/s, ft).
            try:
                fc = self.FindUnitStandardConversion("unit_flow", self.pump_data["design_flow_unit"], "m3/h")
                hc = self.FindUnitStandardConversion("unit_head", self.pump_data["design_head_unit"], "m")
                dc = self.FindUnitStandardConversion("unit_density", self.pump_data["media_density_unit"], "kg/m3")
            except Exception:
                return {"error": "Missing unit conversion configuration."}

            media_density = float(self.pump_data["media_density"]) * dc
            operation_flow = float(self.pump_data["design_flow"]) * fc
            operation_head = float(self.pump_data["design_head"]) * hc

        # 1) Load data for the model from the PEC system (live source of truth)
        self.data = fetch_pec_curve_data(model_input)
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
                    # se_quence is PEC's own digitization order along the contour —
                    # these points aren't tagged with an impeller diameter, and a
                    # single %-label can trace a path that loops back on itself
                    # (e.g. up one side of the family, down the other), so sorting
                    # by flow or head alone breaks the line into a jagged zigzag.
                    # Keep this so the chart can walk the points in their real order.
                    self.eff_grouped.setdefault(eff_label, []).append(
                        {"flow": f, "head": h, "eff": eff_label, "seq": item.get("se_quence")}
                    )
            
        if not self.imp_grouped or not self.eff_grouped:
            return {"error": "Insufficient data for grouping."}
        
        self.imp_key = sorted([key for key in self.imp_grouped.keys() if key != ""])

        # 2b) Sanity-check the requested impeller diameter BEFORE building any curve for
        # it. self.imp_key holds the pump's real, available sizes as strings — comparing
        # them with plain min()/max() sorts lexicographically and can silently pick the
        # wrong bound (e.g. "100.00" < "90.00"), so compare as floats instead. A diameter
        # between two real sizes is fine (interpolated below); only reject when it falls
        # outside the whole range this pump actually has data for.
        available_dias = sorted(float(d) for d in self.imp_key)
        if impeller_dia < available_dias[0] or impeller_dia > available_dias[-1]:
            dia_list = ", ".join(f"{d:g}" for d in available_dias)
            return {
                "error": (
                    f"Impeller diameter {impeller_dia:g}mm is not available for this pump model. "
                    f"Available sizes: {dia_list}mm."
                )
            }

        self.eff_key = self.eff_grouped.keys()
        
        # scatter list for interpolation
        for label in self.eff_key:
            for p in self.eff_grouped[label]:
                self.efficiency_curve_data.append({"flow": p["flow"], "head": p["head"], "eff": label, "seq": p.get("seq")})

        # 3) Fit curves (imp & eff)
        self.imp_fits = self.curve_fitting(self.imp_grouped, self.imp_key)
        #self.eff_fits = self.curve_fitting(self.eff_grouped, self.eff_key)
        self.npshr_fits = self.curve_fitting(self.npshr_grouped, ["npshr"])

        #debug
        # return {"imp_fits": {k: v.to_dict() for k, v in self.imp_fits.items()}}
        # return {"eff_fits": {k: v.to_dict() for k, v in self.eff_fits.items()}}
        
        # 4) Desired impeller curve
        impeller_dia_str = f"{impeller_dia:.2f}"
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
 
            lower = max([d for d in self.imp_key if float(d) <= impeller_dia], key=float, default=self.imp_key[0])
            upper = min([d for d in self.imp_key if float(d) >= impeller_dia], key=float, default=self.imp_key[-1])
            
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

        # 4b) Sanity-check the requested operating point BEFORE extrapolating anything.
        # Head/power/NPSHr below are computed by evaluating a polynomial fit to the pump's
        # real curve data at the requested flow — outside the flow range that fit was built
        # from, the polynomial diverges and produces physically impossible numbers (e.g.
        # negative head). Catch that here instead of surfacing garbage results.
        flow_limit = self.desired_imp_fit.flow_limit if self.desired_imp_fit else None
        if flow_limit:
            min_flow_limit = flow_limit["min_flow_limit"]
            max_flow_limit = flow_limit["max_flow_limit"]
            if operation_flow < min_flow_limit or operation_flow > max_flow_limit:
                return {
                    "error": (
                        f"Design flow {operation_flow:.2f} m3/h is outside "
                        f"this pump's curve range ({min_flow_limit:.2f}-{max_flow_limit:.2f} m3/h) "
                        f"for impeller diameter {impeller_dia}mm. "
                        f"Check the flow value, its unit, or the selected pump model/impeller size."
                    )
                }

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
        eff_min, oob_min = self.estimate_eff_bounded(f_min, h_min)
        eff_max, oob_max = self.estimate_eff_bounded(f_max, h_max)
        eff_op, oob_op = self.estimate_eff_bounded(operation_flow, h_op)
        eff_bep = bep_pt["eff"]

        def eff_label(prefix: str, eff: Optional[float], out_of_bounds: bool) -> str:
            if eff is None:
                return f"{prefix} ??%"
            # out_of_bounds means the point fell outside the plotted efficiency curves,
            # so `eff` is only a conservative ceiling, not an interpolated reading.
            return f"{prefix} Less than {round(eff,2)}%" if out_of_bounds else f"{prefix} {round(eff,2)}%"

        min_flow_point = {"point_flow": round(f_min, 4), "point_head": round(h_min, 4), "point_label": eff_label("Min Flow", eff_min, oob_min), "eff": round(eff_min,2) if eff_min is not None else None}
        max_flow_point = {"point_flow": round(f_max, 4), "point_head": round(h_max, 4), "point_label": eff_label("Max Flow", eff_max, oob_max), "eff": round(eff_max,2) if eff_max is not None else None}
        operation_point = {"point_flow": round(operation_flow, 4), "point_head": round(h_op, 4), "point_label": eff_label("Operation", eff_op, oob_op), "eff": round(eff_op,2) if eff_op is not None else None}
        bep_point = {"point_flow": round(bep_pt["flow"], 4), "point_head": round(bep_pt["head"], 4), "point_label": f"BEP {round(eff_bep,2)}%", "eff": round(eff_bep,2)}

        # 7b) Impeller-family envelope (smallest & largest available diameters at this
        # model/speed), for the report chart's min/max diameter curves and the
        # "recommended operating range" shading between them — matches vendor
        # family-curve datasheets (e.g. EXCFLOW-style performance datasheets).
        # self.imp_fits already holds a fit per diameter from step 3, so this is
        # just evaluation, no extra curve fitting.
        min_dia_key = self.imp_key[0]
        max_dia_key = self.imp_key[-1]

        def _dense_curve_for_dia(dia_key):
            fit = self.imp_fits.get(dia_key)
            if not fit or not fit.best_coefficients or not fit.flow_limit:
                return []
            qmin = fit.flow_limit["min_flow_limit"]; qmax = fit.flow_limit["max_flow_limit"]
            if fit.best_fit_method in ("Polynomial", "Parabolic"):
                m = np.poly1d(fit.best_coefficients)
                q = np.linspace(qmin, qmax, 200)
                h = m(q)
            else:
                pts = sorted(self.imp_grouped.get(dia_key, []), key=lambda p: p["flow"])
                q = np.array([p["flow"] for p in pts]); h = np.array([p["head"] for p in pts])
            return [{"flow": round(float(f), 4), "head": round(float(hh), 4)} for f, hh in zip(q, h)]

        min_imp_curve_data = _dense_curve_for_dia(min_dia_key)
        max_imp_curve_data = _dense_curve_for_dia(max_dia_key)

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

        # 8b) Suction/Discharge fluid velocity at the design operating flow:
        # V = Q/A, A = pi/4*D^2, using this pump's own registered pipe internal
        # diameter (assumed mm, same convention as the Cal-tab equivalent).
        def pipe_velocity(q_m3h: float, pipe_id) -> Optional[float]:
            try:
                pipe_id_m = float(pipe_id) / 1000.0
                area_m2 = (np.pi / 4.0) * (pipe_id_m ** 2)
                return round((q_m3h / 3600.0) / area_m2, 4)
            except Exception:
                return None

        suction_velo_m_s = pipe_velocity(operation_flow, self.pump_data.get("suction_pipe_id"))
        discharge_velo_m_s = pipe_velocity(operation_flow, self.pump_data.get("discharge_pipe_id"))

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
            "min_imp_curve_data": min_imp_curve_data,
            "max_imp_curve_data": max_imp_curve_data,
            "min_imp_dia": min_dia_key,
            "max_imp_dia": max_dia_key,
            "recommended_range": {"flow_min": round(0.8 * f_bep, 4), "flow_max": round(1.1 * f_bep, 4)},
            "operation_media": {"density" : self.pump_data.get("media_density"), "media_density_unit": self.pump_data.get("media_density_unit")},
            "hydraulic_power_kW": hydraulic_power_kW,
            "power_min_flow_kW": power_min_flow_kW,
            "power_max_flow_kW": power_max_flow_kW,
            "power_bep_kW": power_bep_kW,
            "power_required_cal_kW": power_required_cal_kW,
            "suction_velo_m_s": suction_velo_m_s,
            "discharge_velo_m_s": discharge_velo_m_s,
            "curve_format": self.data[0].get("curve_format"),
            "shut_off_head": shut_off_head,
            "npshr": npshr_val,
            "units": units,
            "analysis": self.working_range_analysis(operation_flow, operation_head, h_op, min_flow_point, max_flow_point, bep_point, npshr_val),
        }
        return result

    def working_range_analysis(self, operation_flow, operation_head, curve_head, min_flow_point, max_flow_point, bep_point, npshr=None):
        """Working-Range verdict + engineering suggestions for an operating point,
        matching the K-Monitoring Operating Range Verification format."""
        min_flow = min_flow_point["point_flow"]   # 30% BEP
        max_flow = max_flow_point["point_flow"]   # 110% BEP
        bep_flow = bep_point["point_flow"]

        result = {
            "working_range": None,          # "below_30" | "within" | "above_110"
            "working_range_label": None,
            "pump_performance": None,
            "suggestions": [],
            "head_check": None,
            "npsh_check": None,
            "fluid_temperature_note": None,
        }

        # The plotted point always uses the curve's own head at this flow (a fixed-speed
        # pump can't independently choose flow and head — head is whatever the curve says).
        # The head the user typed in is only meaningful as a cross-check against that: a
        # big gap usually means the system-curve head used to pick this operating point
        # doesn't match what the pump can actually deliver here.
        if curve_head not in (None, 0) and operation_head is not None:
            try:
                head_diff = abs(float(operation_head) - float(curve_head)) / float(curve_head)
                if head_diff >= 0.05:
                    result["head_check"] = (
                        f"คำเตือน: Head ที่ระบุ ({operation_head:.2f}) ต่างจาก Head จริงบน Curve ที่ Flow นี้ "
                        f"({curve_head:.2f}) มากกว่า 5% ({head_diff*100:.1f}%) — ควรตรวจสอบ System Curve/Head ที่คำนวณไว้ "
                        f"หรือปั๊มอาจต้องตั้งระยะห่างใบพัด (Impeller clearance) ใหม่ / ใบพัดสึก"
                    )
                else:
                    result["head_check"] = (
                        f"Head ที่ระบุ ({operation_head:.2f}) ใกล้เคียง Head จริงบน Curve ({curve_head:.2f}) "
                        f"อยู่ในเกณฑ์ปกติ (ต่างกัน {head_diff*100:.1f}%)"
                    )
            except (TypeError, ValueError, ZeroDivisionError):
                pass

        if operation_flow < min_flow:
            result["working_range"] = "below_30"
            result["working_range_label"] = "จุดการทำงานต่ำกว่า 30% ของจุดประสิทธิภาพสูงสุด (BEP)"
            result["pump_performance"] = "ไม่อยู่ในเกณฑ์มาตรฐาน"
            result["suggestions"] = [
                "ข้อแนะนำ: จำเป็นต้องเปิดวาล์วเพิ่มเพื่อเพิ่มอัตราการไหล (Flow rate)",
                "ปั๊มอาจจำเป็นต้องตั้งระยะห่างใบพัด (Impeller clearance) ใหม่",
                "ปั๊มอาจจำเป็นต้องเปลี่ยนแผ่นกันสึก (Wear plate)",
            ]

        elif operation_flow > max_flow:
            result["working_range"] = "above_110"
            result["working_range_label"] = "จุดการทำงานสูงกว่า 110% ของจุดประสิทธิภาพสูงสุด (BEP)"
            result["pump_performance"] = "ไม่อยู่ในเกณฑ์มาตรฐาน"
            result["suggestions"] = [
                "ข้อแนะนำ: จำเป็นต้องหรี่วาล์วลงเพื่อลดอัตราการไหล (Flow rate)",
                "เสี่ยงต่อ Cavitation และ Motor Overload จากการทำงานเกิน Curve",
            ]

        else:
            result["working_range"] = "within"
            result["working_range_label"] = "อยู่ในช่วงการทำงานที่แนะนำ (Working Range)"
            result["pump_performance"] = "อยู่ในเกณฑ์มาตรฐาน"
            if operation_flow < bep_flow:
                result["suggestions"].append("วาล์วทางด้านส่ง (Discharge) สามารถเปิดเพิ่มได้อีก")

        # NPSH check needs npsha (Available) from the user; skipped when not provided
        npsha = self.pump_data.get("npsha")
        if npshr is not None and npsha not in (None, ""):
            try:
                npsha_val = float(npsha)
                margin = npsha_val - float(npshr)
                if margin > 0.5:
                    result["npsh_check"] = "ค่า NPSH: ค่า NPSHa (จริง) สูงกว่า NPSHr (ที่ต้องการ) มากกว่า 0.5 เมตร"
                elif margin >= 0:
                    result["npsh_check"] = f"ค่า NPSH: NPSHa สูงกว่า NPSHr เพียง {margin:.2f} เมตร (ต่ำกว่าเกณฑ์ 0.5 เมตร) — เสี่ยงเกิด Cavitation"
                else:
                    result["npsh_check"] = f"ค่า NPSH: NPSHa ต่ำกว่า NPSHr อยู่ {abs(margin):.2f} เมตร — มีความเสี่ยงเกิด Cavitation สูง"
            except (TypeError, ValueError):
                pass

        # Fluid temperature is only echoed back for the report — typed by the user, not computed
        operating_temperature = self.pump_data.get("operating_temperature")
        if operating_temperature not in (None, ""):
            result["fluid_temperature_note"] = f"อุณหภูมิของไหล: {operating_temperature} องศาเซลเซียส"

        return result

    def flow_within_30_100_BEP(self, flow, head, opeData):
        # Result (Thai, human-phrased from the formula) and Suggest (fixed,
        # condition-based action text) are both generated here — Suggest is
        # NOT the engineer's manual note (that's the separate *_remark field);
        # it's an automatic recommendation tied to which branch fired.
        min_flow = opeData["min_flow_point"]["point_flow"]
        max_flow = opeData["max_flow_point"]["point_flow"]
        bep_flow = opeData["bep_point"]["point_flow"]
        # Recommended Range is 80-110% of BEP (same upper bound as the
        # 30-110% working range) — same formula as curve_cal's recommended_range.
        recommended_min_flow = 0.8 * bep_flow

        def bep_adjustment_hint():
            if flow < bep_flow:
                return f"เปิดวาล์วทางด้านส่ง (Discharge) เพิ่มขึ้นเพื่อเพิ่ม Flow เข้าใกล้ BEP ที่ {bep_flow:.1f} m3/h"
            elif flow > bep_flow:
                return f"หรี่วาล์วทางด้านส่ง (Discharge) ลงเพื่อลด Flow เข้าใกล้ BEP ที่ {bep_flow:.1f} m3/h"
            return "จุดทำงานปัจจุบันตรงกับ BEP แล้ว ไม่จำเป็นต้องปรับ"

        if flow < min_flow:
            return {
                "result": f"Flow ({flow:.1f} m3/h) ต่ำกว่า 30% ของ BEP ({min_flow:.1f} m3/h)",
                "suggest": "คำเตือน / ระวังการเกิด Cavitation (ใช่/ไม่ใช่) / เช็คระยะ line  ท่อ",
            }
        elif flow > max_flow:
            return {
                "result": f"Flow ({flow:.1f} m3/h) สูงกว่า 110% ของ BEP ({max_flow:.1f} m3/h)",
                "suggest": "คำเตือน / ตก Curve (หลี่ Valve)",
            }
        else:
            min_eff = float(opeData["min_flow_point"]["eff"])
            max_eff = float(opeData["max_flow_point"]["eff"])
            eff_bep_percentage = round(min_eff + (max_eff - min_eff) * (flow - min_flow) / (max_flow - min_flow), 1)
            result_text = f"Flow ({flow:.1f} m3/h) อยู่ที่ {eff_bep_percentage}% ของ BEP"

            if flow < recommended_min_flow:
                # 1) Normal (within 30-110% BEP) but outside the recommended
                # 80-110% band — say how to get into the recommended range,
                # and separately how to reach BEP exactly.
                suggest = (
                    f"อยู่ในเกณฑ์ปกติแต่อยู่นอกช่วงแนะนำ (Recommended Range 80-110% ของ BEP) — "
                    f"เปิดวาล์วทางด้านส่ง (Discharge) เพิ่มขึ้นจนกว่า Flow จะอยู่ระหว่าง "
                    f"{recommended_min_flow:.1f}-{max_flow:.1f} m3/h เพื่อเข้าสู่ช่วงแนะนำ "
                    f"และปรับต่อจนใกล้ {bep_flow:.1f} m3/h เพื่อให้ได้ BEP"
                )
            else:
                # 2) Normal and already within the recommended range — only
                # the fine adjustment toward BEP itself is needed.
                suggest = (
                    f"อยู่ในเกณฑ์ปกติและอยู่ในช่วงแนะนำ (Recommended Range) แล้ว — "
                    f"{bep_adjustment_hint()}"
                )

            return {
                "result": result_text,
                "suggest": suggest,
            }

    def suction_preassure_check(self,flow,media_density, opeData):
        vapor_pressure = float(opeData.get("vapor_pressure"))
        vapor_pressure_unit = opeData.get("vapor_pressure_unit")
        vapor_pressure_bar = self.pressure_unit_to_bar(vapor_pressure, vapor_pressure_unit)
        # Vapor Pressure needs the same bar -> meters-of-head conversion as
        # Suction Pressure, since it's summed with NPSHr/NPSHa (both in meters).
        vapor_pressure_head = vapor_pressure_bar * 10 / media_density
        suction_pres_ope = float(opeData.get("suction_pres_ope"))
        suction_pres_ope_unit = opeData.get("suction_pres_ope_unit")
        coeffs = opeData.get("npshr_curve_fit")["coefficients"]

        suction_pres_ope_bar = self.pressure_unit_to_bar(suction_pres_ope, suction_pres_ope_unit)
        npsha_ope = suction_pres_ope_bar * 10 / media_density
        npshr_ope = float(np.poly1d(coeffs)(flow))
        threshold = npshr_ope + 0.5 + vapor_pressure_head
        margin = round(npsha_ope - threshold, 2)
        if margin < 0:
            return {
                "result": f"NPSHa ({npsha_ope:.2f} m) ต่ำกว่า NPSHr + 0.5 m + Vapor Pressure ({threshold:.2f} m) อยู่ {abs(margin)} m",
                "suggest": "คำเตือน / ระวังการเกิด Cavitation (ใช่/ไม่ใช่) / เช็คทางดูด (Strainer) / เช็คระยะ line  ท่อ / เช็คระดับน้ำของถัง / เช็ค Pressure ของถังปิด / เช็คขนาดท่อ",
                "npsha": round(npsha_ope, 4),
            }
        else:
            return {
                "result": f"NPSHa ({npsha_ope:.2f} m) สูงกว่า NPSHr + 0.5 m + Vapor Pressure ({threshold:.2f} m) อยู่ {margin} m",
                "suggest": "อยู่ในเกณฑ์ปกติ",
                "npsha": round(npsha_ope, 4),
            }

    def suction_pressure_diff_check(self, flow : float, head : float, curve_data, isFlowMeasure : bool):
        if isFlowMeasure == True:
            #Find the diff of head and flow at the same flow
            flow_curve = self.interpolate_from_curve(curve_data, head, "head")
            head_curve = self.interpolate_from_curve(curve_data, flow, "flow")

            head_diff = round(abs(head - head_curve) / head_curve, 4)
            flow_diff = round(abs(flow - flow_curve) / flow_curve, 4)

            if flow_diff >= 0.05 or head_diff >= 0.05:
                return {
                    "result": f"Head/Flow ที่จุดทำงานต่างจาก Curve มาตรฐานเกิน 5% (Head ต่าง {head_diff*100:.1f}%, Flow ต่าง {flow_diff*100:.1f}%)",
                    "suggest": "คำเตือน / ต้องตั้งระยะห่างใบพัด (Impeller clearance) ใหม่ / ใบพัดอาจสึก",
                }
            else:
                return {
                    "result": f"Head/Flow ที่จุดทำงานตรงกับ Curve มาตรฐาน (Head ต่าง {head_diff*100:.1f}%, Flow ต่าง {flow_diff*100:.1f}%)",
                    "suggest": "อยู่ในเกณฑ์ปกติ",
                }
        else:
            #Find the diff of head at the same flow
            head_curve = self.interpolate_from_curve(curve_data, flow, "flow")
            head_diff = round(abs(head - head_curve) / head_curve, 4)
            if head_diff >= 0.05:
                return {
                    "result": f"Head ที่จุดทำงานต่างจาก Curve มาตรฐานเกิน 5% (Head ต่าง {head_diff*100:.1f}%)",
                    "suggest": "คำเตือน / ต้องตั้งระยะห่างใบพัด (Impeller clearance) ใหม่ / ใบพัดอาจสึก",
                }
            else:
                return {
                    "result": f"Head ที่จุดทำงานตรงกับ Curve มาตรฐาน (Head ต่าง {head_diff*100:.1f}%)",
                    "suggest": "อยู่ในเกณฑ์ปกติ",
                }

    def power_check_iso9906(self, flow, head, power):
        # power = Shaft Power (Motor Power measured * Motor Efficiency) —
        # resolved by the caller (report_check_cal). cal is the ideal hydraulic
        # power ISO 9906 ceiling, always at water density (factory curves are
        # rated on water regardless of the actual pumped media), + 5% tolerance.
        cal = (flow * head * 9.81 * 1.05 ) / 3600

        if power <= cal:
            return {
                "result": f"Shaft Power ที่วัดได้ ({power:.2f} kW) อยู่ในเกณฑ์ที่คำนวณตาม ISO 9906 ({cal:.2f} kW)",
                "suggest": "อยู่ในเกณฑ์ปกติ",
            }
        else:
            return {
                "result": f"Shaft Power ที่วัดได้ ({power:.2f} kW) เกินค่าที่คำนวณตาม ISO 9906 ({cal:.2f} kW)",
                "suggest": "คำเตือน / ต้องตั้งระยะห่างใบพัด (Impeller clearance) ใหม่ / ใบพัดอาจสึก",
            }

    def fluid_temp_check(self, ope_temp , max_temp):
        # Result is a plain factual description of the formula outcome. The
        # pass/fail verdict itself ("อยู่ในเกณฑ์ปกติ"/"คำเตือน") lives in
        # Suggest, ahead of any actionable check-item.
        if ope_temp < max_temp:
            return {
                "result": f"อุณหภูมิของไหล ({ope_temp:g}°C) ต่ำกว่าอุณหภูมิสูงสุดที่ปั๊มรองรับ ({max_temp:g}°C)",
                "suggest": "อยู่ในเกณฑ์ปกติ / ระวังการเกิด Cavitation (ใช่/ไม่ใช่)",
            }
        else:
            return {
                "result": f"อุณหภูมิของไหล ({ope_temp:g}°C) เกินอุณหภูมิสูงสุดที่ปั๊มรองรับ ({max_temp:g}°C)",
                "suggest": "คำเตือน / ระวังการเกิด Cavitation (ใช่/ไม่ใช่)",
            }

    def bearing_housing_temp_check(self, temp, temp_unit , bearing_last_change_date):
        # temp_unit can be missing/None (no unit selected yet) — only look up a
        # conversion when it's actually a different, explicit unit; otherwise
        # `FindUnitConversion` finds no LOV row for `None` and blows up with an
        # unrelated-looking "'NoneType' object has no attribute '_meta'".
        if temp_unit and temp_unit != "C":
            temp = temp * self.FindUnitStandardConversion("unit_temp", temp_unit, "C")

        if temp < 70:
            result = f"อุณหภูมิ Bearing Housing ({temp:g}°C) ต่ำกว่า 70°C"
            if bearing_last_change_date in (None, ""):
                suggest = "อยู่ในเกณฑ์ปกติ / แนะนำให้เปลี่ยนภายใน 1 ปี นับจากวันที่เปลี่ยน Bearing ครั้งล่าสุด"
            else:
                # +1 year FROM the last change date, not the last change date
                # itself — this used to just reformat bearing_last_chg_dt
                # unchanged and label it "1 year before", always showing the
                # wrong (past) date.
                suggested_date = parser.parse(bearing_last_change_date) + relativedelta(years=1)
                suggest = f"อยู่ในเกณฑ์ปกติ / แนะนำให้เปลี่ยนภายใน 1 ปี ก่อนวันที่ {suggested_date.strftime('%d/%m/%y')}"
            return {"result": result, "suggest": suggest}
        else:
            result = f"อุณหภูมิ Bearing Housing ({temp:g}°C) เกินเกณฑ์ปกติ (≥ 70°C)"
            if bearing_last_change_date in (None, ""):
                suggest = "คำเตือน / แนะนำให้เปลี่ยนภายใน 6 เดือน นับจากวันที่เปลี่ยน Bearing ครั้งล่าสุด"
            else:
                suggested_date = parser.parse(bearing_last_change_date) + relativedelta(months=6)
                suggest = f"คำเตือน / แนะนำให้เปลี่ยนภายใน 6 เดือน ก่อนวันที่ {suggested_date.strftime('%d/%m/%y')}"
            return {"result": result, "suggest": suggest}

    def report_check_cal(self, opeData):
        # Each of the 6 checks below is independent: if the specific field(s) it
        # needs are missing/invalid, that one result is just left blank ("") —
        # it does not block the other checks that do have what they need, and it
        # never fails the whole Cal-group submission (the field measurements are
        # always worth saving even when a verdict can't be computed yet).
        result = {
            "range_30_110_result": "", "range_30_110_suggest": "",
            "npshr_npsha_result": "", "npshr_npsha_suggest": "",
            "pump_standard_result": "", "pump_standard_suggest": "",
            "power_result": "", "power_suggest": "",
            "fluid_temp_result": "", "fluid_temp_suggest": "",
            "bearing_temp_result": "", "bearing_temp_suggest": "",
            # Auto-generated readouts fed back so the Cal tab can save them
            # instead of requiring manual entry — see the calc_* blocks below.
            "calc_head_ope": "", "calc_flow_ope": "", "calc_shaft_power": "", "calc_hyd_power": "",
            "calc_npsha": "", "calc_suction_velo": "", "calc_discharge_velo": "",
        }

        flow = None
        head = None
        media_density_sg = None
        curve_data = opeData.get("desire_imp_curve_data")
        flow_is_measured = opeData.get("flow_ope") not in (None, 0, "")

        # head + media_density_sg, needed by most of the checks below
        try:
            diff_pres_ope = float(opeData.get("diff_pres_ope"))
            diff_pres_ope_bar = self.pressure_unit_to_bar(diff_pres_ope, opeData.get("diff_pres_ope_unit"))
            media_density = float(opeData.get("media_density"))
            media_density_unit_conv = self.FindUnitStandardConversion("unit_density", opeData.get("media_density_unit"), "sg")
            media_density_sg = media_density * media_density_unit_conv
            head = (diff_pres_ope_bar * 10) / media_density_sg
            result["calc_head_ope"] = round(head, 4)
        except Exception:
            head = None

        # flow, from direct measurement or (if head is known) interpolated from the curve
        try:
            if flow_is_measured:
                flow = float(opeData["flow_ope"])
                if opeData.get("flow_ope_unit") != "m3/h":
                    unit_conv = self.FindUnitStandardConversion("unit_flow", opeData["flow_ope_unit"], "m3/h")
                else:
                    unit_conv = 1
                flow = flow * unit_conv
            elif head is not None:
                flow = self.interpolate_from_curve(curve_data, head, "head")
            if flow is not None:
                result["calc_flow_ope"] = round(flow, 4)
        except Exception:
            flow = None

        # Shaft Power: Motor Power is the real field measurement the engineer
        # must enter; motor efficiency (this pump's own nameplate value) converts
        # it to the power actually delivered to the pump shaft.
        shaft_power = None
        try:
            motor_power = float(opeData.get("motor_power"))
            motor_power_unit = opeData.get("motor_power_unit")
            if motor_power_unit and motor_power_unit != "kW":
                motor_power = motor_power * self.FindUnitStandardConversion("unit_power", motor_power_unit, "kW")
            motor_efficiency = float(opeData.get("motor_efficiency"))
            shaft_power = motor_power * (motor_efficiency / 100.0)
            result["calc_shaft_power"] = round(shaft_power, 4)
        except Exception:
            shaft_power = None

        # Hydraulic power — computed independently of Motor/Shaft Power, from the
        # CURRENT operating flow/head, always at WATER density (1000 kg/m3):
        # factory curves are rated on water regardless of the actual pumped
        # media, so this is the ISO 9906 reference power, not this pump's real
        # delivered hydraulic power. rho(1000)*G*(Q/3600)*H/1000 reduces to
        # G*(Q/3600)*H since the *1000 kg/m3 and /1000 factors cancel.
        if flow is not None and head is not None:
            try:
                result["calc_hyd_power"] = round(G * (flow / 3600.0) * head, 4)
            except Exception:
                pass

        # Suction/Discharge Fluid Velocity: V = Q / A, A = pi/4 * D^2, using this
        # pump's own registered pipe internal diameter (assumed mm) and the
        # current operating flow.
        if flow is not None:
            for calc_key, pipe_id_key in (("calc_suction_velo", "suction_pipe_id"), ("calc_discharge_velo", "discharge_pipe_id")):
                try:
                    pipe_id_m = float(opeData.get(pipe_id_key)) / 1000.0
                    area_m2 = (np.pi / 4.0) * (pipe_id_m ** 2)
                    result[calc_key] = round((flow / 3600.0) / area_m2, 4)
                except Exception:
                    pass

        #1. Check whether diff pressure at the current flow and head is no more than 5% from curve
        if head is not None:
            try:
                if flow_is_measured and flow is not None:
                    check = self.suction_pressure_diff_check(flow, head, curve_data, True)
                else:
                    check = self.suction_pressure_diff_check(float(opeData.get("design_operation_point")["point_flow"]), head, curve_data, False)
                result["pump_standard_result"] = check["result"]
                result["pump_standard_suggest"] = check["suggest"]
            except Exception:
                pass

        #2. Check whether flow is over or under 30% to 100% BEP
        if flow is not None and head is not None:
            try:
                check = self.flow_within_30_100_BEP(flow, head, opeData)
                result["range_30_110_result"] = check["result"]
                result["range_30_110_suggest"] = check["suggest"]
            except Exception:
                pass

        #3. Check whether suction pressure is over NPSHr at operation condition
        if flow is not None and media_density_sg is not None:
            try:
                check = self.suction_preassure_check(flow, media_density_sg, opeData)
                result["npshr_npsha_result"] = check["result"]
                result["npshr_npsha_suggest"] = check["suggest"]
                if check.get("npsha") is not None:
                    result["calc_npsha"] = check["npsha"]
            except Exception:
                pass

        #4. Check whether power of pump is on ISO 9906:2012 — Shaft Power
        # (measured, independent) vs. the water-based ideal hydraulic power
        # ceiling (calc_hyd_power * 1.05), not this pump's real media density.
        if flow is not None and head is not None and shaft_power is not None:
            try:
                check = self.power_check_iso9906(flow, head, shaft_power)
                result["power_result"] = check["result"]
                result["power_suggest"] = check["suggest"]
            except Exception:
                pass

        #5. Bearing housing temperature — independent of flow/head/density
        try:
            bearing_housing_temp = float(opeData.get("bearing_housing_temp"))
            check = self.bearing_housing_temp_check(
                bearing_housing_temp, opeData.get("bearing_housing_temp_unit"), opeData.get("bearing_last_chg_dt")
            )
            result["bearing_temp_result"] = check["result"]
            result["bearing_temp_suggest"] = check["suggest"]
        except Exception:
            pass

        #6. Fluid temperature vs. the pump's rated max temperature — independent of flow/head/density
        try:
            liquid_temp = float(opeData.get("liquid_temp"))
            liquid_temp_unit = opeData.get("liquid_temp_unit")
            if liquid_temp_unit and liquid_temp_unit != "C":
                liquid_temp = liquid_temp * self.FindUnitStandardConversion("unit_temp", liquid_temp_unit, "C")
            max_temp = float(opeData.get("pump_max_temp"))
            check = self.fluid_temp_check(liquid_temp, max_temp)
            result["fluid_temp_result"] = check["result"]
            result["fluid_temp_suggest"] = check["suggest"]
        except Exception:
            pass

        return result


