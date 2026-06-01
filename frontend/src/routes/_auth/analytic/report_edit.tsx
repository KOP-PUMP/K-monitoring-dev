import { createFileRoute} from "@tanstack/react-router";
import React, { useMemo } from "react";
import {
  ReportCheckCalResponse,
  EngineerReportCheckVibe,
  EngineerVibrationAnalysisPositionData,
} from "@/types/amalytic/report_check_data";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useCreateEngineerReportCalCheck,
  useCreateEngineerReportVibeCheck,
  useCreateEngineerReportVisualCheck,
  useCreateEngineerReportResultCheck,
  useGetEngineerReportCheckData,
  useUpdateEngineerReportCalCheck,
  useUpdateEngineerReportVibeCheck,
  useUpdateEngineerReportResultCheck,
  useUpdateEngineerReportVisualCheck,
  useGetEquipmentFromMars,
  useGetAllMeasureDataFromMars,
  useGetAnalysisData,
} from "@/hook/engineer/engineer";
import { getAnalysisData as getAnalysisDataApi } from "@/api/engineer/engineer";
import {
  EngineerReportCheckCalSchema,
  EngineerReportCheckVibrationSchema,
  EngineerReportCheckVisualSchema,
  EngineerReportCheckResultSchema,
} from "@/validators/engineer";
import { ChevronDownIcon} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FormBox } from "@/components/common/FormBox";
import { PlusCircle } from "lucide-react";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetAllUnitLOVData, useGetAllPumpLOVData } from "@/hook/pump/pump";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MeasureType = "acceleration" | "velocity" | "displacement";

const AXIS_COLORS = { x: "#3b82f6", y: "#22c55e", z: "#ef4444" };
const AXIS_LABELS = { x: "Horizontal X", y: "Axial Y", z: "Vertical Z" };

const buildWaveData = (
  d: EngineerVibrationAnalysisPositionData,
  type: MeasureType,
) =>
  Array.from(
    {
      length: Math.max(
        d.x[type].data.length,
        d.y[type].data.length,
        d.z[type].data.length,
      ),
    },
    (_, i) => ({
      point: i,
      x: d.x[type].data[i] ?? null,
      y: d.y[type].data[i] ?? null,
      z: d.z[type].data[i] ?? null,
    }),
  );

const buildSpectrumData = (
  d: EngineerVibrationAnalysisPositionData,
  type: MeasureType,
) =>
  Array.from(
    {
      length: Math.max(
        d.x[type].spectrum.data.length,
        d.y[type].spectrum.data.length,
        d.z[type].spectrum.data.length,
      ),
    },
    (_, i) => ({
      point: +(i * d.x[type].spectrum.xinterval).toFixed(3),
      x: d.x[type].spectrum.data[i] ?? null,
      y: d.y[type].spectrum.data[i] ?? null,
      z: d.z[type].spectrum.data[i] ?? null,
    }),
  );

