import { createFileRoute } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { HeadFlowGraph } from "@/components/chart/HeadFlowGraph";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChevronDown, Gauge } from "lucide-react";
import pumpImage from "/pump_img/36 125X100-400 C34 XXD.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetPumpDetail } from "@/hook/pump/pump";
import { useEffect, useState } from "react";
import { useGetCalPumpData } from "@/hook/factory_curve/factory_curve";

const PumpDetail = () => {
  const { id } = useSearch({ from: "/_auth/pump/pump_detail" });
  const { data: pumpDetail } = useGetPumpDetail(id);
  const { mutate, isPending, isError } = useGetCalPumpData();
  const [pumpDetailCalData, setPumpDetailCalData] = useState<any>();

  useEffect(() => {
    if (pumpDetail) {
      const calData = {
        pump_lov_id: pumpDetail?.pump_lov_id,
        design_impeller_dia: pumpDetail?.design_impeller_dia,
        pump_model: pumpDetail?.pump_model,
        pump_model_size: pumpDetail?.pump_model_size,
        pump_speed: pumpDetail?.pump_speed,
        pump_speed_unit: pumpDetail?.pump_speed_unit,
        design_flow: pumpDetail?.design_flow,
        design_flow_unit: pumpDetail?.design_flow_unit,
        design_head: pumpDetail?.design_head,
        design_head_unit: pumpDetail?.design_head_unit,
        media_name: pumpDetail?.media_name,
        media_density: pumpDetail?.media_density,
        media_density_unit: pumpDetail?.media_density_unit,
      };

      mutate(calData, {
        onSuccess: (data) => {
          setPumpDetailCalData(data);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    }
  }, [pumpDetail]);

  return (
    <div className="flex-1 space-y-4 px-4 sm:p-8 sm:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pump Detail</h2>
        <div className="flex items-center justify-start space-x-2">
          <Link to="/pump/total_pump">Back</Link>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
        <img
          src={pumpImage}
          alt="pump image"
          className="w-full lg:w-[400px] rounded-xl object-contain"
        />
        <Card className="w-full xs:max-w-[500px] flex flex-col justify-between">
          <CardHeader className="flex w-full justify-between">
            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-lg font-extrabold">Current Pump Status</h3>
                <h4 className="text-muted-foreground text-xs">
                  Model : {pumpDetail?.pump_model ?? "-"}
                </h4>
              </div>
              <Gauge />
            </div>
          </CardHeader>
          <CardContent className="font-bold text-green-500 w-full text-center text-4xl">
            Good
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Last check : 7 day ago
          </CardFooter>
        </Card>
      </div>

      {/* General Detail */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">General detail</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {pumpDetail ? (
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  <label htmlFor="code_name" className="w-[200px]">Code Name</label>
                  <Input id="code_name" value={pumpDetail?.pump_code_name ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="brand" className="w-[200px]">Brand</label>
                  <Input id="brand" value={pumpDetail?.pump_brand ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="model" className="w-[200px]">Model</label>
                  <Input id="model" value={pumpDetail?.pump_model ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="model_size" className="w-[200px]">Model Size</label>
                  <Input id="model_size" value={pumpDetail?.pump_model_size ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="pump_design" className="w-[200px]">Design</label>
                  <Input id="pump_design" value={pumpDetail?.pump_design ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="pump_type_name" className="w-[200px]">Type</label>
                  <Input id="pump_type_name" value={pumpDetail?.pump_type_name ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="pump_standard" className="w-[200px]">Standard</label>
                  <Input id="pump_standard" value={pumpDetail?.pump_standard ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="pump_standard_no" className="w-[200px]">Standard No.</label>
                  <Input id="pump_standard_no" value={pumpDetail?.pump_standard_no ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="pump_stage" className="w-[200px]">Stage</label>
                  <Input id="pump_stage" value={pumpDetail?.pump_stage ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="base_plate" className="w-[200px]">Base Plate</label>
                  <Input id="base_plate" value={pumpDetail?.base_plate ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="company_code" className="w-[200px]">Company Code</label>
                  <Input id="company_code" value={pumpDetail?.company_code ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="company_name" className="w-[200px]">Company name</label>
                  <div className="flex flex-col gap-2 w-full">
                    <Input id="company_name_en" value={pumpDetail?.company_name_en ?? ""} className="h-6" readOnly />
                    <Input id="company_name_th" value={pumpDetail?.company_name_th ?? ""} className="h-6" readOnly />
                  </div>
                </div>
                <div className="flex gap-2">
                  <label htmlFor="company_address" className="w-[200px]">Address</label>
                  <div className="flex flex-col gap-2 w-full">
                    <Input id="address_en" value={pumpDetail?.address_en ?? ""} className="h-6" readOnly />
                    <Input id="address_th" value={pumpDetail?.address_th ?? ""} className="h-6" readOnly />
                  </div>
                </div>
                <div className="flex gap-2">
                  <label htmlFor="location" className="w-[200px]">Location</label>
                  <Input id="location" value={pumpDetail?.location ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="doc_customer" className="w-[200px]">Document</label>
                  <Input id="doc_customer" value={pumpDetail?.doc_customer ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="doc_no" className="w-[200px]">Document No.</label>
                  <Input id="doc_no" value={pumpDetail?.doc_no ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="tag_no" className="w-[200px]">Tag No.</label>
                  <Input id="tag_no" value={pumpDetail?.tag_no ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="serial_no" className="w-[200px]">Serial No.</label>
                  <Input id="serial_no" value={pumpDetail?.serial_no ?? ""} className="h-6" readOnly />
                </div>
              </CardContent>
            ) : (
              <CollapsibleContent className="flex items-center justify-center">
                <div className="p-4 w-full h-[100px] flex items-center justify-center">
                  Error data not found.
                </div>
              </CollapsibleContent>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Technical Data */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Pump Technical Data</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          {pumpDetailCalData ? (
            <CollapsibleContent>
              <CardContent className="flex flex-col gap-2 text-sm">
                <HeadFlowGraph
                  chartData={
                    pumpDetailCalData && [
                      ...pumpDetailCalData.desire_imp_curve_data,
                      ...pumpDetailCalData.efficiency_curve_data,
                      pumpDetailCalData.min_flow_point,
                      pumpDetailCalData.max_flow_point,
                      pumpDetailCalData.operation_point,
                      pumpDetailCalData.bep_point,
                    ]
                  }
                  scatter={false}
                  isLoading={isPending}
                  isError={isError}
                />
                <div className="flex gap-2">
                  <label htmlFor="max_temp" className="w-[200px]">Max Temperature (°C)</label>
                  <Input id="max_temp" value={pumpDetail?.max_temp ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="max_flow" className="w-[200px]">
                    Max Flow {pumpDetail?.max_flow_unit ? `(${pumpDetail.max_flow_unit})` : ""}
                  </label>
                  <Input id="max_flow" value={pumpDetail?.max_flow ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="pump_speed" className="w-[200px]">
                    Pump Speed {pumpDetail?.pump_speed_unit ? `(${pumpDetail.pump_speed_unit})` : ""}
                  </label>
                  <Input id="pump_speed" value={pumpDetail?.pump_speed ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="design_flow" className="w-[200px]">
                    Design Flow {pumpDetail?.design_flow_unit ? `(${pumpDetail.design_flow_unit})` : ""}
                  </label>
                  <Input id="design_flow" value={pumpDetail?.design_flow ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="design_head" className="w-[200px]">
                    Design Head {pumpDetail?.design_head_unit ? `(${pumpDetail.design_head_unit})` : ""}
                  </label>
                  <Input id="design_head" value={pumpDetail?.design_head ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="shut_off_head" className="w-[200px]">
                    Shut-off Head {pumpDetail?.shut_off_head_unit ? `(${pumpDetail.shut_off_head_unit})` : ""}
                  </label>
                  <Input id="shut_off_head" value={pumpDetail?.shut_off_head ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="min_head" className="w-[200px]">
                    Min Head {pumpDetail?.min_head_unit ? `(${pumpDetail.min_head_unit})` : ""}
                  </label>
                  <Input id="min_head" value={pumpDetail?.min_head ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="suction_velo" className="w-[200px]">
                    Suction Velocity {pumpDetail?.suction_velo_unit ? `(${pumpDetail.suction_velo_unit})` : ""}
                  </label>
                  <Input id="suction_velo" value={pumpDetail?.suction_velo ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="discharge_velo" className="w-[200px]">
                    Discharge Velocity {pumpDetail?.discharge_velo_unit ? `(${pumpDetail.discharge_velo_unit})` : ""}
                  </label>
                  <Input id="discharge_velo" value={pumpDetail?.discharge_velo ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="bep_head" className="w-[200px]">
                    Head Best Efficiency Point {pumpDetail?.bep_head_unit ? `(${pumpDetail.bep_head_unit})` : ""}
                  </label>
                  <Input id="bep_head" value={pumpDetail?.bep_head ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="bep_flow" className="w-[200px]">
                    Flow Best Efficiency Point {pumpDetail?.bep_flow_unit ? `(${pumpDetail.bep_flow_unit})` : ""}
                  </label>
                  <Input id="bep_flow" value={pumpDetail?.bep_flow ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="npshr" className="w-[200px]">
                    NPSHr {pumpDetail?.npshr_unit ? `(${pumpDetail.npshr_unit})` : ""}
                  </label>
                  <Input id="npshr" value={pumpDetail?.npshr ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="pump_efficiency" className="w-[200px]">
                    Pump Efficiency {pumpDetail?.pump_efficiency_unit ? `(${pumpDetail.pump_efficiency_unit})` : ""}
                  </label>
                  <Input id="pump_efficiency" value={pumpDetail?.pump_efficiency ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="hyd_power" className="w-[200px]">
                    Hydraulic {pumpDetail?.hyd_power_unit ? `(${pumpDetail.hyd_power_unit})` : ""}
                  </label>
                  <Input id="hyd_power" value={pumpDetail?.hyd_power ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="power_required_cal" className="w-[200px]">
                    Power Required {pumpDetail?.power_required_cal_unit ? `(${pumpDetail.power_required_cal_unit})` : ""}
                  </label>
                  <Input id="power_required_cal" value={pumpDetail?.power_required_cal ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="power_min_flow" className="w-[200px]">
                    Power Min {pumpDetail?.power_min_flow_unit ? `(${pumpDetail.power_min_flow_unit})` : ""}
                  </label>
                  <Input id="power_min_flow" value={pumpDetail?.power_min_flow ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="power_max_flow" className="w-[200px]">
                    Power Max {pumpDetail?.power_max_flow_unit ? `(${pumpDetail.power_max_flow_unit})` : ""}
                  </label>
                  <Input id="power_max_flow" value={pumpDetail?.power_max_flow ?? ""} className="h-6" readOnly />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="power_bep_flow" className="w-[200px]">
                    Power Best Efficiency Point {pumpDetail?.power_bep_flow_unit ? `(${pumpDetail.power_bep_flow_unit})` : ""}
                  </label>
                  <Input id="power_bep_flow" value={pumpDetail?.power_bep_flow ?? ""} className="h-6" readOnly />
                </div>
              </CardContent>
            </CollapsibleContent>
          ) : (
            <CollapsibleContent className="flex items-center justify-center">
              <div className="p-4 w-full h-[100px] flex items-center justify-center">
                Error data not found.
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </Card>

      {/* Application Data */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Pump Application Data</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="media_name" className="w-[200px]">Media</label>
                <Input id="media_name" value={pumpDetail?.media_name ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="operating_temperature" className="w-[200px]">Operation Temperature (°C)</label>
                <Input id="operating_temperature" value={pumpDetail?.operating_temperature ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="solid_type" className="w-[200px]">Solid Type</label>
                <Input id="solid_type" value={pumpDetail?.solid_type ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="solid_diameter" className="w-[200px]">Solid Diameter</label>
                <Input id="solid_diameter" value={pumpDetail?.solid_diameter ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="media_density" className="w-[200px]">
                  Density {pumpDetail?.media_density_unit ? `(${pumpDetail.media_density_unit})` : ""}
                </label>
                <Input id="media_density" value={pumpDetail?.media_density ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="media_viscosity" className="w-[200px]">
                  Viscosity {pumpDetail?.media_viscosity_unit ? `(${pumpDetail.media_viscosity_unit})` : ""}
                </label>
                <Input id="media_viscosity" value={pumpDetail?.media_viscosity ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="vapor_pressure" className="w-[200px]">
                  Vapor Pressure {pumpDetail?.vapor_pressure_unit ? `(${pumpDetail.vapor_pressure_unit})` : ""}
                </label>
                <Input id="vapor_pressure" value={pumpDetail?.vapor_pressure ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="tank_design" className="w-[200px]">Tank Design</label>
                <Input id="tank_design" value={pumpDetail?.tank_design ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="tank_position" className="w-[200px]">Tank Position</label>
                <Input id="tank_position" value={pumpDetail?.tank_position ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="tank_pressure" className="w-[200px]">Tank Pressure</label>
                <Input id="tank_pressure" value={pumpDetail?.tank_pressure ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_head" className="w-[200px]">
                  Suction Head {pumpDetail?.suction_head_unit ? `(${pumpDetail.suction_head_unit})` : ""}
                </label>
                <Input id="suction_head" value={pumpDetail?.suction_head ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="media_concentration_percentage" className="w-[200px]">Concentration (%)</label>
                <Input id="media_concentration_percentage" value={pumpDetail?.media_concentration_percentage ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="solid_percentage" className="w-[200px]">Solid Percentage (%)</label>
                <Input id="solid_percentage" value={pumpDetail?.solid_percentage ?? ""} className="h-6" readOnly />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Motor General Details */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Motor General Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="voltage" className="w-[200px]">
                  Voltage {pumpDetail?.voltage_unit ? `(${pumpDetail.voltage_unit})` : ""}
                </label>
                <Input id="voltage" value={pumpDetail?.voltage ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="suggest_motor" className="w-[200px]">Suggest Motor</label>
                <Input id="suggest_motor" value={pumpDetail?.suggest_motor ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_brand" className="w-[200px]">Motor Brand</label>
                <Input id="motor_brand" value={pumpDetail?.motor_brand ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_model" className="w-[200px]">Motor Model</label>
                <Input id="motor_model" value={pumpDetail?.motor_model ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_serial_no" className="w-[200px]">Motor Serial No.</label>
                <Input id="motor_serial_no" value={pumpDetail?.motor_serial_no ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_drive" className="w-[200px]">Motor Drive</label>
                <Input id="motor_drive" value={pumpDetail?.motor_drive ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_standard" className="w-[200px]">Motor Standard</label>
                <Input id="motor_standard" value={pumpDetail?.motor_standard ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_ie" className="w-[200px]">Motor IE</label>
                <Input id="motor_ie" value={pumpDetail?.motor_ie ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_speed" className="w-[200px]">
                  Motor Speed {pumpDetail?.motor_speed_unit ? `(${pumpDetail.motor_speed_unit})` : ""}
                </label>
                <Input id="motor_speed" value={pumpDetail?.motor_speed ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_rated" className="w-[200px]">
                  Motor Rated {pumpDetail?.motor_rated_unit ? `(${pumpDetail.motor_rated_unit})` : ""}
                </label>
                <Input id="motor_rated" value={pumpDetail?.motor_rated ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_factor" className="w-[200px]">Motor Factor</label>
                <Input id="motor_factor" value={pumpDetail?.motor_factor ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_connection" className="w-[200px]">Motor Connection</label>
                <Input id="motor_connection" value={pumpDetail?.motor_connection ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_phase" className="w-[200px]">Motor Phase</label>
                <Input id="motor_phase" value={pumpDetail?.motor_phase ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_efficiency" className="w-[200px]">
                  Motor Efficiency {pumpDetail?.motor_efficiency_unit ? `(${pumpDetail.motor_efficiency_unit})` : ""}
                </label>
                <Input id="motor_efficiency" value={pumpDetail?.motor_efficiency ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_rated_current" className="w-[200px]">
                  Motor Rated Current {pumpDetail?.motor_rated_current_unit ? `(${pumpDetail.motor_rated_current_unit})` : ""}
                </label>
                <Input id="motor_rated_current" value={pumpDetail?.motor_rated_current ?? ""} className="h-6" readOnly />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Material and Impeller Details */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4 text-start">Material and Impeller Details Group</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="casing_mat" className="w-[200px]">Casing Material</label>
                <Input id="casing_mat" value={pumpDetail?.casing_mat ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="casing_cover_mat" className="w-[200px]">Casing Cover Material</label>
                <Input id="casing_cover_mat" value={pumpDetail?.casing_cover_mat ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="liner_mat" className="w-[200px]">Liner Material</label>
                <Input id="liner_mat" value={pumpDetail?.liner_mat ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_impeller_type" className="w-[200px]">Impeller Type</label>
                <Input id="pump_impeller_type" value={pumpDetail?.pump_impeller_type ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="design_impeller_dia" className="w-[200px]">Impeller Diameter (mm)</label>
                <Input id="design_impeller_dia" value={pumpDetail?.design_impeller_dia ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_impeller_max_size" className="w-[200px]">Max Impeller Diameter (mm)</label>
                <Input id="pump_impeller_max_size" value={pumpDetail?.pump_impeller_max_size ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="impeller_mat" className="w-[200px]">Impeller Material</label>
                <Input id="impeller_mat" value={pumpDetail?.impeller_mat ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_base_mat" className="w-[200px]">Base Material</label>
                <Input id="pump_base_mat" value={pumpDetail?.pump_base_mat ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_head_mat" className="w-[200px]">Head Material</label>
                <Input id="pump_head_mat" value={pumpDetail?.pump_head_mat ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_head_cover_mat" className="w-[200px]">Head Cover Material</label>
                <Input id="pump_head_cover_mat" value={pumpDetail?.pump_head_cover_mat ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="stage_casing_diffuser_mat" className="w-[200px]">Stage Casing / Diffuser Material</label>
                <Input id="stage_casing_diffuser_mat" value={pumpDetail?.stage_casing_diffuser_mat ?? ""} className="h-6" readOnly />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Mechanical Seal Details */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Mechanical Seal Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="mechanical_seal_api_plan" className="w-[200px]">API Plan</label>
                <Input id="mechanical_seal_api_plan" value={pumpDetail?.mechanical_seal_api_plan ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="mech_main_temp" className="w-[200px]">Main Temperature (°C)</label>
                <Input id="mech_main_temp" value={pumpDetail?.mech_main_temp ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="mech_main_pre" className="w-[200px]">
                  Main Pressure {pumpDetail?.mech_main_pre_unit ? `(${pumpDetail.mech_main_pre_unit})` : ""}
                </label>
                <Input id="mech_main_pre" value={pumpDetail?.mech_main_pre ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="seal_cham" className="w-[200px]">Seal Chamber</label>
                <Input id="seal_cham" value={pumpDetail?.seal_cham ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_brand" className="w-[200px]">Shaft Seal Brand</label>
                <Input id="shaft_seal_brand" value={pumpDetail?.shaft_seal_brand ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_model" className="w-[200px]">Shaft Seal Model</label>
                <Input id="shaft_seal_model" value={pumpDetail?.shaft_seal_model ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="mech_size" className="w-[200px]">
                  Mechanical Seal Size {pumpDetail?.mech_size_unit ? `(${pumpDetail.mech_size_unit})` : ""}
                </label>
                <Input id="mech_size" value={pumpDetail?.mech_size ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_design" className="w-[200px]">Shaft Seal Design</label>
                <Input id="shaft_seal_design" value={pumpDetail?.shaft_seal_design ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_material" className="w-[200px]">Shaft Seal Material</label>
                <Input id="shaft_seal_material" value={pumpDetail?.shaft_seal_material ?? ""} className="h-6" readOnly />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Flange Details */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Flange Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="pump_suction_size" className="w-[200px]">Suction Size (mm)</label>
                <Input id="pump_suction_size" value={pumpDetail?.pump_suction_size ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_suction_rating" className="w-[200px]">Pump Suction Rating</label>
                <Input id="pump_suction_rating" value={pumpDetail?.pump_suction_rating ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_discharge_size" className="w-[200px]">Discharge Size (mm)</label>
                <Input id="pump_discharge_size" value={pumpDetail?.pump_discharge_size ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_discharge_rating" className="w-[200px]">Pump Discharge Rating</label>
                <Input id="pump_discharge_rating" value={pumpDetail?.pump_discharge_rating ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_pipe_size" className="w-[200px]">Suction Pipe Size (mm)</label>
                <Input id="suction_pipe_size" value={pumpDetail?.suction_pipe_size ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_pipe_sch" className="w-[200px]">Suction Pipe SCH</label>
                <Input id="suction_pipe_sch" value={pumpDetail?.suction_pipe_sch ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_pipe_id" className="w-[200px]">
                  Suction Pipe Inner Diameter {pumpDetail?.suction_pipe_id_unit ? `(${pumpDetail.suction_pipe_id_unit})` : ""}
                </label>
                <Input id="suction_pipe_id" value={pumpDetail?.suction_pipe_id ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_pipe_size" className="w-[200px]">Discharge Pipe Size (mm)</label>
                <Input id="discharge_pipe_size" value={pumpDetail?.discharge_pipe_size ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_pipe_sch" className="w-[200px]">Discharge Pipe SCH</label>
                <Input id="discharge_pipe_sch" value={pumpDetail?.discharge_pipe_sch ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_pipe_id" className="w-[200px]">
                  Discharge Pipe Inner Diameter {pumpDetail?.discharge_pipe_id_unit ? `(${pumpDetail.discharge_pipe_id_unit})` : ""}
                </label>
                <Input id="discharge_pipe_id" value={pumpDetail?.discharge_pipe_id ?? ""} className="h-6" readOnly />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Coupling Details */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Coupling Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="coup_type" className="w-[200px]">Coupling Type</label>
                <Input id="coup_type" value={pumpDetail?.coup_type ?? ""} className="h-6" readOnly />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Bearing Details */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Bearing Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="bearing_lubric_type" className="w-[200px]">Lubric Type</label>
                <Input id="bearing_lubric_type" value={pumpDetail?.bearing_lubric_type ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_lubric_brand" className="w-[200px]">Lubric Brand</label>
                <Input id="bearing_lubric_brand" value={pumpDetail?.bearing_lubric_brand ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_lubric_no" className="w-[200px]">Lubric No.</label>
                <Input id="bearing_lubric_no" value={pumpDetail?.bearing_lubric_no ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="oil_seal" className="w-[200px]">Oil Seal</label>
                <Input id="oil_seal" value={pumpDetail?.oil_seal ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_nde_one" className="w-[200px]">Bearing NDE 1</label>
                <Input id="bearing_nde_one" value={pumpDetail?.bearing_nde_one ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_nde_two" className="w-[200px]">Bearing NDE 2</label>
                <Input id="bearing_nde_two" value={pumpDetail?.bearing_nde_two ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="rotation_de" className="w-[200px]">Rotation DE</label>
                <Input id="rotation_de" value={pumpDetail?.rotation_de ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_de_one" className="w-[200px]">Bearing DE 1</label>
                <Input id="bearing_de_one" value={pumpDetail?.bearing_de_one ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_de_two" className="w-[200px]">Bearing DE 2</label>
                <Input id="bearing_de_two" value={pumpDetail?.bearing_de_two ?? ""} className="h-6" readOnly />
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_last_chg_dt" className="w-[200px]">Last Bearing Change Date</label>
                <Input id="bearing_last_chg_dt" value={pumpDetail?.bearing_last_chg_dt ?? ""} className="h-6" readOnly />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_auth/pump/pump_detail")({
  component: PumpDetail,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
