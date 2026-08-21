import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormBox } from "@/components/common/FormBox";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";

import {
  useGetAllUnitLOVData,
  useGetPumpDetailLOV,
  useGetMediaLOVData,
} from "@/hook/pump/pump";
import { useGetCalPumpData } from "@/hook/factory_curve/factory_curve";
import { HeadFlowGraph } from "@/components/chart/HeadFlowGraph";
import { PumpDetailLOVResponse, MediaLOVResponse } from "@/types/pump/pumps";

const OperatingPointSchema = z.object({
  design_impeller_dia: z.string().min(1, "*Required"),
  pump_model: z.string().min(1, "*Required"),
  pump_model_size: z.string().min(1, "*Required"),
  pump_speed: z.string().min(1, "*Required"),
  pump_speed_unit: z.string().min(1, "*Required"),
  design_flow: z.string().min(1, "*Required"),
  design_flow_unit: z.string().min(1, "*Required"),
  design_head: z.string().min(1, "*Required"),
  design_head_unit: z.string().min(1, "*Required"),
  media_name: z.string().min(1, "*Required"),
  media_density: z.string().min(1, "*Required"),
  media_density_unit: z.string().min(1, "*Required"),
  npsha: z.string().optional(),
  operating_temperature: z.string().optional(),
});

type OperatingPointForm = z.infer<typeof OperatingPointSchema>;