const VibrationChart = ({
  data,
  title,
  xLabel,
  selectedAxes,
}: {
  data: any[];
  title: string;
  xLabel: string;
  selectedAxes: ("x" | "y" | "z")[];
}) => (
  <div className="w-full h-64">
    <p className="text-sm text-gray-600 mb-1">{title}</p>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="point"
          label={{ value: xLabel, position: "insideBottomRight", offset: -5 }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        {(["x", "y", "z"] as const)
          .filter((a) => selectedAxes.includes(a))
          .map((a) => (
            <Line
              key={a}
              type="monotone"
              dot={false}
              dataKey={a}
              name={AXIS_LABELS[a]}
              stroke={AXIS_COLORS[a]}
              isAnimationActive={false}
            />
          ))}
        <Brush />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const VibrationGraphs = React.memo(
  ({
    data,
    selectedAxes,
    onToggleAxis,
  }: {
    data: EngineerVibrationAnalysisPositionData;
    selectedAxes: ("x" | "y" | "z")[];
    onToggleAxis: (axis: "x" | "y" | "z") => void;
  }) => {
    const measures: { type: MeasureType; label: string }[] = [
      { type: "acceleration", label: "Acceleration" },
      { type: "velocity", label: "Velocity" },
      { type: "displacement", label: "Displacement" },
    ];

    // Only recomputes when data changes, not on every parent render
    const chartData = useMemo(
      () =>
        measures.map(({ type, label }) => ({
          type,
          label,
          wave: buildWaveData(data, type),
          spectrum: buildSpectrumData(data, type),
        })),
      [data],
    );

    return (
      <div className="flex flex-col gap-6 pt-4">
        {/* Axis selector */}
        <div className="flex gap-4 items-center">
          <span className="text-sm font-medium">Show axis:</span>
          {(["x", "y", "z"] as const).map((a) => (
            <label
              key={a}
              className="flex items-center gap-1.5 cursor-pointer text-sm"
            >
              <Checkbox
                checked={selectedAxes.includes(a)}
                onCheckedChange={() => onToggleAxis(a)}
              />
              <span style={{ color: AXIS_COLORS[a] }}>{AXIS_LABELS[a]}</span>
            </label>
          ))}
        </div>

        {/* Charts */}
        {chartData.map(({ type, label, wave, spectrum }) => (
          <div key={type} className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-decoration-line: underline">
              {label}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <VibrationChart
                  data={wave}
                  title={`${label} Wave`}
                  xLabel={data.x.xunit}
                  selectedAxes={selectedAxes}
                />
              </div>
              <div className="flex-1">
                <VibrationChart
                  data={spectrum}
                  title={`${label} Spectrum`}
                  xLabel="Hz"
                  selectedAxes={selectedAxes}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
);

interface VibrationDialogProps {
  position: string;
  equipmentId: { x_id: string; y_id: string; z_id: string };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  measureData: any[];
  isFetchingMeasure: boolean;
  isSubmitting: boolean;
  isDateSelected: boolean;
  pickVibeDate: { x: string; y: string; z: string };
  onPickVibeDateChange: (axis: "x" | "y" | "z", value: string) => void;
  onResetVibeDate: () => void;
  onGetData: (
    equipment: { x_id: string; y_id: string; z_id: string },
    date: { x: string; y: string; z: string },
    position: string,
  ) => void;
  onSelectTrigger: (
    id: { x_id: string; y_id: string; z_id: string },
    position: string,
  ) => void;
}

const VibrationDialog = ({
  position,
  equipmentId,
  isOpen,
  onOpenChange,
  measureData,
  isFetchingMeasure,
  isSubmitting,
  isDateSelected,
  pickVibeDate,
  onPickVibeDateChange,
  onResetVibeDate,
  onSelectTrigger,
  onGetData,
}: VibrationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {!isDateSelected ? (
          <Button type="button" disabled>
            Get Data
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => onSelectTrigger(equipmentId, position)}
            disabled={isFetchingMeasure}
          >
            {isFetchingMeasure ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Loading...
              </>
            ) : (
              "Get Data"
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record</DialogTitle>
          <DialogDescription>
            Vibration check record from sensor
          </DialogDescription>
        </DialogHeader>
        {/* Selection summary */}
        <div className="grid grid-cols-3 gap-2 px-1 pb-1">
          {(["x", "y", "z"] as const).map((axis) => {
            const labels = { x: "Horizontal X", y: "Axial Y", z: "Vertical Z" };
            const selected = pickVibeDate[axis];
            return (
              <div
                key={axis}
                className={`rounded border px-2 py-1.5 text-xs ${
                  selected
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-dashed border-muted-foreground/40 text-muted-foreground"
                }`}
              >
                <p className="font-medium">{labels[axis]}</p>
                <p className="truncate">{selected || "Not selected"}</p>
              </div>
            );
          })}
        </div>

        <div className="w-full max-h-[700px] overflow-y-auto flex flex-col gap-4">
          {isFetchingMeasure ? (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              {/* X Axis */}
              <Table>
                <TableHeader>
                  <header>Horizontal X Axis</header>
                  <TableRow>
                    <TableHead className="text-center">Time</TableHead>
                    <TableHead className="text-center">Value (m/s²)</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measureData && measureData[0]?.length > 0 ? (
                    measureData[0].map((data: any, index: number) => {
                      const isSelected = pickVibeDate.x === data.time;
                      return (
                        <TableRow
                          key={index}
                          className={`text-center ${isSelected ? "bg-blue-50" : ""}`}
                        >
                          <TableCell>{data.time}</TableCell>
                          <TableCell>{data.value}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant={isSelected ? "default" : "link"}
                              size="sm"
                              onClick={() => onPickVibeDateChange("x", data.time)}
                            >
                              {isSelected ? "✓ Selected" : "Select"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="text-center">
                      <TableCell colSpan={3}>No Data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Y Axis */}
              <Table>
                <TableHeader>
                  <header>Axial Y Axis</header>
                  <TableRow>
                    <TableHead className="text-center">Time</TableHead>
                    <TableHead className="text-center">Value (m/s²)</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measureData && measureData[1]?.length > 0 ? (
                    measureData[1].map((data: any, index: number) => {
                      const isSelected = pickVibeDate.y === data.time;
                      return (
                        <TableRow
                          key={index}
                          className={`text-center ${isSelected ? "bg-blue-50" : ""}`}
                        >
                          <TableCell>{data.time}</TableCell>
                          <TableCell>{data.value}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant={isSelected ? "default" : "link"}
                              size="sm"
                              onClick={() => onPickVibeDateChange("y", data.time)}
                            >
                              {isSelected ? "✓ Selected" : "Select"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="text-center">
                      <TableCell colSpan={3}>No Data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Z Axis */}
              <Table>
                <TableHeader>
                  <header>Vertical Z Axis</header>
                  <TableRow>
                    <TableHead className="text-center">Time</TableHead>
                    <TableHead className="text-center">Value (m/s²)</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measureData && measureData[2]?.length > 0 ? (
                    measureData[2].map((data: any, index: number) => {
                      const isSelected = pickVibeDate.z === data.time;
                      return (
                        <TableRow
                          key={index}
                          className={`text-center ${isSelected ? "bg-blue-50" : ""}`}
                        >
                          <TableCell>{data.time}</TableCell>
                          <TableCell>{data.value}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant={isSelected ? "default" : "link"}
                              size="sm"
                              onClick={() => onPickVibeDateChange("z", data.time)}
                            >
                              {isSelected ? "✓ Selected" : "Select"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="text-center">
                      <TableCell colSpan={3}>No Data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </div>
        <DialogFooter className="w-full flex justify-between">
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() =>
              onGetData(
                equipmentId,
                { x: pickVibeDate.x, y: pickVibeDate.y, z: pickVibeDate.z },
                position,
              )
            }
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Loading...
              </>
            ) : (
              "Submit"
            )}
          </Button>
          <DialogClose asChild>
            <Button type="button" onClick={onResetVibeDate}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function ReportEdit() {
  /* const { data: pumpDetail } = useGetPumpDetail(null); */
  /* const localstorage = window.localStorage.getItem("user"); */
  /* const userData = localstorage !== null ? JSON.parse(localstorage) : null; */
  /* const createMutation = useCreateEngineerReport(); */
  const createCheckCalMutation = useCreateEngineerReportCalCheck();
  const createEngineerReportVibeCheck = useCreateEngineerReportVibeCheck();
  const createEngineerReportVisualCheck = useCreateEngineerReportVisualCheck();
  const createEngineerReportResultCheck = useCreateEngineerReportResultCheck();
  /* const createEngineerReportCheck = useCreateEngineerReportCheck(); */
  const updateEngineerReportCalCheck = useUpdateEngineerReportCalCheck();
  const updateEngineerReportVibeCheck = useUpdateEngineerReportVibeCheck();
  const updateEngineerReportResultCheck = useUpdateEngineerReportResultCheck();
  const updateEngineerReportVisualCheck = useUpdateEngineerReportVisualCheck();
  const getEquipmentFromMars = useGetEquipmentFromMars();
  const getAllMeasureDataFromMars = useGetAllMeasureDataFromMars();
  /* const getMeasureDataFromMars = useGetMeasureDataFromMars(); */
  const getAnalysisData = useGetAnalysisData();

  /* Form initialized */

  /* const engineerReportCheckForm = useForm<
    z.infer<typeof EngineerReportCheckSchema>
  >({
    resolver: zodResolver(EngineerReportCheckSchema),
  }); */
  const engineerReportCheckCalForm = useForm<
    z.infer<typeof EngineerReportCheckCalSchema>
  >({
    resolver: zodResolver(EngineerReportCheckCalSchema),
  });
  const engineerReportCheckVibrationForm = useForm<
    z.infer<typeof EngineerReportCheckVibrationSchema>
  >({
    resolver: zodResolver(EngineerReportCheckVibrationSchema),
  });
  const engineerReportCheckVisualForm = useForm<
    z.infer<typeof EngineerReportCheckVisualSchema>
  >({
    resolver: zodResolver(EngineerReportCheckVisualSchema),
  });
  const engineerReportCheckResultForm = useForm<
    z.infer<typeof EngineerReportCheckResultSchema>
  >({
    resolver: zodResolver(EngineerReportCheckResultSchema),
  });

  /* const [filteredPump, setFilteredPump] = useState("");
  const [selectedPump, setSelectedPump] = useState<PumpDetailResponse>(); */
  /* const [searchKey, setSearchKey] = useState({
    pump_code_name: "",
  }); */
  /* const [isDialogOpen, setIsDialogOpen] = useState(false); */
  const { id } = useSearch({ from: "/_auth/analytic/report_edit" });
  const [pumpLOVData, setPumpLOVData] = useState<ComboboxItemProps[]>([]);
  const [pumpUnitLOVData, setPumpUnitLOVData] = useState<ComboboxItemProps[]>();
  /* useState for MARS system data out */
  const [MARSEquipmentData, setMARSEquipmentData] = useState<{
    x_id: string;
    y_id: string;
    z_id: string;
  }>({ x_id: "", y_id: "", z_id: "" });
  const [MARSMeasureData, setMARSMeasureData] = useState<any>(null);
  const [selectedVibAxes, setSelectedVibAxes] = useState<
    Record<string, ("x" | "y" | "z")[]>
  >({
    pump_nde: ["x", "y", "z"],
    pump_de: ["x", "y", "z"],
    motor_nde: ["x", "y", "z"],
    motor_de: ["x", "y", "z"],
  });
  const [vibrationAnalysisData, setVibrationAnalysisData] = useState<
    Record<string, EngineerVibrationAnalysisPositionData | null>
  >({
    pump_nde: null,
    pump_de: null,
    motor_nde: null,
    motor_de: null,
  });
  const [openDatePicker, setOpenDatePicker] = useState<any>({
    pump_nde: false,
    pump_de: false,
    motor_nde: false,
    motor_de: false,
  });
  const [pickDate, setPickDate] = useState<any>({
    pump_nde: "",
    pump_de: "",
    motor_nde: "",
    motor_de: "",
  });
  const [pickVibeDate, setPickVibeDate] = useState<
    Record<string, { x: string; y: string; z: string }>
  >({
    pump_nde:  { x: "", y: "", z: "" },
    pump_de:   { x: "", y: "", z: "" },
    motor_nde: { x: "", y: "", z: "" },
    motor_de:  { x: "", y: "", z: "" },
  });
  const [dialogOpen, setDialogOpen] = useState<any>({
    pump_nde: false,
    pump_de: false,
    motor_nde: false,
    motor_de: false,
  });

  const { data: pumpLOVResponse } = useGetAllPumpLOVData();
  const { data: pumpUnitLOVResponse } = useGetAllUnitLOVData();
  const { data: reportCheckData } = useGetEngineerReportCheckData(id);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year_tomorrow = tomorrow.getFullYear();
  const month_tomorrow = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Add 1 because months are 0-based
  const day_tomorrow = String(tomorrow.getDate()).padStart(2, "0");

  const formattedTomorrowDateTime = `${year_tomorrow}-${month_tomorrow}-${day_tomorrow} 00:00:00`;

  const handleLOVDataFilter = (name: string, type: string) => {
    if (type === "pump_unit") {
      const filterData = pumpUnitLOVData?.filter((data) => {
        return data.product_name == name;
      });
      return filterData;
    } else {
      const filterData = pumpLOVData?.filter((data) => {
        return data.product_name === name;
      });
      return filterData;
    }
  };

  const handleDatePickFormatChange = (date: Date, datePickerKey: string) => {
    const year_pick = date.getFullYear();
    const month_pick = String(date.getMonth() + 1).padStart(2, "0");
    const day_pick = String(date.getDate()).padStart(2, "0");
    const formattedDateTime = `${year_pick}-${month_pick}-${day_pick} 00:00:00`;

    setPickDate((prev: any) => ({
      ...prev,
      [datePickerKey]: formattedDateTime,
    }));
  };

  useEffect(() => {
    if (pumpLOVResponse && pumpUnitLOVResponse) {
      const newPumpLOVData = pumpLOVResponse.map((data) => {
        return {
          type_name: data.type_name,
          product_name: data.product_name,
          value: data.data_value,
          label: data.data_value,
        };
      });
      const newPumpUnitLOVData = pumpUnitLOVResponse.map((data) => {
        return {
          type_name: data.type_name,
          product_name: data.product_name,
          value: data.data_value,
          label: data.data_value,
        };
      });

      setPumpLOVData(newPumpLOVData);
      setPumpUnitLOVData(newPumpUnitLOVData);
    }
  }, [pumpLOVResponse, pumpUnitLOVResponse]);

  /* const handleDataSubmit = () => {
    const addData = {
      pump_detail: selectedPump?.pump_id,
      user_detail: userData.user.user_email,
      updated_at: new Date().toISOString(),
      updated_by: userData?.user.user_email,
      created_at: new Date().toISOString(),
      created_by: userData?.user.user_email,
    };
    createMutation.mutate(addData);
  }; */

  /* const handleResetPumpDetail = (data: PumpDetailLOVResponse) => {
    engineerReportCheckForm.reset({
      ...engineerReportCurrentValue,
      pump_lov_id: data.pump_lov_id,
      brand: data.pump_brand,
      pump_code_name: `${data.pump_brand} ${data.pump_model}`,
      model_short: data.pump_model?.split(" ")[0],
      model: data.pump_model,
      pump_model_size: data.model_size,
      pump_design: data.pump_design,
      pump_type_name: data.pump_type,
      stage: data.pump_stage,
      impeller_type: data.pump_impeller_type,
    });
  }; */

  const handleReportCalSubmit = async () => {
    if (reportCheckData.data_cal?.check_id) {
      let data: any = {};
      data["report_data"] = engineerReportCheckCalForm.getValues();
      data["pump_data"] = reportCheckData?.pump_data;

      const response: ReportCheckCalResponse =
        await updateEngineerReportCalCheck.mutateAsync({ data, id: id ?? "" });
      if (response) {
        engineerReportCheckResultForm.reset({
          ...engineerReportCheckResultForm.getValues(),
          range_30_110_result: response.range_30_110_result,
          npshr_npsha_result: response.npshr_npsha_result,
          pump_standard_result: response.pump_standard_result,
          power_result: response.power_result,
          fluid_temp_result: response.fluid_temp_result,
          bearing_temp_result: response.bearing_temp_result,
        });
      }
    } else {
      let data: any = {
        ...engineerReportCheckCalForm.getValues(),
        check_id: id,
      };
      const response = await createCheckCalMutation.mutateAsync(data);
      if (response) {
        console.log(response);
      } else {
        console.log("No response data");
      }
    }
  };

  const handleReportVibrationSubmit = () => {
    const formValues = engineerReportCheckVibrationForm.getValues();

    const data: EngineerReportCheckVibe = {
      check_id: id ?? "",

      //Measure timestamps from vibrationAnalysisData coltime
      pump_nde_x_date: vibrationAnalysisData.pump_nde?.x.coltime,
      pump_nde_y_date: vibrationAnalysisData.pump_nde?.y.coltime,
      pump_nde_z_date: vibrationAnalysisData.pump_nde?.z.coltime,
      pump_de_x_date:  vibrationAnalysisData.pump_de?.x.coltime,
      pump_de_y_date:  vibrationAnalysisData.pump_de?.y.coltime,
      pump_de_z_date:  vibrationAnalysisData.pump_de?.z.coltime,
      motor_nde_x_date: vibrationAnalysisData.motor_nde?.x.coltime,
      motor_nde_y_date: vibrationAnalysisData.motor_nde?.y.coltime,
      motor_nde_z_date: vibrationAnalysisData.motor_nde?.z.coltime,
      motor_de_x_date:  vibrationAnalysisData.motor_de?.x.coltime,
      motor_de_y_date:  vibrationAnalysisData.motor_de?.y.coltime,
      motor_de_z_date:  vibrationAnalysisData.motor_de?.z.coltime,

      // Velocity RMS
      v_pump_nde_h: vibrationAnalysisData.pump_nde?.x.velocity.rms?.toString(),
      v_pump_nde_v: vibrationAnalysisData.pump_nde?.z.velocity.rms?.toString(),
      v_pump_nde_a: vibrationAnalysisData.pump_nde?.y.velocity.rms?.toString(),
      v_pump_de_h:  vibrationAnalysisData.pump_de?.x.velocity.rms?.toString(),
      v_pump_de_v:  vibrationAnalysisData.pump_de?.z.velocity.rms?.toString(),
      v_pump_de_a:  vibrationAnalysisData.pump_de?.y.velocity.rms?.toString(),
      v_motor_nde_h: vibrationAnalysisData.motor_nde?.x.velocity.rms?.toString(),
      v_motor_nde_v: vibrationAnalysisData.motor_nde?.z.velocity.rms?.toString(),
      v_motor_nde_a: vibrationAnalysisData.motor_nde?.y.velocity.rms?.toString(),
      v_motor_de_h:  vibrationAnalysisData.motor_de?.x.velocity.rms?.toString(),
      v_motor_de_v:  vibrationAnalysisData.motor_de?.z.velocity.rms?.toString(),
      v_motor_de_a:  vibrationAnalysisData.motor_de?.y.velocity.rms?.toString(),

      // Acceleration RMS
      a_pump_nde_h: vibrationAnalysisData.pump_nde?.x.acceleration.rms?.toString(),
      a_pump_nde_v: vibrationAnalysisData.pump_nde?.z.acceleration.rms?.toString(),
      a_pump_nde_a: vibrationAnalysisData.pump_nde?.y.acceleration.rms?.toString(),
      a_pump_de_h:  vibrationAnalysisData.pump_de?.x.acceleration.rms?.toString(),
      a_pump_de_v:  vibrationAnalysisData.pump_de?.z.acceleration.rms?.toString(),
      a_pump_de_a:  vibrationAnalysisData.pump_de?.y.acceleration.rms?.toString(),
      a_motor_nde_h: vibrationAnalysisData.motor_nde?.x.acceleration.rms?.toString(),
      a_motor_nde_v: vibrationAnalysisData.motor_nde?.z.acceleration.rms?.toString(),
      a_motor_nde_a: vibrationAnalysisData.motor_nde?.y.acceleration.rms?.toString(),
      a_motor_de_h:  vibrationAnalysisData.motor_de?.x.acceleration.rms?.toString(),
      a_motor_de_v:  vibrationAnalysisData.motor_de?.z.acceleration.rms?.toString(),
      a_motor_de_a:  vibrationAnalysisData.motor_de?.y.acceleration.rms?.toString(),

      // Displacement RMS
      d_pump_nde_h: vibrationAnalysisData.pump_nde?.x.displacement.rms?.toString(),
      d_pump_nde_v: vibrationAnalysisData.pump_nde?.z.displacement.rms?.toString(),
      d_pump_nde_a: vibrationAnalysisData.pump_nde?.y.displacement.rms?.toString(),
      d_pump_de_h:  vibrationAnalysisData.pump_de?.x.displacement.rms?.toString(),
      d_pump_de_v:  vibrationAnalysisData.pump_de?.z.displacement.rms?.toString(),
      d_pump_de_a:  vibrationAnalysisData.pump_de?.y.displacement.rms?.toString(),
      d_motor_nde_h: vibrationAnalysisData.motor_nde?.x.displacement.rms?.toString(),
      d_motor_nde_v: vibrationAnalysisData.motor_nde?.z.displacement.rms?.toString(),
      d_motor_nde_a: vibrationAnalysisData.motor_nde?.y.displacement.rms?.toString(),
      d_motor_de_h:  vibrationAnalysisData.motor_de?.x.displacement.rms?.toString(),
      d_motor_de_v:  vibrationAnalysisData.motor_de?.z.displacement.rms?.toString(),
      d_motor_de_a:  vibrationAnalysisData.motor_de?.y.displacement.rms?.toString(),

      // Temp.
      temp_pump_nde:  formValues.temp_pump_nde,
      temp_pump_de:   formValues.temp_pump_de,
      temp_motor_nde: formValues.temp_motor_nde,
      temp_motor_de:  formValues.temp_motor_de,
      env_vibration:  formValues.env_vibration,
    };

    console.log("handleReportVibrationSubmit data:", data);

    if (reportCheckData.data_vibe?.check_id) {
      updateEngineerReportVibeCheck.mutate({ data, id: id ?? "" });
    } else {
      createEngineerReportVibeCheck.mutate(data);
    }
  };

  const handleReportVisualSubmit = () => {
    let data = engineerReportCheckVisualForm.getValues();
    if (reportCheckData.data_visual?.check_id) {
      updateEngineerReportVisualCheck.mutate({ data, id: id ?? "" });
    } else {
      data["check_id"] = id ?? "";
      createEngineerReportVisualCheck.mutate(data);
    }
  };

  const handleReportResultSubmit = () => {
    let report_result_data = engineerReportCheckResultForm.getValues();
    report_result_data["check_id"] = id ?? "";
    const check_result_id = reportCheckData.data_result?.check_result_id;
    if (check_result_id && check_result_id !== "") {
      updateEngineerReportResultCheck.mutate({
        data: report_result_data,
        id: check_result_id,
      });
    } else {
      createEngineerReportResultCheck.mutate(report_result_data);
    }
  };

  /* Get node ID from MARS by track the network request in browser inspection mode*/
  useEffect(() => {
    getEquipmentFromMars.mutate(
      {
        node_code: "",
        node_id: "5c0d8c27-8c63-434d-a7a8-775c19f177e9",
        data_index: 20,
        start_time: "2025-1-1 00:00:00",
        end_time: formattedTomorrowDateTime,
      },
      {
        onSuccess: (data) => {
          setMARSEquipmentData(data);
        },
      },
    );
  }, []);

  useEffect(() => {
    if (reportCheckData) {
      console.log("report check data", reportCheckData);
      const calCheckFormData = engineerReportCheckCalForm.getValues();
      const vibeCheckFormData = engineerReportCheckVibrationForm.getValues();
      const visualCheckFormData = engineerReportCheckVisualForm.getValues();
      const resultCheckFormData = engineerReportCheckResultForm.getValues();
      if (reportCheckData.data_cal.check_id) {
        for (let key in calCheckFormData) {
          const formKey = key as keyof typeof calCheckFormData; // Force the type

          if (reportCheckData.data_cal[formKey]) {
            engineerReportCheckCalForm.setValue(
              formKey,
              reportCheckData.data_cal[formKey],
            );
          }
        }
      }
      if (reportCheckData.data_vibe.check_id) {
        for (let key in vibeCheckFormData) {
          const formKey = key as keyof typeof vibeCheckFormData; // Force the type

          if (reportCheckData.data_vibe[formKey]) {
            engineerReportCheckVibrationForm.setValue(
              formKey,
              reportCheckData.data_vibe[formKey],
            );
          }
        }

        // Restore previously selected timestamps into pickVibeDate per position
        const vd = reportCheckData.data_vibe;
        setPickVibeDate({
          pump_nde: {
            x: vd.pump_nde_x_date || "",
            y: vd.pump_nde_y_date || "",
            z: vd.pump_nde_z_date || "",
          },
          pump_de: {
            x: vd.pump_de_x_date || "",
            y: vd.pump_de_y_date || "",
            z: vd.pump_de_z_date || "",
          },
          motor_nde: {
            x: vd.motor_nde_x_date || "",
            y: vd.motor_nde_y_date || "",
            z: vd.motor_nde_z_date || "",
          },
          motor_de: {
            x: vd.motor_de_x_date || "",
            y: vd.motor_de_y_date || "",
            z: vd.motor_de_z_date || "",
          },
        });
      }
      if (reportCheckData.data_visual.check_id) {
        for (let key in visualCheckFormData) {
          const formKey = key as keyof typeof visualCheckFormData; // Force the type

          if (reportCheckData.data_visual[formKey]) {
            engineerReportCheckVisualForm.setValue(
              formKey,
              reportCheckData.data_visual[formKey],
            );
          }
        }
      }
      if (reportCheckData.data_result.check_id) {
        for (let key in resultCheckFormData) {
          const formKey = key as keyof typeof resultCheckFormData; // Force the type

          if (reportCheckData.data_result[formKey]) {
            engineerReportCheckResultForm.setValue(
              formKey,
              reportCheckData.data_result[formKey],
            );
          }
        }
      }
    }
  }, [reportCheckData]);

  const [isAutoLoadingVibe, setIsAutoLoadingVibe] = useState(false);

  // Auto-load graphs on page load when saved vibration data + equipment IDs are both ready
  const autoLoadedVibeRef = React.useRef(false);
  useEffect(() => {
    if (autoLoadedVibeRef.current) return;
    if (!MARSEquipmentData.x_id) return;
    if (!reportCheckData?.data_vibe?.check_id) return;

    autoLoadedVibeRef.current = true;

    const vd = reportCheckData.data_vibe;
    const positions = [
      { position: "pump_nde",  x: vd.pump_nde_x_date,  y: vd.pump_nde_y_date,  z: vd.pump_nde_z_date  },
      { position: "pump_de",   x: vd.pump_de_x_date,   y: vd.pump_de_y_date,   z: vd.pump_de_z_date   },
      { position: "motor_nde", x: vd.motor_nde_x_date, y: vd.motor_nde_y_date, z: vd.motor_nde_z_date },
      { position: "motor_de",  x: vd.motor_de_x_date,  y: vd.motor_de_y_date,  z: vd.motor_de_z_date  },
    ];
    const toFetch = positions.filter(({ x, y, z }) => x && y && z);

    if (toFetch.length === 0) return;

    setIsAutoLoadingVibe(true);

    Promise.all(
      toFetch.map(({ position, x, y, z }) => {
        const payload = [
          { node_code: "", node_id: MARSEquipmentData.x_id, data_index: 20, time: x },
          { node_code: "", node_id: MARSEquipmentData.y_id, data_index: 20, time: y },
          { node_code: "", node_id: MARSEquipmentData.z_id, data_index: 20, time: z },
        ];
        return getAnalysisDataApi(payload).then((data) => ({ position, data }));
      })
    ).then((results) => {
      setVibrationAnalysisData((prev) => {
        const next = { ...prev };
        results.forEach(({ position, data }) => {
          next[position] = data;
        });
        return next;
      });
    }).catch((err) => {
      console.error("Auto-load vibration graphs failed:", err);
    }).finally(() => {
      setIsAutoLoadingVibe(false);
    });
  }, [MARSEquipmentData.x_id, reportCheckData?.data_vibe?.check_id]);

  const handleSelectCordinate = (
    id: {
      x_id: string;
      y_id: string;
      z_id: string;
    },
    position: string,
  ) => {
    const data_out = [
      {
        node_code: "",
        node_id: id.x_id,
        data_index: 20,
        start_time: pickDate[position],
        end_time: formattedTomorrowDateTime,
        page_index: 1,
        page_size: 1000,
      },
      {
        node_code: "",
        node_id: id.y_id,
        data_index: 20,
        start_time: pickDate[`${position}`],
        end_time: formattedTomorrowDateTime,
        page_index: 1,
        page_size: 1000,
      },
      {
        node_code: "",
        node_id: id.z_id,
        data_index: 20,
        start_time: pickDate[`${position}`],
        end_time: formattedTomorrowDateTime,
        page_index: 1,
        page_size: 1000,
      },
    ];
    getAllMeasureDataFromMars.mutate(data_out, {
      onSuccess: (data) => {
        setMARSMeasureData(data);
      },
    });
  };

  const handleGetVibrationData = (
    equipment: { x_id: string; y_id: string; z_id: string },
    vibration_point: { x: string; y: string; z: string },
    position: string,
  ) => {
    console.log("handleGetVibrationData : ", equipment);
    const data_out = [];
    data_out.push({
      node_code: "",
      node_id: equipment.x_id,
      data_index: 20,
      time: vibration_point.x,
    });
    data_out.push({
      node_code: "",
      node_id: equipment.y_id,
      data_index: 20,
      time: vibration_point.y,
    });
    data_out.push({
      node_code: "",
      node_id: equipment.z_id,
      data_index: 20,
      time: vibration_point.z,
    });
    getAnalysisData.mutate(data_out, {
      onSuccess: (data) => {
        console.log("Vibration Analysis Data: ", data);
        setVibrationAnalysisData((prev) => ({ ...prev, [position]: data }));
        setDialogOpen(() => ({ ...dialogOpen, [position]: false }));
        console.log(
          "Dialog Open: ",
          dialogOpen[position],
          "position: ",
          position,
        );
      },
      onError: () => {
        setDialogOpen(() => ({ ...dialogOpen, [position]: false }));
      },
    });
  };

  useEffect(() => {
    console.log("vibrationAnalysisData: ", vibrationAnalysisData);
  }, [vibrationAnalysisData]);

  const handleToggleVibAxis = React.useCallback(
    (position: string, axis: "x" | "y" | "z") => {
      setSelectedVibAxes((prev) => ({
        ...prev,
        [position]: prev[position].includes(axis)
          ? prev[position].filter((a) => a !== axis)
          : [...prev[position], axis],
      }));
    },
    [],
  );

  const handleVisualCheckListRender = (pump_type: string) => {
    const visual_check_list = [
      {
        check: "bolt_check",
        remark: "bolt_remark",
        label: "Bolt",
      },
      {
        check: "electrical_check",
        remark: "electrical_remark",
        label: "Electrical",
      },
      {
        check: "corrosion_check",
        remark: "corrosion_remark",
        label: "Corrosion",
      },
      {
        check: "oil_grease_check",
        remark: "oil_grease_remark",
        label: "Oil & Grease",
      },
      { check: "oil_check", remark: "oil_remark", label: "Oil" },
      {
        check: "painting_check",
        remark: "painting_remark",
        label: "Painting",
      },
      {
        check: "cleanness_check",
        remark: "cleanness_remark",
        label: "Cleanness",
      },
      {
        check: "chemical_clogging_check",
        remark: "chemical_clogging_remark",
        label: "Chemical Clogging",
      },
      {
        check: "suction_valve_check",
        remark: "suction_valve_remark",
        label: "Suction Valve",
      },
      {
        check: "discharge_valve_check",
        remark: "discharge_valve_remark",
        label: "Discharge Valve",
      },
      {
        check: "hydraulic_air_check",
        remark: "hydraulic_air_remark",
        label: "Hydraulic Air",
      },
      {
        check: "air_supply_check",
        remark: "air_supply_remark",
        label: "Air Supply",
      },
      {
        check: "air_filter_check",
        remark: "air_filter_remark",
        label: "Air Filter",
      },
      {
        check: "air_filter_condense_check",
        remark: "air_filter_condense_remark",
        label: "Air Filter Condense",
      },
      {
        check: "mechanical_check",
        remark: "mechanical_remark",
        label: "Mechanical",
      },
      {
        check: "coupling_check",
        remark: "coupling_remark",
        label: "Coupling",
      },
      {
        check: "gap_check",
        remark: "gap_remark",
        label: "Gap",
      },
      {
        check: "seal_check",
        remark: "seal_remark",
        label: "Seal",
      },
      {
        check: "alignment_check",
        remark: "alignment_remark",
        label: "Alignment",
      },
      {
        check: "rotate_hand_check",
        remark: "rotate_hand_remark",
        label: "Rotate by Hand",
      },
      {
        check: "rotating_check",
        remark: "rotating_remark",
        label: "Rotating",
      },
      {
        check: "noise_run_check",
        remark: "noise_run_remark",
        label: "Noise (Run)",
      },
      {
        check: "noise_check",
        remark: "noise_remark",
        label: "Noise",
      },
      {
        check: "oil_run_check",
        remark: "oil_run_remark",
        label: "Oil (Run)",
      },
      {
        check: "leakage_run_check",
        remark: "leakage_run_remark",
        label: "Leakage (Run)",
      },
      {
        check: "impeller_stutter_check",
        remark: "impeller_stutter_remark",
        label: "Impeller Stutter",
      },
      {
        check: "cavitation_run_check",
        remark: "cavitation_run_remark",
        label: "Cavitation (Run)",
      },
      {
        check: "other_leakage_check",
        remark: "other_leakage_remark",
        label: "Other Leakage",
      },
      {
        check: "non_re_valve_check",
        remark: "non_re_valve_remark",
        label: "Non-Return Valve",
      },
    ] as const;

    switch (pump_type) {
      case "Agitator":
        return visual_check_list.filter((item) =>
          [
            "bolt_check",
            "corrosion_check",
            "oil_grease_check",
            "painting_check",
            "cleanness_check",
            "chemical_clogging_check",
            "mechanical_check",
            "coupling_check",
            "seal_check",
            "impeller_stutter_check",
            "noise_run_check",
            "leakage_run_check",
          ].includes(item.check),
        );

      case "Centrifugal":
      case "Gear":
      case "Have": // Grouping similar types
        return visual_check_list.filter((item) =>
          [
            "bolt_check",
            "corrosion_check",
            "oil_grease_check",
            "painting_check",
            "cleanness_check",
            "mechanical_check",
            "coupling_check",
            "gap_check",
            "seal_check",
            "alignment_check",
            "rotate_hand_check",
            "noise_run_check",
            "leakage_run_check",
            "cavitation_run_check",
          ].includes(item.check),
        );

      case "Metering Hydraulic":
        return visual_check_list.filter((item) =>
          [
            "bolt_check",
            "corrosion_check",
            "painting_check",
            "cleanness_check",
            "chemical_clogging_check",
            "suction_valve_check",
            "discharge_valve_check",
            "hydraulic_air_check",
            "seal_check",
            "noise_run_check",
            "other_leakage_check",
          ].includes(item.check),
        );

      case "Metering Mechanical":
        return visual_check_list.filter((item) =>
          [
            "bolt_check",
            "corrosion_check",
            "painting_check",
            "cleanness_check",
            "chemical_clogging_check",
            "suction_valve_check",
            "discharge_valve_check",
            "air_supply_check",
            "air_filter_check",
            "air_filter_condense_check",
            "seal_check",
            "other_leakage_check",
            "noise_run_check",
          ].includes(item.check),
        );

      case "Submersible":
        return visual_check_list.filter((item) =>
          [
            "electrical_check",
            "corrosion_check",
            "cleanness_check",
            "mechanical_check",
          ].includes(item.check),
        );

      case "Vacuum":
        return visual_check_list.filter((item) =>
          [
            "bolt_check",
            "corrosion_check",
            "oil_grease_check",
            "painting_check",
            "cleanness_check",
            "air_filter_condense_check",
            "mechanical_check",
            "coupling_check",
            "gap_check",
            "seal_check",
            "rotate_hand_check",
            "other_leakage_check",
            "non_re_valve_check",
            "noise_run_check",
            "leakage_run_check",
            "cavitation_run_check",
          ].includes(item.check),
        );

      default:
        return [];
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Report Create</h2>
        <Link to="/analytic/report" search={{ id: id }}>
          Back
        </Link>
      </div>
      <Card className="w-full mt-5">
        <CardContent>
          <Form {...engineerReportCheckCalForm}>
            <form
              onSubmit={engineerReportCheckCalForm.handleSubmit(
                handleReportCalSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    engineerReportCheckCalForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                },
              )}
            >
              <div className="flex flex-col">
                {/* Report data */}
                <div className="text-foreground dark:text-foreground grow flex-1">
                  <FormBox field="Pump Operating Condition">
                    <div className="space-y-2">
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="test_speed_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Test Speed
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="test_speed"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Test Speed"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_speed",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "test_speed_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="flow_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Operation Flow
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="flow_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Operation Flow"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_flow",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "flow_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="suction_pres_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Suction Pressure
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="suction_pres_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Suction Pressure"
                                        type="float"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "suction_pres_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="discharge_pres_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Discharge Pressure
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="discharge_pres_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Discharge Pressure"
                                        type="float"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "discharge_pres_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="diff_pres_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Difference Pressure
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="diff_pres_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Difference Pressure"
                                        type="float"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "diff_pres_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="bearing_housing_temp_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Bearing Housing Temp.
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="bearing_housing_temp"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Bearing housing temperature"
                                        type="float"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_temp",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "bearing_housing_temp_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="current_i1_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Current I1
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="current_i1_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Current I1"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "current_i1_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="current_i2_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Current I2
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="current_i2_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Current I2"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "current_i2_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="current_i3_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Current I3
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="current_i3_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Current I2"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "current_i3_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="i_avg_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Average Current
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="i_avg_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Average Current"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "i_avg_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="v_avg_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Average Voltage
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="v_avg_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Average Voltage"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_pressure",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "v_avg_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="motor_power_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor Power
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="motor_power"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Motor Power"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_power",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "motor_power_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="shaft_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Shaft Power
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="shaft_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Shaft Power"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_power",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "shaft_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="hyd_power_measure_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Hydraulic Power
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="hyd_power_measure"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Hydraulic Power"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_power",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "hyd_power_measure_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="head_ope_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Operation Head
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="head_ope"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Operation Head"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_head",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "head_ope_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="head_shut_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Operation Shut Off Head
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="head_shut"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Operation Shut Off Head"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_head",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "head_shut_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="head_max_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Operation Head Max
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="head_max"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Operation Head Max"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_head",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "head_max_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="display: hidden">
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="voltage_uv"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Voltage U-V
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Line-to-line voltage between phase U and phase V"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="voltage_vw"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Voltage V-W
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Line-to-line voltage between phase V and phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="voltage_uw"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Voltage U-W
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Line-to-line voltage between phase U and phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="voltage_un"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Voltage U-N
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Line-to-neutral voltage for phase U"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="voltage_vn"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Voltage V-N
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Line-to-neutral voltage for phase V"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="voltage_wn"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Voltage W-N
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Line-to-neutral voltage for phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_uv"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation U-V
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the windings of phase U and phase V"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_winding_ux"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation U1-U2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the windings of phase U1 and phase U2"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_vw"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation V-W
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the windings of phase V and phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_winding_vy"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation V1-V2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the windings of phase V1 and phase V2"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_uw"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation U-W
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the windings of phase U and phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_winding_wz"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation W1-W2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the windings of phase W1 and phase W2"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_un"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation U-Ground
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the winding of phase U and neutral (ground)"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_vn"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation V-Ground
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the winding of phase V and neutral (ground)"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="insulation_wn"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Insulation W-Ground
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Insulation resistance between the winding of phase W and neutral (ground)"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="current_u1"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Current U1
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Current drawn by the first winding of phase U"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="current_v1"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Current V1
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Current drawn by the first winding of phase V"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="current_w1"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Current W1
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Current drawn by the first winding of phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="current_u2"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Current U2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Current drawn by the first winding of phase U"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="current_v2"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Current V2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Current drawn by the first winding of phase V"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="current_w2"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Current W2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Current drawn by the first winding of phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="Temp_u1"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Temp U1
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Temperature of the first winding of phase U"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="Temp_v1"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Temp V1
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Temperature of the first winding of phase V"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="Temp_w1"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Temp W1
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Temperature of the first winding of phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="Temp_u2"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Temp U2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Temperature of the first winding of phase U"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="Temp_v2"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Temp V2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Temperature of the first winding of phase V"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={engineerReportCheckCalForm.control}
                          name="Temp_w2"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="w-32 lg:w-44">
                                  Temp W2
                                </FormLabel>
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Temperature of the first winding of phase W"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                    type="number"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="env_temp_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Environment Temperature
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="env_temp"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Environment Temperature"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_temp",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "env_temp_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="liquid_temp_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Liquid Temperature
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="liquid_temp"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Liquid Temperature"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_temp",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "liquid_temp_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="npsha_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                NPSHa
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="npsha"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="NPSHa"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_npshr",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "npsha_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="npsha_actual_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Actual NPSHa
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="npsha_actual"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Actual NPSHa"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_npshr",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "npsha_actual_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="suction_fluid_velo_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Suction Fluid Velocity
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="suction_fluid_velo"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Suction Fluid Velocity"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_velocity",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "suction_fluid_velo_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="discharge_fluid_velo_unit"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Discharge Fluid Velocity
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                {/* Input for density */}
                                <FormField
                                  control={engineerReportCheckCalForm.control}
                                  name="discharge_fluid_velo"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Discharge Fluid Velocity"
                                        type="number"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "unit_velocity",
                                        "pump_unit",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckCalForm.getValues(
                                        "discharge_fluid_velo_unit",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckCalForm.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Remarks
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Remarks"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormBox>
                </div>
                <div className="w-full flex align-center justify-between">
                  <Button size="sm" className="w-32 gap-2" type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Submit</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full mt-5">
        <CardContent>
          <Form {...engineerReportCheckVibrationForm}>
            <form
              onSubmit={engineerReportCheckVibrationForm.handleSubmit(
                handleReportVibrationSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    engineerReportCheckVibrationForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                },
              )}
            >
              <div className="flex flex-col">
                {/* Report data */}
                <div className="text-foreground dark:text-foreground grow flex-1">
                  <FormBox field="Vibration Check">
                    {isAutoLoadingVibe && (
                      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                        <Spinner className="h-4 w-4" />
                        Loading vibration data...
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      {/*Pump PE (NDE)*/}
                      <div>
                        {MARSEquipmentData !== null && (
                          <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-4 items-start justify-start">
                              <Label htmlFor="date">Pump PE (NDE)</Label>
                              <div className="w-full flex gap-2">
                                <Popover
                                  open={openDatePicker.pump_nde}
                                  onOpenChange={(open) =>
                                    setOpenDatePicker({
                                      ...openDatePicker,
                                      pump_nde: open,
                                    })
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      id="date"
                                      className="w-full justify-between font-normal"
                                    >
                                      {pickDate.pump_nde
                                        ? new Date(
                                            pickDate.pump_nde,
                                          ).toLocaleDateString()
                                        : "Select date"}
                                      <ChevronDownIcon />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="bg-white overflow-hidden p-2"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      className="w-full"
                                      selected={
                                        new Date(pickDate.pump_nde ?? "")
                                      }
                                      captionLayout="dropdown"
                                      onSelect={(date: any) => {
                                        handleDatePickFormatChange(
                                          date,
                                          "pump_nde",
                                        );
                                        setOpenDatePicker({
                                          ...openDatePicker,
                                          pump_nde: false,
                                        });
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <VibrationDialog
                                  position="pump_nde"
                                  equipmentId={MARSEquipmentData}
                                  isOpen={dialogOpen.pump_nde}
                                  onOpenChange={(open) =>
                                    setDialogOpen({
                                      ...dialogOpen,
                                      pump_nde: open,
                                    })
                                  }
                                  measureData={MARSMeasureData}
                                  isFetchingMeasure={
                                    getAllMeasureDataFromMars.isPending
                                  }
                                  isSubmitting={getAnalysisData.isPending}
                                  isDateSelected={pickDate.pump_nde !== ""}
                                  pickVibeDate={pickVibeDate.pump_nde}
                                  onPickVibeDateChange={(axis, value) =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      pump_nde: { ...prev.pump_nde, [axis]: value },
                                    }))
                                  }
                                  onResetVibeDate={() =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      pump_nde: { x: "", y: "", z: "" },
                                    }))
                                  }
                                  onSelectTrigger={handleSelectCordinate}
                                  onGetData={handleGetVibrationData}
                                />
                              </div>
                            </div>
                            {vibrationAnalysisData.pump_nde && (
                              <Collapsible>
                                <CollapsibleTrigger className="w-full border-y-2 py-2 hover:bg-secondary/50 data-[state=open]:bg-secondary/50">
                                  Vibration Graphs
                                </CollapsibleTrigger>
                                <CollapsibleContent className="border-b-2 pb-12">
                                  <VibrationGraphs
                                    data={vibrationAnalysisData.pump_nde}
                                    selectedAxes={selectedVibAxes.pump_nde}
                                    onToggleAxis={(axis) =>
                                      handleToggleVibAxis("pump_nde", axis)
                                    }
                                  />
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>
                        )}
                      </div>
                      {/*Pump CE (DE)*/}
                      <div>
                        {MARSEquipmentData !== null && (
                          <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-4 items-start justify-start">
                              <Label htmlFor="date">Pump CE (DE)</Label>
                              <div className="w-full flex gap-2">
                                <Popover
                                  open={openDatePicker.pump_de}
                                  onOpenChange={(open) =>
                                    setOpenDatePicker({
                                      ...openDatePicker,
                                      pump_de: open,
                                    })
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      id="date"
                                      className="w-full justify-between font-normal"
                                    >
                                      {pickDate.pump_de
                                        ? new Date(
                                            pickDate.pump_de,
                                          ).toLocaleDateString()
                                        : "Select date"}
                                      <ChevronDownIcon />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="bg-white overflow-hidden p-2"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      className="w-full"
                                      selected={
                                        new Date(pickDate.pump_de ?? "")
                                      }
                                      captionLayout="dropdown"
                                      onSelect={(date: any) => {
                                        handleDatePickFormatChange(
                                          date,
                                          "pump_de",
                                        );
                                        setOpenDatePicker({
                                          ...openDatePicker,
                                          pump_de: false,
                                        });
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <VibrationDialog
                                  position="pump_de"
                                  equipmentId={MARSEquipmentData}
                                  isOpen={dialogOpen.pump_de}
                                  onOpenChange={(open) =>
                                    setDialogOpen({
                                      ...dialogOpen,
                                      pump_de: open,
                                    })
                                  }
                                  measureData={MARSMeasureData}
                                  isFetchingMeasure={
                                    getAllMeasureDataFromMars.isPending
                                  }
                                  isSubmitting={getAnalysisData.isPending}
                                  isDateSelected={pickDate.pump_de !== ""}
                                  pickVibeDate={pickVibeDate.pump_de}
                                  onPickVibeDateChange={(axis, value) =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      pump_de: { ...prev.pump_de, [axis]: value },
                                    }))
                                  }
                                  onResetVibeDate={() =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      pump_de: { x: "", y: "", z: "" },
                                    }))
                                  }
                                  onSelectTrigger={handleSelectCordinate}
                                  onGetData={handleGetVibrationData}
                                />
                              </div>
                            </div>
                            {vibrationAnalysisData.pump_de && (
                              <Collapsible>
                                <CollapsibleTrigger className="w-full border-y-2 py-2 hover:bg-secondary/50 data-[state=open]:bg-secondary/50">
                                  Vibration Graphs
                                </CollapsibleTrigger>
                                <CollapsibleContent className="border-b-2 pb-12">
                                  <VibrationGraphs
                                    data={vibrationAnalysisData.pump_de}
                                    selectedAxes={selectedVibAxes.pump_de}
                                    onToggleAxis={(axis) =>
                                      handleToggleVibAxis("pump_de", axis)
                                    }
                                  />
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>
                        )}
                      </div>
                      {/*Motor NDE*/}
                      <div>
                        {MARSEquipmentData !== null && (
                          <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-4 items-start justify-start">
                              <Label htmlFor="date">Motor NDE</Label>
                              <div className="w-full flex gap-2">
                                <Popover
                                  open={openDatePicker.motor_nde}
                                  onOpenChange={(open) =>
                                    setOpenDatePicker({
                                      ...openDatePicker,
                                      motor_nde: open,
                                    })
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      id="date"
                                      className="w-full justify-between font-normal"
                                    >
                                      {pickDate.motor_nde
                                        ? new Date(
                                            pickDate.motor_nde,
                                          ).toLocaleDateString()
                                        : "Select date"}
                                      <ChevronDownIcon />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="bg-white overflow-hidden p-2"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      className="w-full"
                                      selected={
                                        new Date(pickDate.motor_nde ?? "")
                                      }
                                      captionLayout="dropdown"
                                      onSelect={(date: any) => {
                                        handleDatePickFormatChange(
                                          date,
                                          "motor_nde",
                                        );
                                        setOpenDatePicker({
                                          ...openDatePicker,
                                          motor_nde: false,
                                        });
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <VibrationDialog
                                  position="motor_nde"
                                  equipmentId={MARSEquipmentData}
                                  isOpen={dialogOpen.motor_nde}
                                  onOpenChange={(open) =>
                                    setDialogOpen({
                                      ...dialogOpen,
                                      motor_nde: open,
                                    })
                                  }
                                  measureData={MARSMeasureData}
                                  isFetchingMeasure={
                                    getAllMeasureDataFromMars.isPending
                                  }
                                  isSubmitting={getAnalysisData.isPending}
                                  isDateSelected={pickDate.motor_nde !== ""}
                                  pickVibeDate={pickVibeDate.motor_nde}
                                  onPickVibeDateChange={(axis, value) =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      motor_nde: { ...prev.motor_nde, [axis]: value },
                                    }))
                                  }
                                  onResetVibeDate={() =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      motor_nde: { x: "", y: "", z: "" },
                                    }))
                                  }
                                  onSelectTrigger={handleSelectCordinate}
                                  onGetData={handleGetVibrationData}
                                />
                              </div>
                            </div>
                            {vibrationAnalysisData.motor_nde && (
                              <Collapsible>
                                <CollapsibleTrigger className="w-full border-y-2 py-2 hover:bg-secondary/50 data-[state=open]:bg-secondary/50">
                                  Vibration Graphs
                                </CollapsibleTrigger>
                                <CollapsibleContent className="border-b-2 pb-12">
                                  <VibrationGraphs
                                    data={vibrationAnalysisData.motor_nde}
                                    selectedAxes={selectedVibAxes.motor_nde}
                                    onToggleAxis={(axis) =>
                                      handleToggleVibAxis("motor_nde", axis)
                                    }
                                  />
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Motor DE */}
                      <div>
                        {MARSEquipmentData !== null && (
                          <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-4 items-start justify-start">
                              <Label htmlFor="date">Motor DE</Label>
                              <div className="w-full flex gap-2">
                                <Popover
                                  open={openDatePicker.motor_de}
                                  onOpenChange={(open) =>
                                    setOpenDatePicker({
                                      ...openDatePicker,
                                      motor_de: open,
                                    })
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      id="date"
                                      className="w-full justify-between font-normal"
                                    >
                                      {pickDate.motor_de
                                        ? new Date(
                                            pickDate.motor_de,
                                          ).toLocaleDateString()
                                        : "Select date"}
                                      <ChevronDownIcon />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="bg-white overflow-hidden p-2"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      className="w-full"
                                      selected={
                                        new Date(pickDate.motor_de ?? "")
                                      }
                                      captionLayout="dropdown"
                                      onSelect={(date: any) => {
                                        handleDatePickFormatChange(
                                          date,
                                          "motor_de",
                                        );
                                        setOpenDatePicker({
                                          ...openDatePicker,
                                          motor_de: false,
                                        });
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <VibrationDialog
                                  position="motor_de"
                                  equipmentId={MARSEquipmentData}
                                  isOpen={dialogOpen.motor_de}
                                  onOpenChange={(open) =>
                                    setDialogOpen({
                                      ...dialogOpen,
                                      motor_de: open,
                                    })
                                  }
                                  measureData={MARSMeasureData}
                                  isFetchingMeasure={
                                    getAllMeasureDataFromMars.isPending
                                  }
                                  isSubmitting={getAnalysisData.isPending}
                                  isDateSelected={pickDate.motor_de !== ""}
                                  pickVibeDate={pickVibeDate.motor_de}
                                  onPickVibeDateChange={(axis, value) =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      motor_de: { ...prev.motor_de, [axis]: value },
                                    }))
                                  }
                                  onResetVibeDate={() =>
                                    setPickVibeDate((prev) => ({
                                      ...prev,
                                      motor_de: { x: "", y: "", z: "" },
                                    }))
                                  }
                                  onSelectTrigger={handleSelectCordinate}
                                  onGetData={handleGetVibrationData}
                                />
                              </div>
                            </div>
                            {vibrationAnalysisData.motor_de && (
                              <Collapsible>
                                <CollapsibleTrigger className="w-full border-y-2 py-2 hover:bg-secondary/50 data-[state=open]:bg-secondary/50">
                                  Vibration Graphs
                                </CollapsibleTrigger>
                                <CollapsibleContent className="border-b-2 pb-12">
                                  <VibrationGraphs
                                    data={vibrationAnalysisData.motor_de}
                                    selectedAxes={selectedVibAxes.motor_de}
                                    onToggleAxis={(axis) =>
                                      handleToggleVibAxis("motor_de", axis)
                                    }
                                  />
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-full flex md:flex-row flex-col gap-4 py-4">
                        <Table className="border-r">
                          <TableHeader>
                            <TableRow className="border border-none hover:bg-transparent">
                              <TableHead
                                colSpan={1}
                                className="w-8"
                              ></TableHead>
                              <TableHead
                                colSpan={1}
                                className="w-[150px]"
                              ></TableHead>
                              <TableHead
                                colSpan={2}
                                className="text-center border"
                              >
                                Pump
                              </TableHead>
                            </TableRow>
                            <TableRow className="hover:bg-transparent">
                              <TableCell colSpan={1}></TableCell>
                              <TableHead colSpan={1}></TableHead>
                              <TableHead
                                colSpan={1}
                                className="text-center border-x"
                              >
                                PE (NDE)
                              </TableHead>
                              <TableHead colSpan={1} className="text-center">
                                CE (DE)
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="border">
                            <TableCell
                              rowSpan={4}
                              className="text-center align-middle border-r"
                            >
                              <div className="rotate-[-90deg] whitespace-nowrap">
                                Axial
                              </div>
                            </TableCell>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Acceleration (m/s²)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.y.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.y.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Velocity (mm/s)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.y.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.y.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Displacement (µm)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.y.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.y.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableCell
                              rowSpan={4}
                              className="text-center align-middle border-r"
                            >
                              <div className="rotate-[-90deg] whitespace-nowrap text-center align-middle">
                                Horizontal
                              </div>
                            </TableCell>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Acceleration (m/s²)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.x.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.x.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Velocity (mm/s)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.x.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.x.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Displacement (µm)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.x.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.x.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableCell
                              rowSpan={4}
                              className="text-center align-middle border-r"
                            >
                              <div className="rotate-[-90deg] whitespace-nowrap text-center align-middle">
                                Vertical
                              </div>
                            </TableCell>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Acceleration (m/s²)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.z.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.z.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Velocity (mm/s)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.z.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.z.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Displacement (µm)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_nde?.z.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.pump_de?.z.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Table className="border-r">
                          <TableHeader>
                            <TableRow className="border border-none hover:bg-transparent">
                              <TableHead
                                colSpan={1}
                                className="w-8"
                              ></TableHead>
                              <TableHead
                                colSpan={1}
                                className="w-[150px]"
                              ></TableHead>
                              <TableHead
                                colSpan={2}
                                className="text-center border "
                              >
                                Motor
                              </TableHead>
                            </TableRow>
                            <TableRow className="hover:bg-transparent">
                              <TableHead colSpan={1}></TableHead>
                              <TableHead colSpan={1}></TableHead>
                              <TableHead
                                colSpan={1}
                                className="text-center border-x"
                              >
                                NDE
                              </TableHead>
                              <TableHead
                                colSpan={1}
                                className="text-center border-r"
                              >
                                DE
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="border">
                            <TableCell
                              rowSpan={4}
                              className="text-center align-middle border-r"
                            >
                              <div className="rotate-[-90deg] whitespace-nowrap">
                                Axial
                              </div>
                            </TableCell>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Acceleration (m/s²)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.y.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.y.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Velocity (mm/s)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.y.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.y.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Displacement (µm)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.y.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.y.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableCell
                              rowSpan={4}
                              className="text-center align-middle border-r"
                            >
                              <div className="rotate-[-90deg] whitespace-nowrap text-center align-middle">
                                Horizontal
                              </div>
                            </TableCell>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Acceleration (m/s²)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.x.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.x.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Velocity (mm/s)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.x.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.x.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Displacement (µm)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.x.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.x.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableCell
                              rowSpan={4}
                              className="text-center align-middle border-r"
                            >
                              <div className="rotate-[-90deg] whitespace-nowrap text-center align-middle">
                                Vertical
                              </div>
                            </TableCell>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Acceleration (m/s²)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.z.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.z.acceleration.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Velocity (mm/s)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.z.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.z.velocity.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-start align-middle border-r">
                                Displacement (µm)
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_nde?.z.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                              <TableCell className="text-right align-middle border-r">
                                {vibrationAnalysisData.motor_de?.z.displacement.rms?.toFixed(4) ?? "-"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      <FormField
                        control={engineerReportCheckVibrationForm.control}
                        name="temp_pump_de"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump DE temp. (°C)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump drive end temperature"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVibrationForm.control}
                        name="temp_pump_nde"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump NDE temp. (°C)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump non-drive end temperature"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVibrationForm.control}
                        name="temp_motor_de"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor DE temp. (°C)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor drive end temperature"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVibrationForm.control}
                        name="temp_motor_nde"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor NDE temp. (°C)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor non-drive end temperature"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVibrationForm.control}
                        name="env_vibration"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Environmental Vibration (mm/s)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Environmental Vibration"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormBox>
                </div>
                <div className="w-full flex align-center justify-between">
                  <Button size="sm" className="w-32 gap-2" type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Submit</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full mt-5">
        <CardContent>
          <Form {...engineerReportCheckVisualForm}>
            <form
              onSubmit={engineerReportCheckVisualForm.handleSubmit(
                handleReportVisualSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    engineerReportCheckVisualForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                },
              )}
            >
              <div className="flex flex-col">
                {/* Report data */}
                <div className="text-foreground dark:text-foreground grow flex-1">
                  <FormBox field="Visual Check">
                    <div className="space-y-2">
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="axial_hand_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Axial Hand
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "axial_hand_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="axial_hand_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="electricity_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Electricity
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "electricity_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="electricity_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="service_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Service
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "service_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="service_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="leakage_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Leakage
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "leakage_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="leakage_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="oil_grease_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Oil/Grease (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "oil_grease_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="oil_grease_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="mechanical_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Mechanical (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "mechanical_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="mechanical_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="corrosion_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Corrosion (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "corrosion_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="corrosion_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="suction_valve_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Suction Valve (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "suction_valve_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="suction_valve_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="discharge_valve_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Discharge Valve (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "discharge_valve_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="discharge_valve_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="painting_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Painting (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "painting_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="painting_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="electric_connectivity_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Electric Connectivity (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "electric_connectivity_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="electric_connectivity_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="service_piping_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Service Piping (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "service_piping_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="service_piping_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="bolt_nut_run_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Bolt & Nut (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "bolt_nut_run_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="bolt_nut_run_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="barrier_fluid_run_pres_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Barrier Fluid (Run)
                              </FormLabel>
                              <div className="w-full flex gap-2">
                                <FormControl className="md:max-w-[500px]">
                                  <Combobox
                                    className="min-w-[86px]"
                                    items={
                                      handleLOVDataFilter(
                                        "visual_check",
                                        "report_data",
                                      ) || []
                                    } // Dropdown options
                                    label={
                                      engineerReportCheckVisualForm.getValues(
                                        "barrier_fluid_run_pres_check",
                                      ) ?? "Select"
                                    }
                                    onChange={(value) => {
                                      field.onChange(value); // Update form state
                                    }}
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckVisualForm.control
                                  }
                                  name="barrier_fluid_run_pres_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckVisualForm.control}
                        name="remarks_check"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Remark
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Remark"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Varies check items by pump type can be added here following the same pattern */}

                      {handleVisualCheckListRender(
                        reportCheckData?.pump_data.pump_type_name,
                      ).map((item) => {
                        if (item.check) {
                          return (
                            <FormField
                              control={engineerReportCheckVisualForm.control}
                              name={item.check}
                              render={({ field: field }) => (
                                <FormItem>
                                  <div
                                    className="w-full flex items-center"
                                    key={item.check}
                                  >
                                    <FormLabel className="w-32 lg:w-44">
                                      {item.label}
                                    </FormLabel>
                                    <div className="w-full flex gap-2">
                                      <FormControl className="md:max-w-[500px]">
                                        <Combobox
                                          className="min-w-[86px]"
                                          items={
                                            handleLOVDataFilter(
                                              "visual_check",
                                              "report_data",
                                            ) || []
                                          } // Dropdown options
                                          label={
                                            engineerReportCheckVisualForm.getValues(
                                              item.check,
                                            ) ?? "Select"
                                          }
                                          onChange={(value) => {
                                            field.onChange(value); // Update form state
                                          }}
                                        />
                                      </FormControl>
                                      <FormField
                                        control={
                                          engineerReportCheckVisualForm.control
                                        }
                                        name={item.remark}
                                        render={({ field: field }) => (
                                          <FormControl className="w-full">
                                            <Input
                                              placeholder="Remark"
                                              {...field}
                                              value={field.value || ""} // Ensure the value is never undefined
                                            />
                                          </FormControl>
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          );
                        }
                      })}
                    </div>
                  </FormBox>
                </div>
                <div className="w-full flex align-center justify-between">
                  <Button size="sm" className="w-32 gap-2" type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Submit</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full mt-5">
        <CardContent>
          <Form {...engineerReportCheckResultForm}>
            <form
              onSubmit={engineerReportCheckResultForm.handleSubmit(
                handleReportResultSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    engineerReportCheckResultForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                },
              )}
            >
              <div className="flex flex-col">
                {/* Report data */}
                <div className="text-foreground dark:text-foreground grow flex-1">
                  <FormBox field="Result">
                    <div className="space-y-2">
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="speed_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Speed Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Speed Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="flow_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Flow Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Flow Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="npshr_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                NPSHr Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="NPSHr Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="velocity_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Velocity Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Velocity Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="boiling_point_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Boiling Point Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Boiling Point Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="current_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Current Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Current Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="api_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                API Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="API Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="buffer_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Buffer Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Buffer Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="bearing_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Bearing Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Bearing Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="vibration_suggest"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Vibration Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Vibration Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="timestamp"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Bearing Temp. Suggest
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Bearing Temp. Suggest"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="range_30_110_result"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Range 30-110
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Result"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="range_30_110_suggest"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Suggest"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="range_30_110_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="npshr_npsha_result"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                NPSHr / NPSHa
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Result"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="npshr_npsha_suggest"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Suggest"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="npshr_npsha_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="pump_standard_result"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Pump Standard
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Result"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="pump_standard_suggest"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Suggest"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="pump_standard_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="power_result"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Power
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Result"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="power_suggest"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Suggest"
                                            {...field}
                                            value={field.value || ""} // Ensure the value is never undefined
                                          />
                                        </FormControl>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="power_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="fluid_temp_result"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Fluid Temperature
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Result"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="fluid_temp_suggest"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Suggest"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="fluid_temp_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="bearing_temp_result"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Bearing Temperature
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Result"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="bearing_temp_suggest"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Suggest"
                                            {...field}
                                            value={field.value || ""} // Ensure the value is never undefined
                                          />
                                        </FormControl>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="bearing_temp_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_pump_de_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump drive end vibration result (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump drive end vibration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_pump_de_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump drive end vibration result (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump drive end vibration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_pump_de_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump drive end vibration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump drive end vibration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_pump_nde_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump none-drive end vibration result
                                (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump none-drive end vibration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_pump_nde_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump none-drive end vibration result (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump none-drive end vibration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_pump_nde_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump none-drive end vibration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump none-drive end vibration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_motor_de_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor drive end vibration result (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor drive end vibration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_motor_de_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor drive end vibration result (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor drive end vibration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_motor_de_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor drive end vibration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor drive end vibration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_motor_nde_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor none-drive end vibration result
                                (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor none-drive end vibration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_motor_nde_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor none-drive end vibration result (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor none-drive end vibration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_motor_nde_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor none-drive end vibration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor none-drive end vibration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_pump_de_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump drive end acceleration result (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump drive end acceleration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_pump_de_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump drive end acceleration result (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump drive end acceleration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_pump_de_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump drive end acceleration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump drive end acceleration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_pump_nde_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump none-drive end acceleration result
                                (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump none-drive end acceleration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_pump_nde_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump none-drive end acceleration result
                                (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump none-drive end acceleration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_pump_nde_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Pump none-drive end acceleration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Pump none-drive end acceleration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_motor_de_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor drive end acceleration result (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor drive end acceleration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_motor_de_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor drive end acceleration result (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor drive end acceleration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_motor_de_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor drive end acceleration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor drive end acceleration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_motor_nde_h_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor none-drive end acceleration result
                                (horizontal)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor none-drive end acceleration result (horizontal)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_motor_nde_v_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor none-drive end acceleration result
                                (Vertical)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor none-drive end acceleration result (Vertical)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_motor_nde_a_result"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="w-32 lg:w-44">
                                Motor none-drive end acceleration result (Axial)
                              </FormLabel>
                              <FormControl className="w-full">
                                <Input
                                  placeholder="Motor none-drive end acceleration result (Axial)"
                                  {...field}
                                  value={field.value || ""} // Ensure the value is never undefined
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_pump_suggest"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Pump Suggest
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Suggest"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="v_pump_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="v_motor_suggest"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Motor Suggest
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Suggest"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="v_motor_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_pump_suggest"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Pump Suggest
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Suggest"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="a_pump_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={engineerReportCheckResultForm.control}
                        name="a_motor_suggest"
                        render={({ field: field }) => (
                          <FormItem>
                            <div className="w-full flex items-start">
                              <FormLabel className="w-32 lg:w-44 pt-2">
                                Motor Acceleration Suggest
                              </FormLabel>
                              <div className="w-full flex flex-col gap-2">
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Suggest"
                                    {...field}
                                    value={field.value || ""} // Ensure the value is never undefined
                                  />
                                </FormControl>
                                <FormField
                                  control={
                                    engineerReportCheckResultForm.control
                                  }
                                  name="a_motor_remark"
                                  render={({ field: field }) => (
                                    <FormControl className="w-full">
                                      <Input
                                        placeholder="Remark"
                                        {...field}
                                        value={field.value || ""} // Ensure the value is never undefined
                                      />
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormBox>
                </div>
                <div className="w-full flex align-center justify-between">
                  <Button size="sm" className="w-32 gap-2" type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Submit</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/analytic/report_edit")({
  component: ReportEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
