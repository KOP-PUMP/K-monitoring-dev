export interface ReportCheckCalResponse {
    range_30_110_result : string
    npshr_npsha_result : string
    pump_standard_result : string
    power_result : string
    fulid_temp_result : string
    bearing_temp_result : string
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