function FactoryCurveAnalyze() {
  const [pumpModelSearch, setPumpModelSearch] = useState("");
  const [pumpModelResults, setPumpModelResults] = useState<
    PumpDetailLOVResponse[] | undefined
  >();
  const [pumpDetailCalData, setPumpDetailCalData] = useState<any>();

  const { data: pumpDetailLOVResponse } = useGetPumpDetailLOV("");
  const { data: pumpUnitLOVResponse } = useGetAllUnitLOVData();
  const { data: mediaData } = useGetMediaLOVData("") as {
    data: MediaLOVResponse[];
  };

  const pumpUnitLOVData: ComboboxItemProps[] =
    pumpUnitLOVResponse?.map((data) => ({
      type_name: data.type_name,
      product_name: data.product_name,
      value: data.data_value,
      label: data.data_value,
    })) || [];

  const mediaLOVData: ComboboxItemProps[] =
    mediaData?.map((data) => ({
      type_name: "media",
      product_name: "media",
      value: data.media_name ?? "",
      label: data.media_name ?? "",
    })) || [];

  const handleLOVDataFilter = (name: string) =>
    pumpUnitLOVData.filter((data) => data.product_name === name);

  const form = useForm<OperatingPointForm>({
    resolver: zodResolver(OperatingPointSchema),
  });

  const handleSelectPumpModel = (data: PumpDetailLOVResponse) => {
    form.setValue("pump_model", data.pump_model ?? "");
    form.setValue("pump_model_size", data.pump_model_size ?? "");
    form.clearErrors(["pump_model", "pump_model_size"]);
  };

  const handleSelectMedia = (value: string) => {
    form.setValue("media_name", value);
    const selected = mediaData?.find((item) => item.media_name === value);
    if (selected) {
      form.setValue("media_density", selected.media_density ?? "");
      form.setValue("media_density_unit", selected.media_density_unit ?? "");
    }
    form.clearErrors(["media_name", "media_density", "media_density_unit"]);
  };

  const { mutate, isPending, isError } = useGetCalPumpData();

  const handleCalculateClick = form.handleSubmit((values) => {
    mutate(values, {
      onSuccess: (data) => {
        setPumpDetailCalData(data);
      },
      onError: (err: any) => {
        console.error("Calculation failed:", err.message);
      },
    });
  });

  const hasCalcError = pumpDetailCalData && pumpDetailCalData.error;
  const hasCalcResult = pumpDetailCalData && !pumpDetailCalData.error;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Factory Curve Analyze
        </h2>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <FormBox
                field="Operating Point"
                description="Enter only the data needed to check an operating point against the factory curve."
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="pump_model"
                    render={({ field }) => (
                      <FormItem>
                        <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                          <FormLabel className="w-32 lg:w-44">
                            Pump Model
                          </FormLabel>
                          <div className="w-full flex gap-2">
                            <FormControl>
                              <Input
                                placeholder="Pump Model"
                                {...field}
                                readOnly
                              />
                            </FormControl>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button type="button" className="w-32 gap-1">
                                  <Search className="h-3.5 w-3.5" />
                                  Find
                                </Button>
                              </SheetTrigger>
                              <SheetContent
                                side="right"
                                className="w-[400px] sm:w-[540px]"
                                style={{ zIndex: 1000 }}
                              >
                                <SheetHeader>
                                  <SheetTitle>Select a Pump Model</SheetTitle>
                                  <SheetDescription>
                                    Choose a pump model from the list below
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="py-6">
                                  <Input
                                    placeholder="Search model..."
                                    className="mb-6"
                                    value={pumpModelSearch}
                                    onChange={(e) => {
                                      const searchValue =
                                        e.target.value.toLowerCase();
                                      setPumpModelSearch(e.target.value);
                                      setPumpModelResults(
                                        pumpDetailLOVResponse?.filter((data) =>
                                          data.pump_model
                                            ?.toLowerCase()
                                            .includes(searchValue),
                                        ),
                                      );
                                    }}
                                  />
                                  <div className="space-y-4 h-[400px] max-h-[400px] overflow-y-auto">
                                    {(pumpModelSearch === ""
                                      ? pumpDetailLOVResponse
                                      : pumpModelResults
                                    )?.length ? (
                                      (pumpModelSearch === ""
                                        ? pumpDetailLOVResponse
                                        : pumpModelResults
                                      )?.map((data) => (
                                        <SheetClose
                                          key={data.pump_lov_id}
                                          className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                          onClick={() =>
                                            handleSelectPumpModel(data)
                                          }
                                        >
                                          <div className="font-medium">
                                            {data.pump_code_name}
                                          </div>
                                          <div className="text-sm text-muted-foreground flex flex-col items-start">
                                            <p>Brand : {data.pump_brand}</p>
                                            <p>Model : {data.pump_model}</p>
                                            <p>
                                              Model Size :{" "}
                                              {data.pump_model_size}
                                            </p>
                                          </div>
                                        </SheetClose>
                                      ))
                                    ) : (
                                      <div className="h-[400px] p-3 border rounded-md flex justify-center items-center">
                                        <p className="text-sm">
                                          Pump not found.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <SheetFooter>
                                  <SheetClose asChild>
                                    <Button type="button">Done</Button>
                                  </SheetClose>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="design_impeller_dia"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel className="w-32 lg:w-44">
                            Impeller Diameter (mm)
                          </FormLabel>
                          <FormControl className="w-full">
                            <Input
                              placeholder="Impeller Diameter (mm)"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pump_speed_unit"
                    render={({ field: unitField }) => (
                      <FormItem>
                        <div className="w-full flex items-center">
                          <FormLabel className="w-32 lg:w-44">Speed</FormLabel>
                          <div className="w-full flex gap-2">
                            <FormField
                              control={form.control}
                              name="pump_speed"
                              render={({ field }) => (
                                <FormControl className="w-full">
                                  <Input placeholder="Speed" {...field} />
                                </FormControl>
                              )}
                            />
                            <FormControl className="md:max-w-[500px]">
                              <Combobox
                                className="min-w-[86px]"
                                items={handleLOVDataFilter("unit_speed")}
                                label={unitField.value || "Select"}
                                onChange={(value) => unitField.onChange(value)}
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="design_flow_unit"
                    render={({ field: unitField }) => (
                      <FormItem>
                        <div className="w-full flex items-center">
                          <FormLabel className="w-32 lg:w-44">Flow</FormLabel>
                          <div className="w-full flex gap-2">
                            <FormField
                              control={form.control}
                              name="design_flow"
                              render={({ field }) => (
                                <FormControl className="w-full">
                                  <Input placeholder="Flow" {...field} />
                                </FormControl>
                              )}
                            />
                            <FormControl className="md:max-w-[500px]">
                              <Combobox
                                className="min-w-[86px]"
                                items={handleLOVDataFilter("unit_flow")}
                                label={unitField.value || "Select"}
                                onChange={(value) => unitField.onChange(value)}
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="design_head_unit"
                    render={({ field: unitField }) => (
                      <FormItem>
                        <div className="w-full flex items-center">
                          <FormLabel className="w-32 lg:w-44">Head</FormLabel>
                          <div className="w-full flex gap-2">
                            <FormField
                              control={form.control}
                              name="design_head"
                              render={({ field }) => (
                                <FormControl className="w-full">
                                  <Input placeholder="Head" {...field} />
                                </FormControl>
                              )}
                            />
                            <FormControl className="md:max-w-[500px]">
                              <Combobox
                                className="min-w-[86px]"
                                items={handleLOVDataFilter("unit_head")}
                                label={unitField.value || "Select"}
                                onChange={(value) => unitField.onChange(value)}
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="media_name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel className="w-32 lg:w-44">Media</FormLabel>
                          <FormControl className="w-full">
                            <Combobox
                              items={mediaLOVData}
                              label={field.value || "Select"}
                              onChange={handleSelectMedia}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="media_density_unit"
                    render={({ field: unitField }) => (
                      <FormItem>
                        <div className="w-full flex items-center">
                          <FormLabel className="w-32 lg:w-44">
                            Density
                          </FormLabel>
                          <div className="w-full flex gap-2">
                            <FormField
                              control={form.control}
                              name="media_density"
                              render={({ field }) => (
                                <FormControl className="w-full">
                                  <Input
                                    placeholder="Density"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                              )}
                            />
                            <FormControl className="md:max-w-[500px]">
                              <Combobox
                                className="min-w-[86px]"
                                items={handleLOVDataFilter("unit_density")}
                                label={unitField.value || "Select"}
                                onChange={(value) => unitField.onChange(value)}
                              />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="npsha"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="w-32 lg:w-44">
                          NPSHa (m) — Optional
                        </FormLabel>
                        <FormControl className="w-full">
                          <Input placeholder="Available NPSH (m)" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="operating_temperature"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel className="w-32 lg:w-44">
                          Operating Temp (°C) — Optional
                        </FormLabel>
                        <FormControl className="w-full">
                          <Input
                            placeholder="Fluid Temperature (°C)"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={handleCalculateClick}>
                  Calculate
                </Button>
              </FormBox>

              {hasCalcError && (
                <div className="p-4 rounded-md border border-destructive text-destructive text-sm">
                  {pumpDetailCalData.error}
                </div>
              )}

              {hasCalcResult && (
                <FormBox field="Result">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Efficiency</p>
                      <p className="font-medium">
                        {pumpDetailCalData.operation_point?.eff?.toFixed(2)}{" "}
                        {pumpDetailCalData.units?.unit_eff}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shut-off Head</p>
                      <p className="font-medium">
                        {pumpDetailCalData.shut_off_head?.toFixed(2)}{" "}
                        {pumpDetailCalData.units?.unit_head}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">NPSHr</p>
                      <p className="font-medium">
                        {pumpDetailCalData.npshr?.toFixed(2)}{" "}
                        {pumpDetailCalData.units?.unit_npshr}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Power Required</p>
                      <p className="font-medium">
                        {pumpDetailCalData.power_required_cal_kW?.toFixed(2)}{" "}
                        {pumpDetailCalData.units?.unit_power}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">BEP Point</p>
                      <p className="font-medium">
                        {pumpDetailCalData.bep_point?.point_flow?.toFixed(2)}{" "}
                        {pumpDetailCalData.units?.unit_flow} /{" "}
                        {pumpDetailCalData.bep_point?.point_head?.toFixed(2)}{" "}
                        {pumpDetailCalData.units?.unit_head}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min Flow Point</p>
                      <p className="font-medium">
                        {pumpDetailCalData.min_flow_point?.point_flow?.toFixed(
                          2,
                        )}{" "}
                        {pumpDetailCalData.units?.unit_flow} /{" "}
                        {pumpDetailCalData.min_flow_point?.point_head?.toFixed(
                          2,
                        )}{" "}
                        {pumpDetailCalData.units?.unit_head}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max Flow Point</p>
                      <p className="font-medium">
                        {pumpDetailCalData.max_flow_point?.point_flow?.toFixed(
                          2,
                        )}{" "}
                        {pumpDetailCalData.units?.unit_flow} /{" "}
                        {pumpDetailCalData.max_flow_point?.point_head?.toFixed(
                          2,
                        )}{" "}
                        {pumpDetailCalData.units?.unit_head}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Operation Point</p>
                      <p className="font-medium">
                        {pumpDetailCalData.operation_point?.point_flow?.toFixed(
                          2,
                        )}{" "}
                        {pumpDetailCalData.units?.unit_flow} /{" "}
                        {pumpDetailCalData.operation_point?.point_head?.toFixed(
                          2,
                        )}{" "}
                        {pumpDetailCalData.units?.unit_head}
                      </p>
                    </div>
                  </div>
                  {pumpDetailCalData.analysis && (
                    <div
                      className={`mb-4 p-4 rounded-md border text-sm space-y-2 ${
                        pumpDetailCalData.analysis.working_range === "within"
                          ? "border-green-300 bg-green-50"
                          : "border-amber-300 bg-amber-50"
                      }`}
                    >
                      <p className="font-semibold">
                        {pumpDetailCalData.analysis.working_range_label}
                      </p>
                      <p>
                        Pump Performance:{" "}
                        {pumpDetailCalData.analysis.pump_performance}
                      </p>
                      {pumpDetailCalData.analysis.head_check && (
                        <p>{pumpDetailCalData.analysis.head_check}</p>
                      )}
                      {pumpDetailCalData.analysis.suggestions?.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1">
                          {pumpDetailCalData.analysis.suggestions.map(
                            (s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ),
                          )}
                        </ul>
                      )}
                      {pumpDetailCalData.analysis.npsh_check && (
                        <p>{pumpDetailCalData.analysis.npsh_check}</p>
                      )}
                      {pumpDetailCalData.analysis.fluid_temperature_note && (
                        <p>
                          {pumpDetailCalData.analysis.fluid_temperature_note}
                        </p>
                      )}
                    </div>
                  )}

                  <HeadFlowGraph
                    format={pumpDetailCalData?.curve_format}
                    chartData={[
                      ...pumpDetailCalData.desire_imp_curve_data,
                      ...pumpDetailCalData.efficiency_curve_data,
                      pumpDetailCalData.min_flow_point,
                      pumpDetailCalData.max_flow_point,
                      pumpDetailCalData.operation_point,
                      pumpDetailCalData.bep_point,
                    ]}
                    scatter={false}
                    isLoading={isPending}
                    isError={isError}
                  />
                </FormBox>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/analytic/factory_curve_analyze")({
  component: FactoryCurveAnalyze,
});
