import base64
import os
import re
from collections import defaultdict
from datetime import datetime
from io import BytesIO

import matplotlib
matplotlib.use("Agg")  # headless — no display server available on the server
import matplotlib.pyplot as plt
import numpy as np

from django.template.loader import render_to_string
from weasyprint import HTML


# Report letterhead — this is Plant Equipment's own issuing-company info (the
# report author), not the customer's — sourced from the company's own
# engineer_form.xlsx template (cell C2/B3 on its report sheets), and is the
# same on every report so it's a fixed constant rather than per-report data.
_ISSUER_COMPANY_NAME = "PLANT EQUIPMENT CO., LTD."
_ISSUER_COMPANY_ADDRESS = (
    "1312/1-2 Soi Anamai Ngamcharone 25, Ta Karm, Bangkhuntien, "
    "Bangkok 10150 Thailand  Tel. (662) 490-4900  Fax (662) 490-4909"
)


def _load_logo_data_uri():
    """Base64 data URI for the company logo, read once at import time from
    report_assets/logo.jpeg (extracted from engineer_form.xlsx)."""
    logo_path = os.path.join(os.path.dirname(__file__), "report_assets", "logo.jpeg")
    try:
        with open(logo_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("ascii")
        return f"data:image/jpeg;base64,{encoded}"
    except OSError:
        return None


_LOGO_DATA_URI = _load_logo_data_uri()


def _eff_sort_key(label):
    """'73% L' / '73% R' / '78%' -> 73.0 for grouping/ordering contour labels."""
    match = re.search(r"[\d.]+", str(label))
    return float(match.group()) if match else 0.0


def render_curve_chart(curve_result):
    """Build the Head-vs-Flow performance chart as a base64 PNG data URI, from
    the same curve_cal() output the Factory Curve Analyze page plots on screen:
    the selected/design impeller curve, the smallest & largest available diameter
    curves for this model, the recommended 80-110% BEP band shaded between them,
    and the efficiency contour lines PEC already provides across the family —
    matching a vendor family-curve datasheet (e.g. EXCFLOW) layout.
    Returns None if there's nothing plottable (e.g. curve_cal() itself errored)."""
    if not curve_result or curve_result.get("error"):
        return None

    curve_points = curve_result.get("desire_imp_curve_data") or []
    if not curve_points:
        return None

    fig, ax = plt.subplots(figsize=(7.2, 3.6), dpi=150)

    curve_points = sorted(curve_points, key=lambda p: p["flow"])
    design_dia = curve_points[0].get("imp_dia")
    design_label = f"⌀{design_dia}mm (Selected)" if design_dia else "Selected diameter"
    ax.plot(
        [p["flow"] for p in curve_points],
        [p["head"] for p in curve_points],
        color="#2b3a55", linewidth=1.8, label=design_label, zorder=4,
    )

    min_dia = curve_result.get("min_imp_dia")
    max_dia = curve_result.get("max_imp_dia")
    min_curve = sorted(curve_result.get("min_imp_curve_data") or [], key=lambda p: p["flow"])
    max_curve = sorted(curve_result.get("max_imp_curve_data") or [], key=lambda p: p["flow"])

    # Only draw the family-envelope curves when they differ from the selected one —
    # a pump with a single available diameter would otherwise triple-plot the same line.
    if min_curve and min_dia != design_dia:
        ax.plot(
            [p["flow"] for p in min_curve], [p["head"] for p in min_curve],
            color="#8a8f9c", linewidth=1.1, linestyle="--", label=f"⌀{min_dia}mm (Min)", zorder=2,
        )
    if max_curve and max_dia != design_dia:
        ax.plot(
            [p["flow"] for p in max_curve], [p["head"] for p in max_curve],
            color="#8a8f9c", linewidth=1.1, linestyle="--", label=f"⌀{max_dia}mm (Max)", zorder=2,
        )

    # Recommended operating range (80-110% of the selected diameter's BEP flow),
    # shaded between the smallest- and largest-diameter curves.
    rec = curve_result.get("recommended_range") or {}
    if min_curve and max_curve and rec.get("flow_min") is not None:
        min_f = np.array([p["flow"] for p in min_curve]); min_h = np.array([p["head"] for p in min_curve])
        max_f = np.array([p["flow"] for p in max_curve]); max_h = np.array([p["head"] for p in max_curve])
        lo = max(rec["flow_min"], min_f[0], max_f[0])
        hi = min(rec["flow_max"], min_f[-1], max_f[-1])
        if hi > lo:
            grid = np.linspace(lo, hi, 60)
            lower_env = np.interp(grid, min_f, min_h)
            upper_env = np.interp(grid, max_f, max_h)
            ax.fill_between(
                grid, lower_env, upper_env, color="#2e9e4f", alpha=0.18,
                label="Recommended range (80–110% BEP)", zorder=1, linewidth=0,
            )

    # Efficiency contour lines — PEC already tags each curve point with its own
    # efficiency-band label (e.g. "78%", "73% L"/"73% R" for the two branches on
    # either side of that band's peak), so this is just grouping and plotting
    # what curve_cal() already returned, not a reconstruction.
    eff_groups = defaultdict(list)
    for p in curve_result.get("efficiency_curve_data") or []:
        eff_groups[p["eff"]].append(p)
    for label in sorted(eff_groups, key=_eff_sort_key):
        pts = eff_groups[label]
        # seq is PEC's own digitization order along the contour — these points
        # loop across the diameter family rather than moving monotonically in
        # flow, so sorting by flow instead would zigzag the line back and forth.
        if all(p.get("seq") is not None for p in pts):
            pts = sorted(pts, key=lambda p: p["seq"])
        else:
            pts = sorted(pts, key=lambda p: p["flow"])
        if len(pts) < 2:
            continue
        ax.plot(
            [p["flow"] for p in pts], [p["head"] for p in pts],
            color="#c23bb0", linewidth=0.7, alpha=0.7, zorder=2,
        )
        last = pts[-1]
        ax.annotate(
            str(label).strip(), (last["flow"], last["head"]),
            textcoords="offset points", xytext=(3, 0), fontsize=6, color="#c23bb0",
            va="center", zorder=2,
        )

    def mark(point, label, color):
        if not point:
            return
        ax.scatter([point["point_flow"]], [point["point_head"]], color=color, zorder=5, s=28)
        ax.annotate(
            label, (point["point_flow"], point["point_head"]),
            textcoords="offset points", xytext=(5, 5), fontsize=7, color=color, zorder=5,
        )

    mark(curve_result.get("bep_point"), "BEP", "#1e7a1e")
    mark(curve_result.get("min_flow_point"), "Min Flow", "#b3261e")
    mark(curve_result.get("max_flow_point"), "Max Flow", "#b3261e")
    mark(curve_result.get("operation_point"), "Operation", "#c77f00")

    units = curve_result.get("units") or {}
    ax.set_xlabel(f"Flow ({units.get('unit_flow', '')})", fontsize=8)
    ax.set_ylabel(f"Head ({units.get('unit_head', '')})", fontsize=8)
    ax.tick_params(labelsize=7)
    ax.grid(True, linewidth=0.4, alpha=0.6)
    ax.set_ylim(bottom=0)
    ax.legend(fontsize=6.5, loc="best", framealpha=0.9)
    fig.tight_layout()

    buffer = BytesIO()
    fig.savefig(buffer, format="png")
    plt.close(fig)
    buffer.seek(0)
    encoded = base64.b64encode(buffer.read()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


# Visual checklist items, keyed by pump_type.
_GENERAL_CHECKLIST_BASE = [
    ("axial_hand", "Check Axial Hand"),
    ("electricity", "Check Electricity"),
    ("service", "Check Service"),
    ("leakage", "Check Leakage"),
]

_GENERAL_CHECKLIST_BY_TYPE = {
    "Agitator": [
        ("bolt", "Check Bolt"),
        ("corrosion", "Check Corrosion"),
        ("oil_grease", "Check Oil and Grease"),
        ("painting", "Check Painting"),
        ("cleanness", "Check Cleanness"),
        ("chemical_clogging", "Check Chemical Clogging"),
        ("mechanical", "Check Mechanical"),
        ("coupling", "Check Coupling"),
        ("seal", "Check Seal"),
        ("impeller_stutter", "Check Impeller Stutter"),
    ],
    "Centrifugal": [
        ("bolt", "Check Bolt"),
        ("corrosion", "Check Corrosion"),
        ("oil_grease", "Check Oil and Grease"),
        ("painting", "Check Painting"),
        ("cleanness", "Check Cleanness"),
        ("mechanical", "Check Mechanical"),
        ("coupling", "Check Coupling"),
        ("gap", "Check Gap"),
        ("seal", "Check Seal"),
        ("alignment", "Check Alignment"),
        ("rotate_hand", "Check Rotate Hand"),
    ],
    "Metering Hydraulic": [
        ("bolt", "Check Bolt"),
        ("corrosion", "Check Corrosion"),
        ("painting", "Check Painting"),
        ("cleanness", "Check Cleanness"),
        ("chemical_clogging", "Check Chemical Clogging"),
        ("suction_valve", "Check Suction Valve"),
        ("discharge_valve", "Check Discharge Valve"),
        ("hydraulic_air", "Check Hydraulic Air"),
        ("seal", "Check Seal"),
    ],
    "Submersible": [
        ("electrical", "Check Electrical"),
        ("corrosion", "Check Corrosion"),
        ("cleanness", "Check Cleanness"),
        ("mechanical", "Check Mechanical"),
    ],
    "Vacuum": [
        ("bolt", "Check Bolt"),
        ("corrosion", "Check Corrosion"),
        ("oil_grease", "Check Oil and Grease"),
        ("painting", "Check Painting"),
        ("cleanness", "Check Cleanness"),
        ("air_filter_condense", "Check Air Filter Condense"),
        ("mechanical", "Check Mechanical"),
        ("coupling", "Check Coupling"),
        ("gap", "Check Gap"),
        ("seal", "Check Seal"),
        ("rotate_hand", "Check Rotate Hand"),
        ("other_leakage", "Check Other Leakage"),
        ("non_re_valve", "Check Non Return Valve"),
    ],
}
# "Gear" and "Have" share the Centrifugal checklist.
_GENERAL_CHECKLIST_BY_TYPE["Gear"] = _GENERAL_CHECKLIST_BY_TYPE["Centrifugal"]
_GENERAL_CHECKLIST_BY_TYPE["Have"] = _GENERAL_CHECKLIST_BY_TYPE["Centrifugal"]
_GENERAL_CHECKLIST_BY_TYPE["Metering Mechanical"] = _GENERAL_CHECKLIST_BY_TYPE["Metering Hydraulic"]

_RUNNING_CHECKLIST_BASE = [
    ("oil_grease_run", "Check Oil and Grease"),
    ("mechanical_run", "Check Mechanical"),
    ("corrosion_run", "Check Corrosion"),
    ("suction_valve_run", "Check Suction Valve"),
    ("discharge_valve_run", "Check Discharge Valve"),
    ("painting_run", "Check Painting"),
    ("electric_connectivity_run", "Check Electric Connectivity"),
    ("service_piping_run", "Check Service Piping"),
    ("bolt_nut_run", "Check Bolt and Nut"),
    ("barrier_fluid_run_pres", "Check Barrier Fluid Pressure"),
]

_RUNNING_CHECKLIST_EXTRA_BY_TYPE = {
    "Agitator": [("noise_run", "Check Noise"), ("leakage_run", "Check Leakage")],
    "Centrifugal": [("noise_run", "Check Noise"), ("leakage_run", "Check Leakage"), ("cavitation_run", "Check Cavitation")],
    "Metering Hydraulic": [("noise_run", "Check Noise"), ("leakage_run", "Check Leakage"), ("cavitation_run", "Check Cavitation")],
    "Vacuum": [("noise_run", "Check Noise"), ("leakage_run", "Check Leakage"), ("cavitation_run", "Check Cavitation")],
}
_RUNNING_CHECKLIST_EXTRA_BY_TYPE["Gear"] = _RUNNING_CHECKLIST_EXTRA_BY_TYPE["Centrifugal"]
_RUNNING_CHECKLIST_EXTRA_BY_TYPE["Have"] = _RUNNING_CHECKLIST_EXTRA_BY_TYPE["Centrifugal"]
_RUNNING_CHECKLIST_EXTRA_BY_TYPE["Metering Mechanical"] = _RUNNING_CHECKLIST_EXTRA_BY_TYPE["Metering Hydraulic"]
# Submersible has no extra running-check items in the original mapper.


def _verdict_class(text):
    """Classify a check-suggest string as ok/warn/neutral, for the PDF's colored badge.

    All 6 auto-computed checks in check_condition.py build their Suggest text
    starting with a fixed Thai prefix — "คำเตือน" for the failing branch,
    "อยู่ในเกณฑ์ปกติ" for the passing one — specifically so this can classify
    by prefix instead of guessing from freeform keywords. Result itself is a
    plain factual description with no verdict prefix. The English markers
    below are a fallback only, for any older/unrefactored text."""
    if not text:
        return "neutral"
    if text.startswith("คำเตือน"):
        return "warn"
    if text.startswith("อยู่ในเกณฑ์ปกติ"):
        return "ok"
    lowered = text.lower()
    if lowered.startswith("warning") or lowered.startswith("caution"):
        return "warn"
    warn_markers = (
        "over normal range", "more than", "error", "not implemented",
        "flow lower than 30", "flow over than 110",
    )
    if any(marker in lowered for marker in warn_markers):
        return "warn"
    if any(marker in lowered for marker in ("within normal", "normal length", "witnin")):
        return "ok"
    return "neutral"


def _fmt_4digit(value):
    """Round a raw vibration/temperature reading to 4 decimal places, dropping
    trailing zeros (1.2000 -> 1.2, 45.0 -> 45) so the compact table columns
    don't overflow with whatever precision the source data happened to carry.
    Non-numeric values (dates, verdict text, blank) pass through unchanged."""
    try:
        return f"{round(float(value), 4):g}"
    except (TypeError, ValueError):
        return value


class PDFReportBuilder:
    def __init__(self, pump_data, report_check_data, data_cal_dict, data_vibe_dict, data_visual_dict, data_result_dict, curve_result=None):
        self.pump_data = pump_data or {}
        self.report_check_data = report_check_data or {}
        self.data_cal_dict = data_cal_dict or {}
        self.data_vibe_dict = data_vibe_dict or {}
        self.data_visual_dict = data_visual_dict or {}
        self.data_result_dict = data_result_dict or {}
        self.curve_result = curve_result

    def _checklist(self, base_items, extra_items):
        items = []
        for key, label in base_items + extra_items:
            items.append({
                "label": label,
                "check": self.data_visual_dict.get(f"{key}_check", ""),
                "remark": self.data_visual_dict.get(f"{key}_remark", ""),
            })
        return items

    def _vibration_matrix_rows(self, positions):
        """Transposed matrix — one column per (equipment, side) position, e.g.
        Pump NDE / Pump DE / Motor NDE / Motor DE all in one combined table.
        Temp and Measured date come first, then Velocity/Acceleration/
        Displacement grouped by axis, each axis row for Velocity/Acceleration
        immediately followed by its own Result row (Displacement has no
        Result field on the model, so it never gets one)."""
        v = self.data_vibe_dict
        r = self.data_result_dict
        # standalone=True: these two rows have no group/sub split (unlike the
        # axis rows below), so their label cell spans both label columns —
        # without this they'd render one cell short and every value would
        # shift left by a column, silently dropping the last position's cell.
        rows = [
            {"standalone": True, "sub": "Temp.", "values": [_fmt_4digit(v.get(f"temp_{k}", "")) for k, _ in positions]},
            {"standalone": True, "sub": "Measured", "values": [v.get(f"{k}_x_date", "") for k, _ in positions]},
        ]
        for measure, group_label, has_result in (
            ("v", "Velocity (mm/s)", True), ("a", "Acceleration (m/s²)", True), ("d", "Displacement (µm)", False),
        ):
            group_span = 6 if has_result else 3
            for i, (axis_key, axis_label) in enumerate((("h", "Horizontal"), ("v", "Vertical"), ("a", "Axial"))):
                rows.append({
                    "group": group_label if i == 0 else None,
                    "group_rowspan": group_span if i == 0 else 0,
                    "sub": axis_label,
                    "values": [_fmt_4digit(v.get(f"{measure}_{k}_{axis_key}", "")) for k, _ in positions],
                })
                if has_result:
                    rows.append({
                        "group": None, "group_rowspan": 0, "sub": "Result", "is_result": True,
                        "values": [r.get(f"{measure}_{k}_{axis_key}_result", "") for k, _ in positions],
                    })
        return rows

    def _build_context(self):
        pump_type = self.pump_data.get("pump_type_name", "")
        general_extra = _GENERAL_CHECKLIST_BY_TYPE.get(pump_type, [])
        running_extra = _RUNNING_CHECKLIST_EXTRA_BY_TYPE.get(pump_type, [])

        updated_at = self.report_check_data.get("updated_at")
        updated_at_str = f"{updated_at:%Y-%m-%d %H:%M:%S}" if updated_at else ""

        r = self.data_result_dict

        # One combined table (Pump NDE/DE + Motor NDE/DE as 4 columns), matching
        # the original report layout — not two separate Pump/Motor tables.
        vibration_positions = [
            ("pump_nde", "NDE"), ("pump_de", "DE"),
            ("motor_nde", "NDE"), ("motor_de", "DE"),
        ]
        vibration_rows = self._vibration_matrix_rows(vibration_positions)

        return {
            "report_title": "Engineer Pump Inspection Report",
            "company_name": self.pump_data.get("company_name_en", ""),
            "company_logo": _LOGO_DATA_URI,
            "issuer_company_name": _ISSUER_COMPANY_NAME,
            "issuer_company_address": _ISSUER_COMPANY_ADDRESS,
            "tag_no": self.pump_data.get("tag_no", ""),
            "serial_no": self.pump_data.get("serial_no", ""),
            "today": datetime.now().strftime("%Y-%m-%d"),
            "updated_at": updated_at_str,
            "doc_customer": self.report_check_data.get("doc_customer", ""),
            "doc_no": self.report_check_data.get("doc_no", ""),
            "doc_number_engineer": self.report_check_data.get("doc_number_engineer", ""),

            "pump_brand": self.pump_data.get("pump_brand", ""),
            "pump_model": self.pump_data.get("pump_model", ""),
            "pump_stage": self.pump_data.get("pump_stage", ""),
            "pump_speed": self.pump_data.get("pump_speed", ""),
            "pump_type": pump_type,
            "media_name": self.pump_data.get("media_name", ""),
            "media_density": self.pump_data.get("media_density", ""),
            "media_viscosity": self.pump_data.get("media_viscosity", ""),
            "media_viscosity_unit": self.pump_data.get("media_viscosity_unit", ""),
            "pump_max_temp": self.pump_data.get("pump_max_temp", ""),
            "suction_pipe_id": self.pump_data.get("suction_pipe_id", ""),
            "discharge_pipe_id": self.pump_data.get("discharge_pipe_id", ""),
            "motor_brand": self.pump_data.get("motor_brand", ""),
            "motor_model": self.pump_data.get("motor_model", ""),
            "motor_serial_no": self.pump_data.get("motor_serial_no", ""),
            "voltage": self.pump_data.get("voltage", ""),
            "suggest_motor": self.pump_data.get("suggest_motor", ""),
            "vapor_pressure": self.pump_data.get("vapor_pressure", ""),

            "flow_ope": self.data_cal_dict.get("flow_ope", ""),
            "suction_pres_ope": self.data_cal_dict.get("suction_pres_ope", ""),
            "discharge_pres_ope": self.data_cal_dict.get("discharge_pres_ope", ""),
            "diff_pres_ope": self.data_cal_dict.get("diff_pres_ope", ""),
            "head_ope": self.data_cal_dict.get("head_ope", ""),
            "motor_power": self.data_cal_dict.get("motor_power", ""),
            "test_speed": self.data_cal_dict.get("test_speed", ""),
            "hyd_power_measure": self.data_cal_dict.get("hyd_power_measure", ""),
            "liquid_temp": self.data_cal_dict.get("liquid_temp", ""),
            "liquid_temp_unit": self.data_cal_dict.get("liquid_temp_unit", ""),
            "npsha_actual": self.data_cal_dict.get("npsha_actual", ""),
            "npsha": self.data_cal_dict.get("npsha", ""),

            "operating_point_left": self._operating_point_items()[:11],
            "operating_point_right": self._operating_point_items()[11:],
            "cal_remarks": self.data_cal_dict.get("remarks", ""),

            "vibration_rows": vibration_rows,
            "env_vibration": self.data_vibe_dict.get("env_vibration", ""),
            "general_checklist": self._checklist(_GENERAL_CHECKLIST_BASE, general_extra),
            "running_checklist": self._checklist(_RUNNING_CHECKLIST_BASE, running_extra),
            "visual_remarks": self.data_visual_dict.get("remarks_check", ""),

            # Suggest and Remark are two distinct things, not one blob: Suggest
            # is the engineer's own free-text recommendation, Remark is a
            # separate manual note — keep them on their own labeled lines
            # rather than concatenating them into one string.
            "range_30_110_result": r.get("range_30_110_result", ""),
            "range_30_110_class": _verdict_class(r.get("range_30_110_suggest", "")),
            "range_30_110_suggest": r.get("range_30_110_suggest", ""),
            "range_30_110_remark": r.get("range_30_110_remark", ""),

            "pump_standard_result": r.get("pump_standard_result", ""),
            "pump_standard_class": _verdict_class(r.get("pump_standard_suggest", "")),
            "pump_standard_suggest": r.get("pump_standard_suggest", ""),
            "pump_standard_remark": r.get("pump_standard_remark", ""),

            "npshr_npsha_result": r.get("npshr_npsha_result", ""),
            "npshr_npsha_class": _verdict_class(r.get("npshr_npsha_suggest", "")),
            "npshr_npsha_suggest": r.get("npshr_npsha_suggest", ""),
            "npshr_npsha_remark": r.get("npshr_npsha_remark", ""),

            "power_result": r.get("power_result", ""),
            "power_class": _verdict_class(r.get("power_suggest", "")),
            "power_suggest": r.get("power_suggest", ""),
            "power_remark": r.get("power_remark", ""),

            "fluid_temp_result": r.get("fluid_temp_result", ""),
            "fluid_temp_class": _verdict_class(r.get("fluid_temp_suggest", "")),
            "fluid_temp_suggest": r.get("fluid_temp_suggest", ""),
            "fluid_temp_remark": r.get("fluid_temp_remark", ""),

            "bearing_temp_result": r.get("bearing_temp_result", ""),
            "bearing_temp_class": _verdict_class(r.get("bearing_temp_suggest", "")),
            "bearing_temp_suggest": r.get("bearing_temp_suggest", ""),
            "bearing_temp_remark": r.get("bearing_temp_remark", ""),

            # Standalone free-text suggestion fields — no computed counterpart,
            # the engineer just types a note per category. Power and Bearing
            # Temp. are deliberately NOT here even though the model has
            # power_suggest/bearing_temp_suggest columns — those are now
            # auto-populated by report_check_cal() and shown next to their
            # own result block above, not as a manual freeform note.
            "general_suggest_items": [
                {"label": "Speed", "suggest": r.get("speed_suggest", "")},
                {"label": "Flow", "suggest": r.get("flow_suggest", "")},
                {"label": "NPSHr", "suggest": r.get("npshr_suggest", "")},
                {"label": "Velocity", "suggest": r.get("velocity_suggest", "")},
                {"label": "Boiling Point", "suggest": r.get("boiling_point_suggest", "")},
                {"label": "Current", "suggest": r.get("current_suggest", "")},
                {"label": "API", "suggest": r.get("api_suggest", "")},
                {"label": "Buffer", "suggest": r.get("buffer_suggest", "")},
                {"label": "Bearing", "suggest": r.get("bearing_suggest", "")},
                {"label": "Vibration", "suggest": r.get("vibration_suggest", "")},
            ],

            # Labels here are copied verbatim from the Result tab's own form —
            # v_pump_suggest and a_pump_suggest are BOTH literally labeled
            # "Pump Suggest" there (the form doesn't distinguish velocity vs.
            # acceleration in that label), so this list keeps the same
            # duplicate wording rather than inventing a clearer one.
            "vibration_suggest_items": [
                {"label": "Pump Suggest", "suggest": r.get("v_pump_suggest", ""), "remark": r.get("v_pump_remark", "")},
                {"label": "Motor Suggest", "suggest": r.get("v_motor_suggest", ""), "remark": r.get("v_motor_remark", "")},
                {"label": "Pump Suggest", "suggest": r.get("a_pump_suggest", ""), "remark": r.get("a_pump_remark", "")},
                {"label": "Motor Acceleration Suggest", "suggest": r.get("a_motor_suggest", ""), "remark": r.get("a_motor_remark", "")},
            ],

            "curve_chart": render_curve_chart(self.curve_result),
        }

    def _operating_point_items(self):
        c = self.data_cal_dict

        def kv(label, value_key, unit_key=None):
            value = c.get(value_key, "")
            unit = c.get(unit_key, "") if unit_key else ""
            return {"label": label, "value": f"{value} {unit}".strip() if value not in (None, "") else ""}

        return [
            kv("Test Speed", "test_speed", "test_speed_unit"),
            kv("Operation Flow", "flow_ope", "flow_ope_unit"),
            kv("Suction Pressure", "suction_pres_ope", "suction_pres_ope_unit"),
            kv("Discharge Pressure", "discharge_pres_ope", "discharge_pres_ope_unit"),
            kv("Differential Pressure", "diff_pres_ope", "diff_pres_ope_unit"),
            kv("Operation Head", "head_ope", "head_ope_unit"),
            kv("Operation Shut Off Head", "head_shut", "head_shut_unit"),
            kv("Operation Head Max", "head_max", "head_max_unit"),
            kv("Bearing Housing Temp.", "bearing_housing_temp", "bearing_housing_temp_unit"),
            kv("Environment Temperature", "env_temp", "env_temp_unit"),
            kv("Liquid Temperature", "liquid_temp", "liquid_temp_unit"),
            kv("Current I1", "current_i1_ope", "current_i1_ope_unit"),
            kv("Current I2", "current_i2_ope", "current_i2_ope_unit"),
            kv("Current I3", "current_i3_ope", "current_i3_ope_unit"),
            kv("Average Current", "i_avg_ope", "i_avg_ope_unit"),
            kv("Average Voltage", "v_avg_ope", "v_avg_ope_unit"),
            kv("Motor Power", "motor_power", "motor_power_unit"),
            kv("Shaft Power", "shaft_ope", "shaft_ope_unit"),
            kv("Hydraulic Power (Measured)", "hyd_power_measure", "hyd_power_measure_unit"),
            kv("NPSHa", "npsha"),
            kv("Actual NPSHa", "npsha_actual", "npsha_actual_unit"),
            kv("Suction Fluid Velocity", "suction_fluid_velo", "suction_fluid_velo_unit"),
            kv("Discharge Fluid Velocity", "discharge_fluid_velo", "discharge_fluid_velo_unit"),
        ]

    def render_pdf(self) -> bytes:
        html_string = render_to_string("engineer/report_pdf.html", self._build_context())
        return HTML(string=html_string).write_pdf()
