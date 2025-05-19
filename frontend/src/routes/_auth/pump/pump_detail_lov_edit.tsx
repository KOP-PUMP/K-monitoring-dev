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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PumpDetailLOVSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  useGetPumpDetailLOV,
  useUpdatePumpDetailLOV,
  useCreatePumpDetailLOV,
} from "@/hook/pump/pump";
import { create } from "domain";

function MediaLOVEdit() {
  // Unit form setup
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const pumpDetailLOVForm = useForm<z.infer<typeof PumpDetailLOVSchema>>({
    resolver: zodResolver(PumpDetailLOVSchema),
  });

  const { id } = useSearch({ from: "/_auth/pump/pump_detail_lov_edit" });
  const { data: pumpDetailLOV } = useGetPumpDetailLOV(id);
  useEffect(() => {
    if (id && pumpDetailLOV) {
        pumpDetailLOVForm.setValue("pump_code_name", pumpDetailLOV?.pump_code_name);
        pumpDetailLOVForm.setValue("pump_brand", pumpDetailLOV?.pump_brand);
        pumpDetailLOVForm.setValue("pump_model", pumpDetailLOV?.pump_model);
        pumpDetailLOVForm.setValue("model_size", pumpDetailLOV?.model_size);
        pumpDetailLOVForm.setValue(
          "pump_design",
          pumpDetailLOV?.pump_design
        );
        pumpDetailLOVForm.setValue(
          "pump_standard",
          pumpDetailLOV?.pump_standard
        );
        pumpDetailLOVForm.setValue(
          "pump_standard_no",
          pumpDetailLOV?.pump_standard_no
        );
        pumpDetailLOVForm.setValue(
          "pump_impeller_type",
          pumpDetailLOV?.pump_impeller_type
        );
        pumpDetailLOVForm.setValue(
          "pump_flange_con_std",
          pumpDetailLOV?.pump_flange_con_std
        );
        pumpDetailLOVForm.setValue("pump_type", pumpDetailLOV?.pump_type);
        pumpDetailLOVForm.setValue("pump_stage", pumpDetailLOV?.pump_stage);
        pumpDetailLOVForm.setValue(
          "pump_seal_chamber",
          pumpDetailLOV?.pump_seal_chamber
        );
        pumpDetailLOVForm.setValue(
          "pump_oil_seal",
          pumpDetailLOV?.pump_oil_seal
        );
        pumpDetailLOVForm.setValue(
          "pump_max_temp",
          pumpDetailLOV?.pump_max_temp
        );
        pumpDetailLOVForm.setValue(
          "pump_suction_size_id",
          pumpDetailLOV?.pump_suction_size_id
        );
        pumpDetailLOVForm.setValue(
          "pump_suction_size",
          pumpDetailLOV?.pump_suction_size
        );
        pumpDetailLOVForm.setValue(
          "pump_suction_rating",
          pumpDetailLOV?.pump_suction_rating
        );
        pumpDetailLOVForm.setValue(
          "pump_discharge_size_id",
          pumpDetailLOV?.pump_discharge_size_id
        );
        pumpDetailLOVForm.setValue(
          "pump_discharge_size",
          pumpDetailLOV?.pump_discharge_size
        );
        pumpDetailLOVForm.setValue(
          "pump_discharge_rating",
          pumpDetailLOV?.pump_discharge_rating
        );
    }
  }, [id, pumpDetailLOV]);

  const createMutation = useCreatePumpDetailLOV();
  const updateMutation = useUpdatePumpDetailLOV();

  const handlePumpDetailSubmit = (
    values: z.infer<typeof PumpDetailLOVSchema>
  ) => {
    const addData = {
      pump_code_name: values.pump_code_name,
      pump_brand: values.pump_brand,
      pump_model: values.pump_model,
      model_size: values.model_size,
      pump_design: values.pump_design,
      pump_standard: values.pump_standard,
      pump_standard_no: values.pump_standard_no,
      pump_impeller_type: values.pump_impeller_type,
      pump_flange_con_std: values.pump_flange_con_std,
      pump_type: values.pump_type,
      pump_stage: values.pump_stage,
      pump_seal_chamber: values.pump_seal_chamber,
      pump_oil_seal: values.pump_oil_seal,
      pump_max_temp: values.pump_max_temp,
      pump_suction_size_id: values.pump_suction_size_id,
      pump_suction_size: values.pump_suction_size,
      pump_suction_rating: values.pump_suction_rating,
      pump_discharge_size_id: values.pump_discharge_size_id,
      pump_discharge_size: values.pump_discharge_size,
      pump_discharge_rating: values.pump_discharge_rating,
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
                }
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
                              />
                            </FormControl>
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
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="model_size"
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
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={pumpDetailLOVForm.control}
                      name="pump_type"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Type
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. KDIN 32-13"
                                {...field}
                                className="h-7"
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
