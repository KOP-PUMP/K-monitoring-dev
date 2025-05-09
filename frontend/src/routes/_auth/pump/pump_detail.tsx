import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { pumpData } from "@/data/pump_models";
import { useSearch } from "@tanstack/react-router";
import { useGetCompanyDetailByCode } from "@/hook/users/company";
import { ChevronDown, ChevronUp, Gauge } from "lucide-react";
import pumpImage from "/pump_img/36 125X100-400 C34 XXD.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HeadFlowGraph } from "@/components/chart/HeadFlowGraph";
import { FlowPowerGraph } from "@/components/chart/FlowPowerGraph";
import { NpshrFlowGraph } from "@/components/chart/NpshrFlowGraph";
import {
  useGetFactoryCurveData,
  useGetFactoryCurveNumber,
} from "@/hook/factory_curve/factory_curve";


const PumpDetail = () => {
  const { code, name, status } = useSearch({ from: "/_auth/pump/pump_detail" });
  /* const { data: companyData } = useGetCompanyDetailByCode(code); */
  const data = pumpData.filter((item) => item.name == name)[0];

  /* const { data: factoryCurveNumber } = useGetFactoryCurveNumber(); */
  /* const {
    data: factoryCurveData,
    isLoading,
    isError,
  } = useGetFactoryCurveData(null, null, factoryNumber); */

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pump Detail</h2>

        <div className="flex items-center justify-start space-x-2">
          <Link to="/pump/total_pump">Back</Link>
        </div>
      </div>
      <div className="flex gap-4 py-4 ">
        <img
          src={pumpImage} /* {data.image} */
          alt="pump image"
          className="w-[400px] rounded-xl object-contain"
        />
        <Card className="w-full xs:max-w-[500px] flex flex-col justify-between">
          <CardHeader className="flex w-full justify-between">
            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-lg font-extrabold">Current Pump Status</h3>{" "}
                <h4 className="text-muted-foreground text-xs">
                  Model : KDIN 125x100-400
                </h4>
              </div>
              <Gauge />
            </div>
          </CardHeader>
          <CardContent className="font-bold text-green-500 w-full text-center text-4xl">
            Good
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Last check : 7 day ago{" "}
          </CardFooter>
        </Card>
      </div>
      {/* <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Pump Curve</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <HeadFlowGraph
                  chartData={factoryCurveData}
                  scatter={false}
                  isLoading={isLoading}
                  isError={isError}
                />
                <FlowPowerGraph
                  chartData={factoryCurveData}
                  scatter={false}
                  isLoading={isLoading}
                  isError={isError}
                />
                <NpshrFlowGraph
                  chartData={factoryCurveData}
                  scatter={false}
                  isLoading={isLoading}
                  isError={isError}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card> */}
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">General detail</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="model" className="w-[200px]">
                  Model
                </label>
                <Input
                  id="model"
                  value="KDIN 36 125x100-400 C36 XXD" /* {data.name} */
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="brand" className="w-[200px]">
                  Brand
                </label>
                <Input
                  id="brand"
                  value="KOP" /* {data.brand} */
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="type" className="w-[200px]">
                  Type
                </label>
                <Input
                  id="type"
                  value="Centrifugal" /* {data.pump_type} */
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="company_code" className="w-[200px]">
                  Company code
                </label>
                <Input
                  id="company_code"
                  value="T-0220" /* {data.company_code} */
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="company_name" className="w-[200px]">
                  Company name
                </label>
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    id="company_name"
                    value="THAI RAYON PUBLIC CO., LTD. SIEMENS" /* {companyData?.company_name_en} */
                    className="h-6"
                    readOnly
                  ></Input>
                  <Input
                    id="company_name"
                    value="บริษัทไทยเรยอน จำกัด (มหาชน)" /* {companyData?.company_name_th} */
                    className="h-6"
                    readOnly
                  ></Input>
                </div>
              </div>
              <div className="flex gap-2">
                <label htmlFor="company_address" className="w-[200px]">
                  Address
                </label>
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    id="company_address"
                    value="16th Floor, Mahatun Plaza Building, 888/160-1, Ploenjit Rd, Lumphini, Pathum Wan, Bangkok 10330" /* {companyData?.address_en} */
                    className="h-6"
                    readOnly
                  ></Input>
                  <Input
                    id="company_address"
                    value="" /* {companyData?.address_th} */
                    className="h-6"
                    readOnly
                  ></Input>
                </div>
              </div>
              <div className="flex gap-2">
                <label htmlFor="location" className="w-[200px]">
                  Location
                </label>
                <Input
                  id="location"
                  value="Ang-Thong Plant"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="doc_no" className="w-[200px]">
                  Document No.
                </label>
                <Input
                  id="doc_no"
                  value="THA-KO-0001"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="tag_no" className="w-[200px]">
                  Tag No.
                </label>
                <Input
                  id="tag_no"
                  value="40151503AS21"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="serial_no" className="w-[200px]">
                  Serial No.
                </label>
                <Input
                  id="serial_no"
                  value="45903-1007-0123"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_standard" className="w-[200px]">
                  Serial No.
                </label>
                <Input
                  id="pump_standard"
                  value="DIN"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_standard_no" className="w-[200px]">
                  Standard No.
                </label>
                <Input
                  id="pump_standard_no"
                  value="24255"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_design" className="w-[200px]">
                  Pump design
                </label>
                <Input
                  id="pump_design"
                  value="Horizontal End Suction"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="stage" className="w-[200px]">
                  Stage
                </label>
                <Input id="stage" value="1" className="h-6" readOnly></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="base_plate" className="w-[200px]">
                  Base plate
                </label>
                <Input
                  id="base_plate"
                  value="Grouted Base Plate"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Pump Technical Data</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="max_temp" className="w-[200px]">
                  Max Temperature (°C)
                </label>
                <Input
                  id="max_temp"
                  value="140"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="max_flow" className="w-[200px]">
                  Max Flow (m³/h)
                </label>
                <Input
                  id="max_flow"
                  value="167.2"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_speed" className="w-[200px]">
                  Pump Speed (rpm)
                </label>
                <Input
                  id="pump_speed"
                  value="1450"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="design_flow" className="w-[200px]">
                  Design Flow (m³/h)
                </label>
                <Input
                  id="design_flow"
                  value="140"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="design_head" className="w-[200px]">
                  Design Head (m)
                </label>
                <Input
                  id="design_head"
                  value="42"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="shut_off_head" className="w-[200px]">
                  Shut-off Head (m)
                </label>
                <Input
                  id="shut_off_head"
                  value="47"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="min_head" className="w-[200px]">
                  min_head (m)
                </label>
                <Input
                  id="min_head"
                  value="32"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_velo" className="w-[200px]">
                  Suction Velocity (m/s)
                </label>
                <Input
                  id="suction_valo"
                  value="3.0130172"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_velo" className="w-[200px]">
                  Discharge Velocity (m/s)
                </label>
                <Input
                  id="discharge_valo"
                  value="4.735007587"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bep_head" className="w-[200px]">
                  Head Best Efficiency Point (m/s)
                </label>
                <Input
                  id="bep_head"
                  value="36.6"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bep_flow" className="w-[200px]">
                  Flow Best Efficiency Point (m³/h)
                </label>
                <Input
                  id="bep_flow"
                  value="152"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="npshr" className="w-[200px]">
                  NPSHr (m)
                </label>
                <Input id="npshr" value="2.2" className="h-6" readOnly></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_efficiency" className="w-[200px]">
                  Pump Efficiency (%)
                </label>
                <Input
                  id="pump_efficiency"
                  value="67.5"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="hyd_power" className="w-[200px]">
                  Hydraulic (kW)
                </label>
                <Input
                  id="hyd_power"
                  value="15.990954"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="power_required_cal" className="w-[200px]">
                  Power Required (kW)
                </label>
                <Input
                  id="power_required_cal"
                  value="23.69030222"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="power_min" className="w-[200px]">
                  Power Min (kW)
                </label>
                <Input
                  id="power_min"
                  value="11.68707912"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="power_max" className="w-[200px]">
                  Power Max (kW)
                </label>
                <Input
                  id="power_max_flow"
                  value="23.28108851"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="power_max_flow" className="w-[200px]">
                  Power Best Efficiency Point (kW)
                </label>
                <Input
                  id="power_max_flow"
                  value="22.41392676"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Pump Application Data</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="media" className="w-[200px]">
                  Media
                </label>
                <Input
                  id="media"
                  value="Water (w/ trace of Sulphur and fiber)"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="oper_temp" className="w-[200px]">
                  Operation Temperature (°C)
                </label>
                <Input
                  id="oper_temp"
                  value="30"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="solid_type" className="w-[200px]">
                  Solid Type
                </label>
                <Input
                  id="solid_type"
                  value="no solid"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="solid_diameter" className="w-[200px]">
                  Solid Diameter
                </label>
                <Input
                  id="solid_diameter"
                  value="0"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="density" className="w-[200px]">
                  Density
                </label>
                <Input
                  id="density"
                  value="998"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="density" className="w-[200px]">
                  Density (kg/m³)
                </label>
                <Input
                  id="density"
                  value="998"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="viscosity" className="w-[200px]">
                  Viscosity (cps)
                </label>
                <Input
                  id="viscosity"
                  value="1"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="viscosity" className="w-[200px]">
                  Viscosity (cps)
                </label>
                <Input
                  id="viscosity"
                  value="1"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="vapor_pressure" className="w-[200px]">
                  Vapor Pressure (bar)
                </label>
                <Input
                  id="vapor_pressure"
                  value="0.042455175"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="tank_design" className="w-[200px]">
                  Tank design
                </label>
                <Input
                  id="tank_design"
                  value="Above"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="tank_position" className="w-[200px]">
                  Tank position
                </label>
                <Input
                  id="tank_position"
                  value="Above"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="tank_design" className="w-[200px]">
                  Tank design
                </label>
                <Input
                  id="tank_design"
                  value="Opened"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="tank_pressure" className="w-[200px]">
                  Tank Pressure
                </label>
                <Input
                  id="tank_pressure"
                  value="1"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_head" className="w-[200px]">
                  Suction Head
                </label>
                <Input
                  id="suction_head"
                  value="3"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="concentration" className="w-[200px]">
                  Concentration
                </label>
                <Input
                  id="concentration"
                  value="0"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="solid_percentage" className="w-[200px]">
                  Solid percentage
                </label>
                <Input
                  id="solid_percentage"
                  value="0"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
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
                  Voltage (V)
                </label>
                <Input
                  id="voltage"
                  value="400"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="suggest_motor" className="w-[200px]">
                  Suggest Motor
                </label>
                <Input
                  id="suggest_motor"
                  value="30.03731814"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_brand" className="w-[200px]">
                  Motor Brand
                </label>
                <Input
                  id="motor_brand"
                  value="Siemens"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_model" className="w-[200px]">
                  Motor Model
                </label>
                <Input
                  id="motor_model"
                  value="1LE0021-2AB4"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_serial_no" className="w-[200px]">
                  Motor Serial No
                </label>
                <Input
                  id="motor_serial_no"
                  value="LMH-2209/800028751851/004"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_drive" className="w-[200px]">
                  Motor Drive
                </label>
                <Input
                  id="motor_drive"
                  value="Gear"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_frame" className="w-[200px]">
                  Motor Frame
                </label>
                <Input
                  id="motor_frame"
                  value="200L"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_protection" className="w-[200px]">
                  Motor Protection
                </label>
                <Input
                  id="motor_protection"
                  value="IP55"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_standard" className="w-[200px]">
                  Motor Standard
                </label>
                <Input
                  id="motor_standard"
                  value=""
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_ie" className="w-[200px]">
                  Motor IE
                </label>
                <Input
                  id="motor_ie"
                  value="IE 1"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_speed" className="w-[200px]">
                  Motor Speed (VPM)
                </label>
                <Input
                  id="motor_speed"
                  value="1470"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_rated" className="w-[200px]">
                  Motor Rated (kW)
                </label>
                <Input
                  id="motor_rated"
                  value="55"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_factor" className="w-[200px]">
                  Motor Factor
                </label>
                <Input
                  id="motor_factor"
                  value="0.85"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_connection" className="w-[200px]">
                  Motor Connection
                </label>
                <Input
                  id="motor_connection"
                  value="Delta"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_phase" className="w-[200px]">
                  Motor Phase
                </label>
                <Input
                  id="motor_phase"
                  value="3"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="motor_efficiency" className="w-[200px]">
                  Motor Efficiency (%)
                </label>
                <Input
                  id="motor_efficiency"
                  value="90.7"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">
              Material and Impeller Details Group
            </CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="casing_mat" className="w-[200px]">
                  Casing Material
                </label>
                <Input
                  id="casing_mat"
                  value="SS316"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="casing_cover_mat" className="w-[200px]">
                  Casing Cover Material
                </label>
                <Input
                  id="casing_cover_mat"
                  value="SS316"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_mat" className="w-[200px]">
                  Shaft Material
                </label>
                <Input
                  id="shaft_mat"
                  value="SS316"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="impeller_type" className="w-[200px]">
                  Impeller Type
                </label>
                <Input
                  id="impeller_type"
                  value="Close"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="design_impeller_dia" className="w-[200px]">
                  Impeller Diameter (mm)
                </label>
                <Input
                  id="design_impeller_dia"
                  value="368"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="impeller_max" className="w-[200px]">
                  Max Impeller diameter (mm)
                </label>
                <Input
                  id="impeller_max"
                  value="400"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="impeller_mat" className="w-[200px]">
                  Impeller_Material
                </label>
                <Input
                  id="impeller_mat"
                  value="SS316"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Motor General Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="mech_api_plan" className="w-[200px]">
                  API Plan
                </label>
                <Input
                  id="mech_api_plan"
                  value="-"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="mech_main_temp" className="w-[200px]">
                  Main Temperature (°C)
                </label>
                <Input
                  id="mech_main_temp"
                  value="-"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="mech_main_pre" className="w-[200px]">
                  Main Pressure (bar)
                </label>
                <Input
                  id="mech_main_pre"
                  value="-"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="seal_cham" className="w-[200px]">
                  Seal Chamber
                </label>
                <Input
                  id="seal_cham"
                  value="Standard"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_brand" className="w-[200px]">
                  Shaft Seal Brand
                </label>
                <Input
                  id="shaft_seal_brand"
                  value="KOP"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_brand" className="w-[200px]">
                  Shaft Seal Brand
                </label>
                <Input
                  id="shaft_seal_brand"
                  value="KOP"
                  className="h-6"
                  readOnly
                ></Input>
                <Input
                  id="shaft_seal_brand"
                  value="KBM3N"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_brand" className="w-[200px]">
                  Shaft Seal Brand
                </label>
                <Input
                  id="shaft_seal_brand"
                  value="KOP"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="mech_size" className="w-[200px]">
                  Mechanical Seal Size (mm)
                </label>
                <Input
                  id="mech_size"
                  value="44"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_design" className="w-[200px]">
                  Shaft Seal Design
                </label>
                <Input
                  id="shaft_seal_design"
                  value="Component"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="shaft_seal_mat" className="w-[200px]">
                  Shaft Seal Mat
                </label>
                <Input
                  id="shaft_seal_mat"
                  value="BQVGG"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Flange Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="pump_suction_size" className="w-[200px]">
                  Suction Size (mm)
                </label>
                <Input
                  id="pump_suction_size"
                  value="125"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_suction_rating" className="w-[200px]">
                  Pump Suction Rating
                </label>
                <Input
                  id="pump_suction_rating"
                  value="PN16"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_discharge_size" className="w-[200px]">
                  Discharge Size (mm)
                </label>
                <Input
                  id="pump_discharge_size"
                  value="100"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="pump_discharge_rating" className="w-[200px]">
                  Pump Discharge Rating
                </label>
                <Input
                  id="pump_discharge_rating"
                  value="PN16"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_pipe_size" className="w-[200px]">
                  Suction Pipe Size (mm)
                </label>
                <Input
                  id="suction_pipe_size"
                  value="125"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_pipe_sch" className="w-[200px]">
                  Suction Pipe SCH
                </label>
                <Input
                  id="suction_pipe_sch"
                  value="40"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_pipe_size" className="w-[200px]">
                  Discharge Pipe Size (mm)
                </label>
                <Input
                  id="discharge_pipe_size"
                  value="125"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_pipe_sch" className="w-[200px]">
                  Discharge Pipe SCH
                </label>
                <Input
                  id="discharge_pipe_sch"
                  value="40"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_pipe_size" className="w-[200px]">
                  Discharge Pipe Size (mm)
                </label>
                <Input
                  id="discharge_pipe_size"
                  value="125"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="suction_pipe_id" className="w-[200px]">
                  Suction Pipe Inner Diameter (mm)
                </label>
                <Input
                  id="suction_pipe_id"
                  value="128.1938"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="discharge_pipe_id" className="w-[200px]">
                  Discharge Pipe Inner Diameter (mm)
                </label>
                <Input
                  id="discharge_pipe_id"
                  value="102.2604"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Coupling details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="coup_model" className="w-[200px]">
                  Coupling Model
                </label>
                <Input
                  id="coup_model"
                  value="Tyre Flex type B"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="coup_brand" className="w-[200px]">
                  Brand
                </label>
                <Input
                  id="coup_brand"
                  value="Rathi"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="coup_type" className="w-[200px]">
                  Type
                </label>
                <Input
                  id="coup_type"
                  value="Non-Spacer"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="coup_size" className="w-[200px]">
                  Size
                </label>
                <Input
                  id="coup_size"
                  value="TO 8"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="coup_spacer" className="w-[200px]">
                  Spacer
                </label>
                <Input
                  id="coup_spacer"
                  value="-"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <Card className="w-full">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full justify-between items-center pr-4">
            <CardTitle className="p-4">Bearing Details</CardTitle>
            <ChevronDown className="w-3.5 h-3.5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <label htmlFor="bearing_lubric_type" className="w-[200px]">
                  Lubric Type
                </label>
                <Input
                  id="bearing_lubric_type"
                  value="Grease"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_lubric_brand" className="w-[200px]">
                  Lubric Brand
                </label>
                <Input
                  id="bearing_lubric_brand"
                  value="-"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_lubric_no" className="w-[200px]">
                  Lubric No.
                </label>
                <Input
                  id="bearing_lubric_no"
                  value="-"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="oil_seal" className="w-[200px]">
                  Oil Seal
                </label>
                <Input
                  id="oil_seal"
                  value="6307-2Z"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_nde_one" className="w-[200px]">
                  Bearing NDE 1
                </label>
                <Input
                  id="bearing_nde_one"
                  value="6307-2Z"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_nde_two" className="w-[200px]">
                  Bearing NDE 2
                </label>
                <Input
                  id="bearing_nde_two"
                  value="6307-2Z"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="rotation_de" className="w-[200px]">
                  Rotation DE
                </label>
                <Input
                  id="rotation_de"
                  value="CW"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_de_one" className="w-[200px]">
                  Bearing DE 1
                </label>
                <Input
                  id="bearing_de_one"
                  value="6307-2Z"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_de_two" className="w-[200px]">
                  Bearing DE 2
                </label>
                <Input
                  id="bearing_de_two"
                  value="6307-2Z"
                  className="h-6"
                  readOnly
                ></Input>
              </div>
              <div className="flex gap-2">
                <label htmlFor="bearing_housing_mat" className="w-[200px]">
                  Housing Material
                </label>
                <Input
                  id="bearing_housing_mat"
                  value="CAST IRON"
                  className="h-6"
                  readOnly
                ></Input>
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
});
