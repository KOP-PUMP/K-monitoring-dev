import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PumpDetailLOVSchema } from "@/validators/pump";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useGetPumpDetailLOV,
  useUpdatePumpDetailLOV,
  useCreatePumpDetailLOV,
} from "@/hook/pump/pump";
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
import { useGetPECAllFactoryCurve } from "@/hook/factory_curve/factory_curve";
import { PECFactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";

function MediaLOVEdit() {
  // Unit form setup
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const pumpDetailLOVForm = useForm<z.infer<typeof PumpDetailLOVSchema>>({
    resolver: zodResolver(PumpDetailLOVSchema),
  });
  const [allPECPumpModel, setAllPECPumpModel] = useState<
    PECFactoryCurveDataResponse[]
  >([]);
  const [PECPumpModelSearch, setPECPumpModelSearch] = useState<string>("");
  const [PECPumpModelSelected, setPECPumpModelSelected] = useState<string>("");

  const { data: factoryCurveNumber } = useGetPECAllFactoryCurve();

  useEffect(() => {
    if (factoryCurveNumber) {
      const placeHolder: PECFactoryCurveDataResponse[] = [];
      const uniqueModels: string[] = [];
      factoryCurveNumber.forEach((item: PECFactoryCurveDataResponse) => {
        const data_part_without_last = item.model.split(" ").slice(0, -1);
        const model = data_part_without_last.join(" ").trim();

        if (!uniqueModels.includes(model) && model.split(" ").length > 1) {
          placeHolder.push({
            model: model,
            brand: item.brand,
            equipment: item.equipment,
            curve_format: item.curve_format,
            fac_number: item.fac_number,
          });
          uniqueModels.push(model);
        }
      });
      setAllPECPumpModel(placeHolder);
      /* setAllPECPumpModel(factoryCurveNumber); */
    }
  }, [factoryCurveNumber]);

    useEffect(() => {
    if (PECPumpModelSelected) {
      const parts = PECPumpModelSelected.split(" ");
      pumpDetailLOVForm.setValue("pump_code_name", PECPumpModelSelected);
      pumpDetailLOVForm.setValue("pump_brand", parts[0] || "");
      pumpDetailLOVForm.setValue(
        "pump_model",
        `${parts[0] || ""} ${parts[1] || ""}`.trim(),
      );
      pumpDetailLOVForm.setValue("pump_model_size", parts[1] || "");
    }
  }, [PECPumpModelSelected, pumpDetailLOVForm]);

  const { id } = useSearch({ from: "/_auth/pump/pump_detail_lov_edit" });
  const { data: pumpDetailLOV } = useGetPumpDetailLOV(id);
  useEffect(() => {
    if (id && pumpDetailLOV) {
      pumpDetailLOVForm.setValue(
        "pump_code_name",
        pumpDetailLOV[0]?.pump_code_name,
      );
      pumpDetailLOVForm.setValue("pump_brand", pumpDetailLOV[0]?.pump_brand);
      pumpDetailLOVForm.setValue("pump_model", pumpDetailLOV[0]?.pump_model);
      pumpDetailLOVForm.setValue(
        "pump_model_size",
        pumpDetailLOV[0]?.pump_model_size,
      );
      pumpDetailLOVForm.setValue("pump_design", pumpDetailLOV[0]?.pump_design);
      pumpDetailLOVForm.setValue(
        "pump_standard",
        pumpDetailLOV[0]?.pump_standard,
      );
      pumpDetailLOVForm.setValue(
        "pump_standard_no",
        pumpDetailLOV[0]?.pump_standard_no,
      );
      pumpDetailLOVForm.setValue(
        "pump_impeller_type",
        pumpDetailLOV[0]?.pump_impeller_type,
      );
      pumpDetailLOVForm.setValue(
        "pump_flange_con_std",
        pumpDetailLOV[0]?.pump_flange_con_std,
      );
      pumpDetailLOVForm.setValue(
        "pump_type_name",
        pumpDetailLOV[0]?.pump_type_name,
      );
      pumpDetailLOVForm.setValue("pump_stage", pumpDetailLOV[0]?.pump_stage);
      pumpDetailLOVForm.setValue(
        "pump_seal_chamber",
        pumpDetailLOV[0]?.pump_seal_chamber,
      );
      pumpDetailLOVForm.setValue(
        "pump_oil_seal",
        pumpDetailLOV[0]?.pump_oil_seal,
      );
      pumpDetailLOVForm.setValue(
        "pump_max_temp",
        pumpDetailLOV[0]?.pump_max_temp,
      );
      pumpDetailLOVForm.setValue(
        "pump_suction_size_id",
        pumpDetailLOV[0]?.pump_suction_size_id,
      );
      pumpDetailLOVForm.setValue(
        "pump_suction_size",
        pumpDetailLOV[0]?.pump_suction_size,
      );
      pumpDetailLOVForm.setValue(
        "pump_suction_rating",
        pumpDetailLOV[0]?.pump_suction_rating,
      );
      pumpDetailLOVForm.setValue(
        "pump_discharge_size_id",
        pumpDetailLOV[0]?.pump_discharge_size_id,
      );
      pumpDetailLOVForm.setValue(
        "pump_discharge_size",
        pumpDetailLOV[0]?.pump_discharge_size,
      );
      pumpDetailLOVForm.setValue(
        "pump_discharge_rating",
        pumpDetailLOV[0]?.pump_discharge_rating,
      );
    }
  }, [id, pumpDetailLOV]);

  const createMutation = useCreatePumpDetailLOV();
  const updateMutation = useUpdatePumpDetailLOV();

  const handlePumpDetailSubmit = (
    values: z.infer<typeof PumpDetailLOVSchema>,
  ) => {
    console.log(values);
    if (values) {
      const addData = {
        pump_code_name: values.pump_code_name || "",
        pump_brand: values.pump_brand || "",
        pump_model: values.pump_model || "",
        pump_model_size: values.pump_model_size || "",
        pump_design: values.pump_design || "",
        pump_standard: values.pump_standard || "",
        pump_standard_no: values.pump_standard_no || "",
        pump_impeller_type: values.pump_impeller_type || "",
        pump_impeller_max_size: values.pump_impeller_max_size || "",
        pump_flange_con_std: values.pump_flange_con_std || "",
        pump_type_name: values.pump_type_name || "",
        pump_stage: values.pump_stage || "",
        pump_seal_chamber: values.pump_seal_chamber || "",
        pump_oil_seal: values.pump_oil_seal || "",
        pump_max_temp: values.pump_max_temp || "",
        pump_suction_size_id: values.pump_suction_size_id || "",
        pump_suction_size: values.pump_suction_size || "",
        pump_suction_rating: values.pump_suction_rating || "",
        pump_discharge_size_id: values.pump_discharge_size_id || "",
        pump_discharge_size: values.pump_discharge_size || "",
        pump_discharge_rating: values.pump_discharge_rating || "",
        updated_at: new Date().toISOString(),
        updated_by: userData?.user.user_email,
      };

      if (!id) {
        createMutation.mutate({
          ...addData,
          created_at: new Date().toISOString(),
          created_by: userData?.user.user_email,
        });
      } else {
        updateMutation.mutate({ id, data: addData });
      }
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {id ? "Updating Pump Detail" : "Adding Pump Detail"}
        </h2>
        <Link to="/pump/pump_detail_lov_list">Back</Link>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...pumpDetailLOVForm}>
            <form
              onSubmit={pumpDetailLOVForm.handleSubmit(
                handlePumpDetailSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    pumpDetailLOVForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                },
              )}
            >
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Pump Detail Information">
                  <div className="space-y-2">
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_code_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12">Code name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. KOP KDIN125x100-400"
                                {...field}
                                className="h-7"
                                value={PECPumpModelSelected || ""}
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
                                  <SheetTitle>Select a User</SheetTitle>
                                  <SheetDescription>
                                    Choose a user from the list below
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="py-6 flex gap-2">
                                  <Input
                                    placeholder="Pump Model"
                                    onChange={(e) =>
                                      setPECPumpModelSearch(e.target.value)
                                    }
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                      const searchValue =
                                        PECPumpModelSearch.toLowerCase();
                                      const filterData =
                                        factoryCurveNumber?.filter(
                                          (data: PECFactoryCurveDataResponse) =>
                                            data.model
                                              .toLowerCase()
                                              .includes(searchValue),
                                        );
                                      setAllPECPumpModel(filterData);
                                    }}
                                  >
                                    Search
                                  </Button>
                                </div>
                                <div className="flex flex-col max-h-[80%] gap-2 overflow-y-scroll">
                                  {allPECPumpModel?.map(
                                    (data: PECFactoryCurveDataResponse) => (
                                      <div
                                        className={`p-3 border rounded-md cursor-pointer ${PECPumpModelSelected === data.model ? "bg-primary text-white" : "hover:bg-muted"} flex flex-col w-full`}
                                        onClick={() =>
                                          setPECPumpModelSelected(data.model)
                                        }
                                      >
                                        <p className="text-sm">
                                          Model : {data?.model}
                                        </p>
                                        <p className="text-sm">
                                          Brand : {data?.brand}
                                        </p>
                                        <p className="text-sm">
                                          Curve Format : {data?.curve_format}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                                <SheetFooter>
                                  <SheetClose asChild>
                                    <Button type="button">Done</Button>
                                  </SheetClose>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_brand"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">Brand</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. KOP"
                                {...field}
                                className="h-7"
                                value={PECPumpModelSelected.split(" ")[0] || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_model"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">Model</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. KDIN 125x100-400"
                                {...field}
                                className="h-7"
                                value={
                                  PECPumpModelSelected.split(" ")[0] +
                                    " " +
                                    PECPumpModelSelected.split(" ")[1] || ""
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_model_size"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Model Size
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 125x100-400"
                                {...field}
                                className="h-7"
                                value={PECPumpModelSelected.split(" ")[1] || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_design"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Design
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. Horizontal End Suction"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_standard"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Standard
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump standard"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_standard_no"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Standard Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump standard Number"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_impeller_type"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Impeller Type
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Impeller Type"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_flange_con_std"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Flange Connecting Standard
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Flange Connecting Standard"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_type_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">Pump Type</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. KDIN 32-13"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_stage"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump stage
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump Type"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                                type="number"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_seal_chamber"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Seal Chamber
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Seal Chamber"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_oil_seal"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">Oil Seal</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Oil Seal"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_max_temp"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Max Temperature (°C)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump Max Temperature (°C)"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                                type="number"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_suction_size_id"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Suction ID Size (mm.)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Suction ID Size (mm.)"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                                type="number"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_suction_size"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Suction OD Size (mm.)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Suction OD Size (mm.)"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                                type="number"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_suction_rating"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Suction OD Size (mm.)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Suction rating"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_discharge_size_id"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Discharge ID Size (mm.)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Discharge ID Size (mm.)"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                                type="number"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_discharge_size"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Discharge OD Size (mm.)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Discharge OD Size (mm.)"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                                type="number"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_discharge_rating"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Discharge OD Size (mm.)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Discharge rating"
                                {...field}
                                className="h-7"
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button size="sm" className="sm:auto gap-1 " type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className=" sm:whitespace-nowrap">
                      {id ? "Update Pump Detail" : "Add Pump Detail"}
                    </span>
                  </Button>
                </FormBox>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/pump/pump_detail_lov_edit")({
  component: MediaLOVEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
