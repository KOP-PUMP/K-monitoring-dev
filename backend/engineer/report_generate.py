from datetime import datetime

class ReportMapper:
    def __init__(self, wb, pump_data, report_check_data, data_cal_dict, data_vibe_dict, data_visual_dict, data_result_dict):
        self.wb = wb
        self.pump_data = pump_data
        self.report_check_data = report_check_data
        self.data_cal_dict = data_cal_dict
        self.data_vibe_dict = data_vibe_dict
        self.data_visual_dict = data_visual_dict
        self.data_result_dict = data_result_dict
        self.today = datetime.now().strftime("%Y-%m-%d")

    def map_all(self):
        self.map_sheet_common_headers()
        self.map_sheet_one()
        self.map_sheet_two()
        self.map_sheet_three()

    def map_sheet_common_headers(self):
        for sheet in self.wb.worksheets[:3]:
            sheet['G6']  = self.pump_data.get('company_name_en', "")
            sheet['G7']  = self.pump_data.get('company_name_en', "")
            sheet['G8']  = self.pump_data.get('pump_brand', "")
            sheet['G9']  = self.pump_data.get('motor_brand', "")
            sheet['G10'] = self.pump_data.get('suggest_motor', "")
            sheet['Q10'] = self.pump_data.get('voltage', "")
            sheet['U8']  = self.pump_data.get('pump_model', "")
            sheet['U9']  = self.pump_data.get('motor_model', "")
            sheet['AJ6'] = self.today
            sheet['AJ7'] = self.pump_data.get('tag_no', "")
            sheet['AJ8'] = self.pump_data.get('serial_no', "")
            sheet['AJ9'] = self.pump_data.get('motor_serial_no', "")
            sheet['AE10'] = self.pump_data.get('pump_stage', "")
            sheet['AL10'] = self.pump_data.get('pump_speed', "")

    def map_sheet_one(self):
        ws = self.wb.worksheets[0]
        updated_at = self.report_check_data.get('updated_at')
        
        ws['A28'] = f"{updated_at:%Y-%m-%d %H:%M:%S}" if updated_at else ""
        ws['E28']  = self.data_vibe_dict.get('temp_pump_nde', "")
        ws['I28']  = self.data_vibe_dict.get('temp_pump_de', "")
        ws['M28']  = self.data_vibe_dict.get('temp_motor_de', "")
        ws['Q28']  = self.data_vibe_dict.get('temp_motor_nde', "")

        ws['U28']  = self.data_vibe_dict.get('v_pump_nde_h', "")
        ws['W28']  = self.data_vibe_dict.get('v_pump_nde_v', "")
        ws['Y28']  = self.data_vibe_dict.get('v_pump_nde_a', "")
        ws['AA28'] = self.data_vibe_dict.get('v_pump_de_h', "")
        ws['AC28'] = self.data_vibe_dict.get('v_pump_de_v', "")
        ws['AE28'] = self.data_vibe_dict.get('v_pump_de_a', "")
        ws['AG28'] = self.data_vibe_dict.get('v_motor_de_h', "")
        ws['AI28'] = self.data_vibe_dict.get('v_motor_de_v', "")
        ws['AK28'] = self.data_vibe_dict.get('v_motor_de_a', "")
        ws['AM28'] = self.data_vibe_dict.get('v_motor_nde_h', "")
        ws['AO28'] = self.data_vibe_dict.get('v_motor_nde_v', "")
        ws['AQ28'] = self.data_vibe_dict.get('v_motor_nde_a', "")

        ws['H30']  = self.pump_data.get('media_name', "")
        ws['AF30'] = self.pump_data.get('media_viscosity', "")
        
        ws['H31']  = self.pump_data.get('media_density', "")
        ws['AF31'] = self.pump_data.get('suction_pipe_id', "")
        
        ws['H32']  = self.data_cal_dict.get('liquid_temp', "")
        ws['AF32'] = self.pump_data.get('discharge_pipe_id', "")
        
        ws['H33']  = self.data_cal_dict.get('current_i1_ope', "")
        ws['W33']  = self.data_cal_dict.get('current_i2_ope', "")
        ws['AL33'] = self.data_cal_dict.get('current_i3_ope', "")

        ws['A37']  = "1"
        ws['C37']  = self.data_cal_dict.get('flow_ope', "")
        ws['H37']  = self.data_cal_dict.get('suction_pres_ope', "")
        ws['N37']  = self.data_cal_dict.get('discharge_pres_ope', "")
        ws['T37']  = self.data_cal_dict.get('diff_pres_ope', "")
        ws['Z37']  = self.data_cal_dict.get('i_avg_ope', "")
        ws['AD37'] = self.data_cal_dict.get('v_avg_ope', "")
        ws['AH37'] = self.data_cal_dict.get('motor_power', "")
        ws['AL37'] = self.data_cal_dict.get('test_speed', "")

        pump_type = self.pump_data.get("pump_type_name", "")

        ws['A40'] = "1"; ws['B40'] = "Check Axial hand"
        ws['M40'] = self.data_visual_dict.get('axial_hand_check', "")
        ws['O40'] = self.data_visual_dict.get('axial_hand_remark', "")

        ws['A41'] = "2"; ws['B41'] = "Check Electricity"
        ws['M41'] = self.data_visual_dict.get('electricity_check', "")
        ws['O41'] = self.data_visual_dict.get('electricity_remark', "")

        ws['A42'] = "3"; ws['B42'] = "Check Service"
        ws['M42'] = self.data_visual_dict.get('service_check', "")
        ws['O42'] = self.data_visual_dict.get('service_remark', "")

        ws['A43'] = "4"; ws['B43'] = "Check Leakage"
        ws['M43'] = self.data_visual_dict.get('leakage_check', "")
        ws['O43'] = self.data_visual_dict.get('leakage_remark', "")

        ws['V40'] = "1";  ws['W40'] = "Check Oil and Grease"
        ws['AI40'] = self.data_visual_dict.get('oil_grease_run_check', "")
        ws['AK40'] = self.data_visual_dict.get('oil_grease_run_remark', "")

        ws['V41'] = "2";  ws['W41'] = "Check Mechanical"
        ws['AI41'] = self.data_visual_dict.get('mechanical_run_check', "")
        ws['AK41'] = self.data_visual_dict.get('mechanical_run_remark', "")

        ws['V42'] = "3";  ws['W42'] = "Check Corrosion"
        ws['AI42'] = self.data_visual_dict.get('corrosion_run_check', "")
        ws['AK42'] = self.data_visual_dict.get('corrosion_run_remark', "")

        ws['V43'] = "4";  ws['W43'] = "Check Suction Valve"
        ws['AI43'] = self.data_visual_dict.get('suction_valve_run_check', "")
        ws['AK43'] = self.data_visual_dict.get('suction_valve_run_remark', "")

        ws['V44'] = "5";  ws['W44'] = "Check Discharge Valve"
        ws['AI44'] = self.data_visual_dict.get('discharge_valve_run_check', "")
        ws['AK44'] = self.data_visual_dict.get('discharge_valve_run_remark', "")

        ws['V45'] = "6";  ws['W45'] = "Check Painting"
        ws['AI45'] = self.data_visual_dict.get('painting_run_check', "")
        ws['AK45'] = self.data_visual_dict.get('painting_run_remark', "")

        ws['V46'] = "7";  ws['W46'] = "Check Electric Connectivity"
        ws['AI46'] = self.data_visual_dict.get('electric_connectivity_run_check', "")
        ws['AK46'] = self.data_visual_dict.get('electric_connectivity_run_remark', "")

        ws['V47'] = "8";  ws['W47'] = "Check Service Piping"
        ws['AI47'] = self.data_visual_dict.get('service_piping_run_check', "")
        ws['AK47'] = self.data_visual_dict.get('service_piping_run_remark', "")

        ws['V48'] = "9";  ws['W48'] = "Check Bolt and Nut"
        ws['AI48'] = self.data_visual_dict.get('bolt_nut_run_check', "")
        ws['AK48'] = self.data_visual_dict.get('bolt_nut_run_remark', "")

        ws['V49'] = "10"; ws['W49'] = "Check Barrier Fluid Pressure"
        ws['AI49'] = self.data_visual_dict.get('barrier_fluid_run_pres_check', "")
        ws['AK49'] = self.data_visual_dict.get('barrier_fluid_run_pres_remark', "")

        match pump_type:
            case "Agitator":
                ws['A44'] = "5";  ws['B44'] = "Check Bolt"
                ws['M44'] = self.data_visual_dict.get('bolt_check', "")
                ws['O44'] = self.data_visual_dict.get('bolt_remark', "")

                ws['A45'] = "6";  ws['B45'] = "Check Corrosion"
                ws['M45'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O45'] = self.data_visual_dict.get('corrosion_remark', "")

                ws['A46'] = "7";  ws['B46'] = "Check Oil and Grease"
                ws['M46'] = self.data_visual_dict.get('oil_grease_check', "")
                ws['O46'] = self.data_visual_dict.get('oil_grease_remark', "")

                ws['A47'] = "8";  ws['B47'] = "Check Painting"
                ws['M47'] = self.data_visual_dict.get('painting_check', "")
                ws['O47'] = self.data_visual_dict.get('painting_remark', "")

                ws['A48'] = "9";  ws['B48'] = "Check Cleanness"
                ws['M48'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O48'] = self.data_visual_dict.get('cleanness_remark', "")

                ws['A49'] = "10"; ws['B49'] = "Check Chemical Clogging"
                ws['M49'] = self.data_visual_dict.get('chemical_clogging_check', "")
                ws['O49'] = self.data_visual_dict.get('chemical_clogging_remark', "")

                ws['A50'] = "11"; ws['B50'] = "Check Mechanical"
                ws['M50'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O50'] = self.data_visual_dict.get('mechanical_remark', "")

                ws['A51'] = "12"; ws['B51'] = "Check Coupling"
                ws['M51'] = self.data_visual_dict.get('coupling_check', "")
                ws['O51'] = self.data_visual_dict.get('coupling_remark', "")

                ws['A52'] = "13"; ws['B52'] = "Check Seal"
                ws['M52'] = self.data_visual_dict.get('seal_check', "")
                ws['O52'] = self.data_visual_dict.get('seal_remark', "")

                ws['A53'] = "14"; ws['B53'] = "Check Impeller Stutter"
                ws['M53'] = self.data_visual_dict.get('impeller_stutter_check', "")
                ws['O53'] = self.data_visual_dict.get('impeller_stutter_remark', "")

                ws['V50'] = "11"; ws['W50'] = "Check Noise"
                ws['AI50'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK50'] = self.data_visual_dict.get('noise_run_remark', "")

                ws['V51'] = "12"; ws['W51'] = "Check Leakage"
                ws['AI51'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK51'] = self.data_visual_dict.get('leakage_run_remark', "")

            case "Centrifugal" | "Gear" | "Have":
                ws['A44'] = "5";  ws['B44'] = "Check Bolt"
                ws['M44'] = self.data_visual_dict.get('bolt_check', "")
                ws['O44'] = self.data_visual_dict.get('bolt_remark', "")

                ws['A45'] = "6";  ws['B45'] = "Check Corrosion"
                ws['M45'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O45'] = self.data_visual_dict.get('corrosion_remark', "")

                ws['A46'] = "7";  ws['B46'] = "Check Oil and Grease"
                ws['M46'] = self.data_visual_dict.get('oil_grease_check', "")
                ws['O46'] = self.data_visual_dict.get('oil_grease_remark', "")

                ws['A47'] = "8";  ws['B47'] = "Check Painting"
                ws['M47'] = self.data_visual_dict.get('painting_check', "")
                ws['O47'] = self.data_visual_dict.get('painting_remark', "")

                ws['A48'] = "9";  ws['B48'] = "Check Cleanness"
                ws['M48'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O48'] = self.data_visual_dict.get('cleanness_remark', "")

                ws['A49'] = "10"; ws['B49'] = "Check Mechanical"
                ws['M49'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O49'] = self.data_visual_dict.get('mechanical_remark', "")

                ws['A50'] = "11"; ws['B50'] = "Check Coupling"
                ws['M50'] = self.data_visual_dict.get('coupling_check', "")
                ws['O50'] = self.data_visual_dict.get('coupling_remark', "")

                ws['A51'] = "12"; ws['B51'] = "Check Gap"
                ws['M51'] = self.data_visual_dict.get('gap_check', "")
                ws['O51'] = self.data_visual_dict.get('gap_remark', "")

                ws['A52'] = "13"; ws['B52'] = "Check Seal"
                ws['M52'] = self.data_visual_dict.get('seal_check', "")
                ws['O52'] = self.data_visual_dict.get('seal_remark', "")

                ws['A53'] = "14"; ws['B53'] = "Check Alignment"
                ws['M53'] = self.data_visual_dict.get('alignment_check', "")
                ws['O53'] = self.data_visual_dict.get('alignment_remark', "")

                ws['A54'] = "15"; ws['B54'] = "Check Rotate Hand"
                ws['M54'] = self.data_visual_dict.get('rotate_hand_check', "")
                ws['O54'] = self.data_visual_dict.get('rotate_hand_remark', "")

                ws['V50'] = "11"; ws['W50'] = "Check Noise"
                ws['AI50'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK50'] = self.data_visual_dict.get('noise_run_remark', "")

                ws['V51'] = "12"; ws['W51'] = "Check Leakage"
                ws['AI51'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK51'] = self.data_visual_dict.get('leakage_run_remark', "")

                ws['V52'] = "13"; ws['W52'] = "Check Cavitation"
                ws['AI52'] = self.data_visual_dict.get('cavitation_run_check', "")
                ws['AK52'] = self.data_visual_dict.get('cavitation_run_remark', "")

            case "Metering Hydraulic" | "Metering Mechanical":
                ws['A44'] = "5";  ws['B44'] = "Check Bolt"
                ws['M44'] = self.data_visual_dict.get('bolt_check', "")
                ws['O44'] = self.data_visual_dict.get('bolt_remark', "")

                ws['A45'] = "6";  ws['B45'] = "Check Corrosion"
                ws['M45'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O45'] = self.data_visual_dict.get('corrosion_remark', "")

                ws['A46'] = "7";  ws['B46'] = "Check Painting"
                ws['M46'] = self.data_visual_dict.get('painting_check', "")
                ws['O46'] = self.data_visual_dict.get('painting_remark', "")

                ws['A47'] = "8";  ws['B47'] = "Check Cleanness"
                ws['M47'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O47'] = self.data_visual_dict.get('cleanness_remark', "")

                ws['A48'] = "9";  ws['B48'] = "Check Chemical Clogging"
                ws['M48'] = self.data_visual_dict.get('chemical_clogging_check', "")
                ws['O48'] = self.data_visual_dict.get('chemical_clogging_remark', "")

                ws['A49'] = "10"; ws['B49'] = "Check Suction Valve"
                ws['M49'] = self.data_visual_dict.get('suction_valve_check', "")
                ws['O49'] = self.data_visual_dict.get('suction_valve_remark', "")

                ws['A50'] = "11"; ws['B50'] = "Check Discharge Valve"
                ws['M50'] = self.data_visual_dict.get('discharge_valve_check', "")
                ws['O50'] = self.data_visual_dict.get('discharge_valve_remark', "")

                ws['A51'] = "12"; ws['B51'] = "Check Hydraulic Air"
                ws['M51'] = self.data_visual_dict.get('hydraulic_air_check', "")
                ws['O51'] = self.data_visual_dict.get('hydraulic_air_remark', "")

                ws['A52'] = "13"; ws['B52'] = "Check Seal"
                ws['M52'] = self.data_visual_dict.get('seal_check', "")
                ws['O52'] = self.data_visual_dict.get('seal_remark', "")

                ws['V50'] = "11"; ws['W50'] = "Check Noise"
                ws['AI50'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK50'] = self.data_visual_dict.get('noise_run_remark', "")

                ws['V51'] = "12"; ws['W51'] = "Check Leakage"
                ws['AI51'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK51'] = self.data_visual_dict.get('leakage_run_remark', "")

                ws['V52'] = "13"; ws['W52'] = "Check Cavitation"
                ws['AI52'] = self.data_visual_dict.get('cavitation_run_check', "")
                ws['AK52'] = self.data_visual_dict.get('cavitation_run_remark', "")

            case "Submersible":
                ws['A44'] = "5";  ws['B44'] = "Check Electrical"
                ws['M44'] = self.data_visual_dict.get('electrical_check', "")
                ws['O44'] = self.data_visual_dict.get('electrical_remark', "")

                ws['A45'] = "6";  ws['B45'] = "Check Corrosion"
                ws['M45'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O45'] = self.data_visual_dict.get('corrosion_remark', "")

                ws['A46'] = "7";  ws['B46'] = "Check Cleanness"
                ws['M46'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O46'] = self.data_visual_dict.get('cleanness_remark', "")

                ws['A47'] = "8";  ws['B47'] = "Check Mechanical"
                ws['M47'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O47'] = self.data_visual_dict.get('mechanical_remark', "")

            case "Vacuum":
                ws['A44'] = "5";  ws['B44'] = "Check Bolt"
                ws['M44'] = self.data_visual_dict.get('bolt_check', "")
                ws['O44'] = self.data_visual_dict.get('bolt_remark', "")

                ws['A45'] = "6";  ws['B45'] = "Check Corrosion"
                ws['M45'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O45'] = self.data_visual_dict.get('corrosion_remark', "")

                ws['A46'] = "7";  ws['B46'] = "Check Oil and Grease"
                ws['M46'] = self.data_visual_dict.get('oil_grease_check', "")
                ws['O46'] = self.data_visual_dict.get('oil_grease_remark', "")

                ws['A47'] = "8";  ws['B47'] = "Check Painting"
                ws['M47'] = self.data_visual_dict.get('painting_check', "")
                ws['O47'] = self.data_visual_dict.get('painting_remark', "")

                ws['A48'] = "9";  ws['B48'] = "Check Cleanness"
                ws['M48'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O48'] = self.data_visual_dict.get('cleanness_remark', "")

                ws['A49'] = "10"; ws['B49'] = "Check Air Filter Condense"
                ws['M49'] = self.data_visual_dict.get('air_filter_condense_check', "")
                ws['O49'] = self.data_visual_dict.get('air_filter_condense_remark', "")

                ws['A50'] = "11"; ws['B50'] = "Check Mechanical"
                ws['M50'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O50'] = self.data_visual_dict.get('mechanical_remark', "")

                ws['A51'] = "12"; ws['B51'] = "Check Coupling"
                ws['M51'] = self.data_visual_dict.get('coupling_check', "")
                ws['O51'] = self.data_visual_dict.get('coupling_remark', "")

                ws['A52'] = "13"; ws['B52'] = "Check Gap"
                ws['M52'] = self.data_visual_dict.get('gap_check', "")
                ws['O52'] = self.data_visual_dict.get('gap_remark', "")

                ws['A53'] = "14"; ws['B53'] = "Check Seal"
                ws['M53'] = self.data_visual_dict.get('seal_check', "")
                ws['O53'] = self.data_visual_dict.get('seal_remark', "")

                ws['A54'] = "15"; ws['B54'] = "Check Rotate Hand"
                ws['M54'] = self.data_visual_dict.get('rotate_hand_check', "")
                ws['O54'] = self.data_visual_dict.get('rotate_hand_remark', "")

                ws['A55'] = "16"; ws['B55'] = "Check Other Leakage"
                ws['M55'] = self.data_visual_dict.get('other_leakage_check', "")
                ws['O55'] = self.data_visual_dict.get('other_leakage_remark', "")

                ws['A56'] = "17"; ws['B56'] = "Check Non Return Valve"
                ws['M56'] = self.data_visual_dict.get('non_re_valve_check', "")
                ws['O56'] = self.data_visual_dict.get('non_re_valve_remark', "")

                ws['V50'] = "11"; ws['W50'] = "Check Noise"
                ws['AI50'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK50'] = self.data_visual_dict.get('noise_run_remark', "")

                ws['V51'] = "12"; ws['W51'] = "Check Leakage"
                ws['AI51'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK51'] = self.data_visual_dict.get('leakage_run_remark', "")

                ws['V52'] = "13"; ws['W52'] = "Check Cavitation"
                ws['AI52'] = self.data_visual_dict.get('cavitation_run_check', "")
                ws['AK52'] = self.data_visual_dict.get('cavitation_run_remark', "")

    
    def map_sheet_two(self):
        ws = self.wb.worksheets[1]

        ws['U19']  = self.data_cal_dict.get('diff_pres_ope', "")
        ws['AA19'] = self.data_cal_dict.get('head_ope', "")
        ws['AF19'] = self.data_cal_dict.get('flow_ope', "")
        ws['AJ19'] = self.data_result_dict.get('range_30_110_result', "")
        ws['AJ22'] = f"{self.data_result_dict.get('range_30_110_suggest', '')} {self.data_result_dict.get('range_30_110_remark', '')}".strip()

        ws['Z25']  = self.data_result_dict.get('pump_standard_result', "")
        ws['AL25'] = f"{self.data_result_dict.get('pump_standard_suggest', '')} {self.data_result_dict.get('pump_standard_remark', '')}".strip()

        ws['U32']  = self.data_cal_dict.get('suction_pres_ope', "")
        ws['AA32'] = self.pump_data.get('vapor_pressure', "")
        ws['AF32'] = self.data_cal_dict.get('npsha_actual', "")
        ws['AJ32'] = self.data_result_dict.get('npshr_npsha_result', "")
        ws['U36']  = self.data_cal_dict.get('npsha', "")
        ws['AA36'] = self.pump_data.get('vapor_pressure', "")
        ws['AF36'] = self.data_result_dict.get('npshr_npsha_remark', "")
        ws['AJ36'] = self.data_result_dict.get('npshr_npsha_suggest', "")

        ws['A41']  = "1"
        ws['C41']  = self.data_cal_dict.get('flow_ope', "")
        ws['G41']  = self.data_cal_dict.get('head_ope', "")
        ws['J41']  = self.data_cal_dict.get('hyd_power_measure', "")
        ws['O41']  = self.data_cal_dict.get('i_avg_ope', "")
        ws['S41']  = self.data_cal_dict.get('v_avg_ope', "")
        ws['W41']  = self.data_cal_dict.get('motor_power', "")
        ws['Z41']  = self.data_result_dict.get('power_result', "")
        ws['AH41'] = self.data_result_dict.get('power_remark', "")

        updated_at = self.report_check_data.get('updated_at')
        ws['A47']  = f"{updated_at:%Y-%m-%d %H:%M:%S}" if updated_at else ""
        ws['E47']  = self.data_result_dict.get('v_pump_suggest', "")
        ws['M47']  = self.data_result_dict.get('v_pump_remark', "")
        ws['U47']  = self.data_result_dict.get('v_motor_suggest', "")
        ws['AG47'] = self.data_result_dict.get('v_motor_remark', "")

    def map_sheet_three(self):
        ws = self.wb.worksheets[2]

        ws['H16']  = self.data_cal_dict.get('insulation_winding_ux', "")
        ws['W16']  = self.data_cal_dict.get('insulation_winding_vy', "")
        ws['AL16'] = self.data_cal_dict.get('insulation_winding_wz', "")
