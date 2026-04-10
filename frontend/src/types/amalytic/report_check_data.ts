export interface ReportCheckCalResponse {
    range_30_110_result : string
    npshr_npsha_result : string
    pump_standard_result : string
    power_result : string
    fluid_temp_result : string
    bearing_temp_result : string
}

export interface ReportCheckFileCreateOut {
    report_detail ?: string | undefined
    remark ?: string | undefined
}

export interface MarsEquipmentDataOut {
    node_code : string
    node_id : string
    data_index : number
    start_time : string
    end_time : string
}

export interface MarsMeasureDataOut {
    node_code : string
    node_id : string
    data_index : number
    start_time : string
    end_time : string
    page_index : number
    page_size : number
}

export interface MarsWaveDataOut {
    node_code : string
    node_id : string
    data_index : number
    time : string
}

export interface EngineerReportCheckVisual {
    check_visual_id : string
    check_id : string

    axial_hand_check : string
    axial_hand_remark : string
    electricity_check : string
    electricity_remark : string
    service_check : string
    service_remark : string
    leakage_check : string
    leakage_remark : string


    oil_grease_run_check : string
    oil_grease_run_remark : string
    mechanical_run_check : string
    mechanical_run_remark : string
    corrosion_run_check : string
    corrosion_run_remark : string
    suction_valve_run_check : string
    suction_valve_run_remark : string
    discharge_valve_run_check : string
    discharge_valve_run_remark : string
    painting_run_check : string
    painting_run_remark : string
    electric_connectivity_run_check : string
    electric_connectivity_run_remark : string
    service_piping_run_check : string
    service_piping_run_remark : string
    bolt_nut_run_check : string
    bolt_nut_run_remark : string
    barrier_fluid_run_pres_check : string
    barrier_fluid_run_pres_remark : string
    remarks_check : string

    bolt_check : string
    bolt_remark : string
    electrical_check : string
    electrical_remark : string
    corrosion_check : string
    corrosion_remark : string
    oil_grease_check : string
    oil_grease_remark : string
    oil_check : string
    oil_remark : string
    painting_check : string
    painting_remark : string
    cleanness_check : string
    cleanness_remark : string
    chemical_clogging_check : string
    chemical_clogging_remark : string
    suction_valve_check : string
    suction_valve_remark : string
    discharge_valve_check : string
    discharge_valve_remark : string
    hydraulic_air_check : string
    hydraulic_air_remark : string
    air_supply_check : string
    air_supply_remark : string
    air_filter_check : string
    air_filter_remark : string
    air_filter_condense_check : string
    air_filter_condense_remark : string
    mechanical_check : string
    mechanical_remark : string
    coupling_check : string
    coupling_remark : string
    gap_check : string
    gap_remark : string
    seal_check : string
    seal_remark : string
    alignment_check : string
    alignment_remark : string
    rotate_hand_check : string
    rotate_hand_remark : string
    rotating_check : string
    rotating_remark : string
    noise_check : string
    noise_remark : string
    impeller_stutter_check : string
    impeller_stutter_remark : string
    other_leakage_check : string
    other_leakage_remark : string
    non_re_valve_check : string
    non_re_valve_remark : string


    noise_run_check : string
    noise_run_remark : string
    oil_run_check : string
    oil_run_remark : string
    leakage_run_check : string
    leakage_run_remark : string
    cavitation_run_check : string
    cavitation_run_remark : string
}