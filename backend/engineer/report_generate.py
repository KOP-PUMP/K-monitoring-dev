from datetime import datetime

class ReportMapper:
    def __init__(self, wb, pump_data, report_check_data, data_cal_dict, data_vibe_dict, data_visual_dict, data_result_dict):
        self.wb = wb
        self.pump_data = pump_data
        self.report_check_data = report_check_data
        self.data_cal_dict = data_cal_dict
        self.data_vibe_dict = data_vibe_dict
        self.data_visual_dict = self.data_visual_dict
        self.data_result_dict = data_result_dict
        self.today = datetime.now().strftime("%Y-%m-%d")
    
    def map_all(self):
        self.map_sheet_common_headers()
        self.map_sheet_one()
        # Call other mapping functions for sheet 2 and sheet 3 if needed
        
    def map_sheet_common_headers(self):
        sheets_to_update = [self.wb.worksheets[0], self.wb.worksheets[1], self.wb.worksheets[2]]
        
        for sheet in sheets_to_update:
            sheet['G6'] = self.pump_data.get('company_name_en', "")
            sheet['G7'] = self.pump_data.get('company_name_en', "")
            sheet['G8'] = self.pump_data.get('pump_brand', "")
            sheet['G9'] = self.pump_data.get('motor_brand', "")
            sheet['G10'] = self.pump_data.get('suggest_motor', "")
            sheet['Q10'] = self.pump_data.get('voltage', "")
            sheet['U8'] = self.pump_data.get('pump_model', "")
            sheet['U9'] = self.pump_data.get('motor_model', "")
            sheet['AJ7'] = self.pump_data.get('tag_no', "")
            sheet['AJ8'] = self.pump_data.get('serial_no', "")
            sheet['AJ9'] = self.pump_data.get('motor_serial_no', "")
            sheet['AE10'] = self.pump_data.get('pump_stage', "")
            sheet['AL10'] = self.pump_data.get('pump_speed', "")
            sheet['AJ6'] = self.today
            
    def map_sheet_one(self):
        ws = self.wb.worksheets[0]
        updated_at = self.report_check_data.get('updated_at')
        
        #Vibration check
        ws['A28'] = f"{updated_at:%Y-%m-%d %H:%M:%S}" if updated_at else ""
        ws['E28'] = self.data_vibe_dict.get('temp_pump_nde', "")
        ws['I28'] = self.data_vibe_dict.get('temp_pump_de', "")
        ws['M28'] = self.data_vibe_dict.get('temp_motor_de', "")
        ws['Q28'] = self.data_vibe_dict.get('temp_motor_nde', "")
        
        ws['U28'] = self.data_vibe_dict.get('v_pump_nde_h', "")
        ws['W28'] = self.data_vibe_dict.get('v_pump_nde_v', "")
        ws['Y28'] = self.data_vibe_dict.get('v_pump_nde_a', "")
        ws['AA28'] = self.data_vibe_dict.get('v_pump_de_h', "")
        ws['AC28'] = self.data_vibe_dict.get('v_pump_de_v', "")
        ws['AE28'] = self.data_vibe_dict.get('v_pump_de_a', "")
        ws['AG28'] = self.data_vibe_dict.get('v_motor_de_h', "")
        ws['AI28'] = self.data_vibe_dict.get('v_motor_de_v', "")
        ws['AK28'] = self.data_vibe_dict.get('v_motor_de_a', "")
        ws['AM28'] = self.data_vibe_dict.get('v_motor_nde_h', "")
        ws['AO28'] = self.data_vibe_dict.get('v_motor_nde_v', "")
        ws['AQ28'] = self.data_vibe_dict.get('v_motor_nde_a', "")
        
        #Information data
        ws['H32'] = self.pump_data.get('media_name', "")
        ws['AF32'] = self.pump_data.get('media_viscosity', "")
        ws['AP32'] = self.pump_data.get('media_viscosity_unit', "")
        ws['H33'] = self.pump_data.get('media_density', "")
        ws['T33'] = self.pump_data.get('media_density_unit', "")
        ws['AP33'] = self.pump_data.get('suction_pipe_id', "")
        ws['AF33'] = self.pump_data.get('suction_pipe_id_unit', "")
        ws['AF34'] = self.pump_data.get('discharge_pipe_id', "")
        ws['AP34'] = self.pump_data.get('discharge_pipe_id_unit', "")
        ws['H34'] = self.data_cal_dict.get('bearing_housing_temp', "")
        ws['T34'] = self.data_cal_dict.get('bearing_housing_temp_unit', "")
        ws['H35'] = self.data_cal_dict.get('current_i1_ope', "")
        ws['N35'] = self.data_cal_dict.get('current_i1_ope_unit', "")
        ws['W35'] = self.data_cal_dict.get('current_i2_ope', "")
        ws['AC35'] = self.data_cal_dict.get('current_i2_ope_unit', "")
        ws['AL35'] = self.data_cal_dict.get('current_i3_ope', "")
        ws['AC35'] = self.data_cal_dict.get('current_i3_ope_unit', "")
        
        pump_type = self.pump_data.get("pump_type_name", "")
        
        #pump stop condition
        ws['A43'] = "1"
        ws['B43'] = "Check Axial hand"
        ws['M43'] = self.data_visual_dict.get('axial_hand_check', "")
        ws['O43'] = self.data_visual_dict.get('axial_hand_remark', "")
        
        ws['A44'] = "2"
        ws['B44'] = "Check Electricity"
        ws['M44'] = self.data_visual_dict.get('electricity_check', "")
        ws['O44'] = self.data_visual_dict.get('electricity_remark', "")
        
        ws['A45'] = "3"
        ws['B45'] = "Check Service"
        ws['M45'] = self.data_visual_dict.get('service_check', "")
        ws['O45'] = self.data_visual_dict.get('service_remark', "")
        
        ws['A46'] = "4"
        ws['B46'] = "Check Leakage"
        ws['M46'] = self.data_visual_dict.get('leakage_check', "")
        ws['O46'] = self.data_visual_dict.get('leakage_remark', "")
        
        #pump running condition   
        ws['V43'] = "1"
        ws['W43'] = "Check Oil and Grease"
        ws['AI43'] = self.data_visual_dict.get('oil_grease_run_check', "")
        ws['AK43'] = self.data_visual_dict.get('oil_grease_run_remark', "")
        
        ws['V44'] = "2"
        ws['W44'] = "Check Mechanical"
        ws['AI44'] = self.data_visual_dict.get('mechanical_run_check', "")
        ws['AK44'] = self.data_visual_dict.get('mechanical_run_remark', "")
        
        ws['V45'] = "3"
        ws['W45'] = "Check Corrosion"
        ws['AI45'] = self.data_visual_dict.get('corrosion_run_check', "")
        ws['AK45'] = self.data_visual_dict.get('corrosion_run_remark', "")
        
        ws['V46'] = "4"
        ws['W46'] = "Check Suction Valve"
        ws['AI46'] = self.data_visual_dict.get('suction_valve_run_check', "")
        ws['AK46'] = self.data_visual_dict.get('suction_valve_run_remark', "")
    
        ws['V47'] = "5"
        ws['W47'] = "Check Discharge Valve"
        ws['AI47'] = self.data_visual_dict.get('discharge_valve_run_check', "")
        ws['AK47'] = self.data_visual_dict.get('discharge_valve_run_remark', "")
        
        ws['V48'] = "6"
        ws['W48'] = "Check Painting"
        ws['AI48'] = self.data_visual_dict.get('painting_run_check', "")
        ws['AK48'] = self.data_visual_dict.get('painting_run_remark', "")
        
        ws['V49'] = "7"
        ws['W49'] = "Check Electric Connectivity"
        ws['AI49'] = self.data_visual_dict.get('electric_connectivity_run_check', "")
        ws['AK49'] = self.data_visual_dict.get('electric_connectivity_run_remark', "")
        
        ws['V50'] = "8"
        ws['W50'] = "Check Service Piping"
        ws['AI50'] = self.data_visual_dict.get('service_piping_run_check', "")
        ws['AK50'] = self.data_visual_dict.get('service_piping_run_remark', "")
        
        ws['V51'] = "9"
        ws['W51'] = "Check Bolt and Nut"
        ws['AI51'] = self.data_visual_dict.get('bolt_nut_run_check', "")  
        ws['AK51'] = self.data_visual_dict.get('bolt_nut_run_remark', "")
        
        ws['V52'] = "10"
        ws['W52'] = "Check Barrier Fluid Pressure"
        ws['AI52'] = self.data_visual_dict.get('barrier_fluid_run_pres_check', "")
        ws['AK52'] = self.data_visual_dict.get('barrier_fluid_run_pres_remark', "")
        
        #For other visual check based on pump type
        match pump_type:
            case "Agitator":
                #pump stop condition
                ws['A47'] = "5"
                ws['B47'] = "Check Bolt"
                ws['M47'] = self.data_visual_dict.get('bolt_check', "")
                ws['O47'] = self.data_visual_dict.get('bolt_remark', "")
                
                ws['A48'] = "6"
                ws['B48'] = "Check Corrosion"
                ws['M48'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O48'] = self.data_visual_dict.get('corrosion_remark', "")
                
                ws['A49'] = "7"
                ws['B49'] = "Check Oil and Grease"
                ws['M49'] = self.data_visual_dict.get('oil_grease_check', "")
                ws['O49'] = self.data_visual_dict.get('oil_grease_remark', "")
                
                ws['A50'] = "8"
                ws['B50'] = "Check Painting"
                ws['M50'] = self.data_visual_dict.get('painting_check', "")
                ws['O50'] = self.data_visual_dict.get('painting_remark', "")
                
                ws['A51'] = "9"
                ws['B51'] = "Check Cleanness"
                ws['M51'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O51'] = self.data_visual_dict.get('cleanness_remark', "")
                
                ws['A52'] = "10"
                ws['B52'] = "Check Chemical Clogging"
                ws['M52'] = self.data_visual_dict.get('chemical_clogging_check', "")
                ws['O52'] = self.data_visual_dict.get('chemical_clogging_remark', "")
                
                ws['A53'] = "11"
                ws['B53'] = "Check Mechanical"
                ws['M53'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O53'] = self.data_visual_dict.get('mechanical_remark', "")
                
                ws['A54'] = "12"
                ws['B54'] = "Check Coupling"
                ws['M54'] = self.data_visual_dict.get('coupling_check', "")
                ws['O54'] = self.data_visual_dict.get('coupling_remark', "")
                
                ws['A56'] = "13"
                ws['B56'] = "Check Seal"
                ws['M56'] = self.data_visual_dict.get('seal_check', "")
                ws['O56'] = self.data_visual_dict.get('seal_remark', "")
                
                ws['A57'] = "14"
                ws['B57'] = "Check Impeller Stutter"
                ws['M57'] = self.data_visual_dict.get('impeller_stutter_check', "")
                ws['O57'] = self.data_visual_dict.get('impeller_stutter_remark', "")
                
                #pump start condition
                ws['V53'] = "11"
                ws['W53'] = "Check Noise"
                ws['AI53'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK53'] = self.data_visual_dict.get('noise_run_remark', "")
                
                ws['V54'] = "12"
                ws['W54'] = "Check Leakage"
                ws['AI54'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK54'] = self.data_visual_dict.get('leakage_run_remark', "")
                
            case "Centrifugal" | "Gear" | "Have":
                #pump stop condition
                ws['A47'] = "5"
                ws['B47'] = "Check Bolt"
                ws['M47'] = self.data_visual_dict.get('bolt_check', "")
                ws['O47'] = self.data_visual_dict.get('bolt_remark', "")
                
                ws['A48'] = "6"
                ws['B48'] = "Check Corrosion"
                ws['M48'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O48'] = self.data_visual_dict.get('corrosion_remark', "")
                
                ws['A49'] = "7"
                ws['B49'] = "Check Oil and Grease"
                ws['M49'] = self.data_visual_dict.get('oil_grease_check', "")
                ws['O49'] = self.data_visual_dict.get('oil_grease_remark', "")
                
                ws['A50'] = "8"
                ws['B50'] = "Check Painting"
                ws['M50'] = self.data_visual_dict.get('painting_check', "")
                ws['O50'] = self.data_visual_dict.get('painting_remark', "")
                
                ws['A51'] = "9"
                ws['B51'] = "Check Cleanness"
                ws['M51'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O51'] = self.data_visual_dict.get('cleanness_remark', "")
                
                ws['A53'] = "10"
                ws['B53'] = "Check Mechanical"
                ws['M53'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O53'] = self.data_visual_dict.get('mechanical_remark', "")
                
                ws['A54'] = "11"
                ws['B54'] = "Check Coupling"
                ws['M54'] = self.data_visual_dict.get('coupling_check', "")
                ws['O54'] = self.data_visual_dict.get('coupling_remark', "")
                
                ws['A55'] = "12"
                ws['B55'] = "Check Gap"
                ws['M55'] = self.data_visual_dict.get('gap_check', "")
                ws['O55'] = self.data_visual_dict.get('gap_remark', "")
                
                ws['A56'] = "13"
                ws['B56'] = "Check Seal"
                ws['M56'] = self.data_visual_dict.get('seal_check', "")
                ws['O56'] = self.data_visual_dict.get('seal_remark', "")
                
                ws['A57'] = "14"
                ws['B57'] = "Check Alignment"
                ws['M57'] = self.data_visual_dict.get('alignment_check', "")
                ws['O57'] = self.data_visual_dict.get('alignment_remark', "")
                
                ws['A58'] = "15"
                ws['B58'] = "Check Rotate Hand"
                ws['M58'] = self.data_visual_dict.get('rotate_hand_check', "")
                ws['O58'] = self.data_visual_dict.get('rotate_hand_remark', "")
                
                #pump start condition
                ws['V53'] = "11"
                ws['W53'] = "Check Noise"
                ws['AI53'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK53'] = self.data_visual_dict.get('noise_run_remark', "")
                
                ws['V54'] = "12"
                ws['W54'] = "Check Leakage"
                ws['AI54'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK54'] = self.data_visual_dict.get('leakage_run_remark', "")
                
                ws['V55'] = "13"
                ws['W55'] = "Check Cavitation"
                ws['AI55'] = self.data_visual_dict.get('cavitation_run_check', "")
                ws['AK55'] = self.data_visual_dict.get('cavitation_run_remark', "")
            case "Metering Hydraulic":
                #pump stop condition
                ws['A47'] = "5"
                ws['B47'] = "Check Bolt"
                ws['M47'] = self.data_visual_dict.get('bolt_check', "")
                ws['O47'] = self.data_visual_dict.get('bolt_remark', "")
                
                ws['A48'] = "6"
                ws['B48'] = "Check Corrosion"
                ws['M48'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O48'] = self.data_visual_dict.get('corrosion_remark', "")
                
                ws['A50'] = "8"
                ws['B50'] = "Check Painting"
                ws['M50'] = self.data_visual_dict.get('painting_check', "")
                ws['O50'] = self.data_visual_dict.get('painting_remark', "")
                
                ws['A51'] = "9"
                ws['B51'] = "Check Cleanness"
                ws['M51'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O51'] = self.data_visual_dict.get('cleanness_remark', "")
                
                ws['A52'] = "10"
                ws['B52'] = "Check Chemical Clogging"
                ws['M52'] = self.data_visual_dict.get('chemical_clogging_check', "")
                ws['O52'] = self.data_visual_dict.get('chemical_clogging_remark', "")
                
                ws['A53'] = "11"
                ws['B53'] = "Check Suction Valve"
                ws['M53'] = self.data_visual_dict.get('suction_valve_check', "")
                ws['O53'] = self.data_visual_dict.get('suction_valve_remark', "")
                
                ws['A54'] = "12"
                ws['B54'] = "Check Discharge Valve"
                ws['M54'] = self.data_visual_dict.get('discharge_valve_check', "")
                ws['O54'] = self.data_visual_dict.get('discharge_valve_remark', "")
                
                ws['A55'] = "13"
                ws['B55'] = "Check Hydraulic Air"
                ws['M55'] = self.data_visual_dict.get('hydraulic_air_check', "")
                ws['O55'] = self.data_visual_dict.get('hydraulic_air_remark', "")
                
                ws['A56'] = "14"
                ws['B56'] = "Check Seal"
                ws['M56'] = self.data_visual_dict.get('seal_check', "")
                ws['O56'] = self.data_visual_dict.get('seal_remark', "")
                
                #pump start condition
                ws['V53'] = "11"
                ws['W53'] = "Check Noise"
                ws['AI53'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK53'] = self.data_visual_dict.get('noise_run_remark', "")
                
                ws['V54'] = "12"
                ws['W54'] = "Check Leakage"
                ws['AI54'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK54'] = self.data_visual_dict.get('leakage_run_remark', "")
                
                ws['V55'] = "13"
                ws['W55'] = "Check Cavitation"
                ws['AI55'] = self.data_visual_dict.get('cavitation_run_check', "")
                ws['AK55'] = self.data_visual_dict.get('cavitation_run_remark', "")
                    
            case "Metering Mechanical":
                #pump stop condition
                ws['A47'] = "5"
                ws['B47'] = "Check Bolt"
                ws['M47'] = self.data_visual_dict.get('bolt_check', "")
                ws['O47'] = self.data_visual_dict.get('bolt_remark', "")
                
                ws['A48'] = "6"
                ws['B48'] = "Check Corrosion"
                ws['M48'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O48'] = self.data_visual_dict.get('corrosion_remark', "")
                
                ws['A50'] = "8"
                ws['B50'] = "Check Painting"
                ws['M50'] = self.data_visual_dict.get('painting_check', "")
                ws['O50'] = self.data_visual_dict.get('painting_remark', "")
                
                ws['A51'] = "9"
                ws['B51'] = "Check Cleanness"
                ws['M51'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O51'] = self.data_visual_dict.get('cleanness_remark', "")
                
                ws['A52'] = "10"
                ws['B52'] = "Check Chemical Clogging"
                ws['M52'] = self.data_visual_dict.get('chemical_clogging_check', "")
                ws['O52'] = self.data_visual_dict.get('chemical_clogging_remark', "")
                
                ws['A53'] = "11"
                ws['B53'] = "Check Suction Valve"
                ws['M53'] = self.data_visual_dict.get('suction_valve_check', "")
                ws['O53'] = self.data_visual_dict.get('suction_valve_remark', "")
                
                ws['A54'] = "12"
                ws['B54'] = "Check Discharge Valve"
                ws['M54'] = self.data_visual_dict.get('discharge_valve_check', "")
                ws['O54'] = self.data_visual_dict.get('discharge_valve_remark', "")
                
                ws['A55'] = "13"
                ws['B55'] = "Check Hydraulic Air"
                ws['M55'] = self.data_visual_dict.get('hydraulic_air_check', "")
                ws['O55'] = self.data_visual_dict.get('hydraulic_air_remark', "")
                
                ws['A56'] = "14"
                ws['B56'] = "Check Seal"
                ws['M56'] = self.data_visual_dict.get('seal_check', "")
                ws['O56'] = self.data_visual_dict.get('seal_remark', "")
                
                #pump start condition
                ws['V53'] = "11"
                ws['W53'] = "Check Noise"
                ws['AI53'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK53'] = self.data_visual_dict.get('noise_run_remark', "")
                
                ws['V54'] = "12"
                ws['W54'] = "Check Leakage"
                ws['AI54'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK54'] = self.data_visual_dict.get('leakage_run_remark', "")
                
                ws['V55'] = "13"
                ws['W55'] = "Check Cavitation"
                ws['AI55'] = self.data_visual_dict.get('cavitation_run_check', "")
                ws['AK55'] = self.data_visual_dict.get('cavitation_run_remark', "")
                
            case "Submersible":
                #pump stop condition
                ws['A47'] = "5"
                ws['B47'] = "Check Electrical"
                ws['M47'] = self.data_visual_dict.get('electrical_check', "")
                ws['O47'] = self.data_visual_dict.get('electrical_remark', "")
                ws['A48'] = "6"
                ws['B48'] = "Check Corrosion"
                ws['M48'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O48'] = self.data_visual_dict.get('corrosion_remark', "")
                
                ws['A49'] = "7"
                ws['B49'] = "Check Cleanness"
                ws['M49'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O49'] = self.data_visual_dict.get('cleanness_remark', "")
                
                ws['A50'] = "8"
                ws['B50'] = "Check Mechanical"
                ws['M50'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O50'] = self.data_visual_dict.get('mechanical_remark', "")
                 
            case "Vacuum":
                #pump stop condition
                ws['A47'] = "5"
                ws['B47'] = "Check Bolt"
                ws['M47'] = self.data_visual_dict.get('bolt_check', "")
                ws['O47'] = self.data_visual_dict.get('bolt_remark', "")
                
                ws['A48'] = "6"
                ws['B48'] = "Check Corrosion"
                ws['M48'] = self.data_visual_dict.get('corrosion_check', "")
                ws['O48'] = self.data_visual_dict.get('corrosion_remark', "")
                
                ws['A49'] = "7"
                ws['B49'] = "Check Oil and Grease"
                ws['M49'] = self.data_visual_dict.get('oil_grease_check', "")
                ws['O49'] = self.data_visual_dict.get('oil_grease_remark', "")
                
                ws['A50'] = "8"
                ws['B50'] = "Check Painting"
                ws['M50'] = self.data_visual_dict.get('painting_check', "")
                ws['O50'] = self.data_visual_dict.get('painting_remark', "")
                
                ws['A51'] = "9"
                ws['B51'] = "Check Cleanness"
                ws['M51'] = self.data_visual_dict.get('cleanness_check', "")
                ws['O51'] = self.data_visual_dict.get('cleanness_remark', "")
                
                ws['A52'] = "10"
                ws['B52'] = "Check Air Filter Condense"
                ws['M52'] = self.data_visual_dict.get('air_filter_condense_check', "")
                ws['O52'] = self.data_visual_dict.get('air_filter_condense_remark', "")
                
                ws['A53'] = "11"
                ws['B53'] = "Check Mechanical"
                ws['M53'] = self.data_visual_dict.get('mechanical_check', "")
                ws['O53'] = self.data_visual_dict.get('mechanical_remark', "")
                
                ws['A54'] = "12"
                ws['B54'] = "Check Coupling"
                ws['M54'] = self.data_visual_dict.get('coupling_check', "")
                ws['O54'] = self.data_visual_dict.get('coupling_remark', "")
                
                ws['A55'] = "13"
                ws['B55'] = "Check Gap"
                ws['M55'] = self.data_visual_dict.get('gap_check', "")
                ws['O55'] = self.data_visual_dict.get('gap_remark', "")
                
                ws['A56'] = "14"
                ws['B56'] = "Check Seal"
                ws['M56'] = self.data_visual_dict.get('seal_check', "")
                ws['O56'] = self.data_visual_dict.get('seal_remark', "")
                
                ws['A57'] = "15"
                ws['B57'] = "Check Rotate Hand"
                ws['M57'] = self.data_visual_dict.get('rotate_hand_check', "")
                ws['O57'] = self.data_visual_dict.get('rotate_hand_remark', "")
                
                ws['A58'] = "16"
                ws['B58'] = "Check Other Leakage"
                ws['M58'] = self.data_visual_dict.get('other_leakage_check', "")
                ws['O58'] = self.data_visual_dict.get('other_leakage_remark', "")
                
                ws['A59'] = "17"
                ws['B59'] = "Check Non Return Valve"
                ws['M59'] = self.data_visual_dict.get('non_re_valve_check', "")
                ws['O59'] = self.data_visual_dict.get('non_re_valve_remark', "")
                
                #pump start condition
                ws['V53'] = "11"
                ws['W53'] = "Check Noise"
                ws['AI53'] = self.data_visual_dict.get('noise_run_check', "")
                ws['AK53'] = self.data_visual_dict.get('noise_run_remark', "")
                
                ws['V54'] = "12"
                ws['W54'] = "Check Leakage"
                ws['AI54'] = self.data_visual_dict.get('leakage_run_check', "")
                ws['AK54'] = self.data_visual_dict.get('leakage_run_remark', "")
                
                ws['V55'] = "13"
                ws['W55'] = "Check Cavitation"
                ws['AI55'] = self.data_visual_dict.get('cavitation_run_check', "")
                ws['AK55'] = self.data_visual_dict.get('cavitation_run_remark', "")
                
    def map_sheet_two(self):
        ws = self.wb.worksheets[1]
        
        ws['U19'] = self.data_cal_dict.get('diff_pres_ope', "")
        ws['AA'] = self.data_cal_dict.get('head_ope',"")
        ws['AF19'] = self.data_cal_dict.get('flow_ope', "")
        ws['AJ19'] = self.data_result_dict.get('pump_standard_result', "")
        ws['AJ23'] = f"{self.data_result_dict.get('pump_standard_suggest', "")} , {self.data_result_dict.get('pump_standard_remark', "")}"
                