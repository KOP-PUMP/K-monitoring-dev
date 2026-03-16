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
import { useState } from "react";
import { ComboboxItemProps } from "@/components/common/ComboBox";
import { Combobox } from "@/components/common/ComboBox";
import { Input } from "@/components/ui/input";
import { MotorDetailLOVSchema } from "@/validators/pump";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  useGetMotorDetailLOV,
  useUpdateMotorLOV,
  useCreateMotorLOV,
  useGetAllUnitLOVData,
} from "@/hook/pump/pump";
import { MotorDetailLOVResponse } from "@/types/pump/pumps";

function MotorLOVEdit() {
  // Unit form setup
  const [pumpUnitLOVData, setPumpUnitLOVData] = useState<ComboboxItemProps[]>();
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const motorLOVForm = useForm<z.infer<typeof MotorDetailLOVSchema>>({
    resolver: zodResolver(MotorDetailLOVSchema),
  });
  const { data: unitData } = useGetAllUnitLOVData();

  const handleLOVDataFilter = (name: string, type: string) => {
    /* if (type === "pump_data") {
      const filterData = pumpLOVData?.filter((data) => {
        return data.product_name === name;
      });
      return filterData;
    } */
    if (type === "pump_unit") {
      const filterData = pumpUnitLOVData?.filter((data) => {
        return data.product_name == name;
      });
      return filterData;
    }
  };

  const { id } = useSearch({ from: "/_auth/pump/motor_lov_edit" });
  const { data: motorData } = useGetMotorDetailLOV(id) as {data: MotorDetailLOVResponse};

  useEffect(() => {
    if (id && motorData) {
      motorLOVForm.setValue(
        "motor_code_name",
        motorData?.motor_code_name ?? ""
      );
      motorLOVForm.setValue(
        "motor_serial_no",
        motorData?.motor_serial_no ?? ""
      );
      motorLOVForm.setValue("motor_brand", motorData?.motor_brand ?? "");
      motorLOVForm.setValue("motor_drive", motorData?.motor_drive ?? "");
      motorLOVForm.setValue("motor_standard", motorData?.motor_standard ?? "");
      motorLOVForm.setValue("motor_ie", motorData?.motor_ie ?? "");
      motorLOVForm.setValue("motor_model", motorData?.motor_model ?? "");
      motorLOVForm.setValue("motor_speed", motorData?.motor_speed ?? "");
      motorLOVForm.setValue(
        "motor_speed_unit",
        motorData?.motor_speed_unit ?? ""
      );
      motorLOVForm.setValue("motor_rated", motorData?.motor_rated ?? "");
      motorLOVForm.setValue(
        "motor_rated_unit",
        motorData?.motor_rated_unit ?? ""
      );
      motorLOVForm.setValue("motor_factor", motorData?.motor_factor ?? "");
      motorLOVForm.setValue(
        "motor_connection",
        motorData?.motor_connection ?? ""
      );
      motorLOVForm.setValue("motor_phase", motorData?.motor_phase ?? "");
      motorLOVForm.setValue(
        "motor_efficiency",
        motorData?.motor_efficiency ?? ""
      );
      motorLOVForm.setValue(
        "motor_efficiency_unit",
        motorData?.motor_efficiency_unit ?? ""
      );
      motorLOVForm.setValue(
        "motor_rated_current",
        motorData?.motor_rated_current ?? ""
      );
      motorLOVForm.setValue(
        "motor_rated_current_unit",
        motorData?.motor_rated_current_unit ?? ""
      );
      motorLOVForm.setValue("coup_type", motorData?.coup_type ?? "");
    }
  }, [id, motorData]);

  //Get data for update when URL has id for update data
  const createMutation = useCreateMotorLOV();
  const updateMutation = useUpdateMotorLOV();

  const handleUnitSubmit = (values: z.infer<typeof MotorDetailLOVSchema>) => {
    const addData = {
      motor_code_name: values.motor_code_name,
      motor_serial_no: values.motor_serial_no,
      motor_brand: values.motor_brand,
      motor_drive: values.motor_drive,
      motor_standard: values.motor_standard,
      motor_ie: values.motor_ie,
      motor_model: values.motor_model,
      motor_speed: values.motor_speed,
      motor_speed_unit: values.motor_speed_unit,
      motor_rated: values.motor_rated,
      motor_rated_unit: values.motor_rated_unit,
      motor_factor: values.motor_factor,
      motor_connection: values.motor_connection,
      motor_phase: values.motor_phase,
      motor_efficiency: values.motor_efficiency,
      motor_efficiency_unit: values.motor_efficiency_unit,
      motor_rated_current: values.motor_rated_current,
      motor_rated_current_unit: values.motor_rated_current_unit,
      coup_type: values.coup_type,
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
      updateMutation.mutate({
        id,
        data: addData,
      });
    }
  };

  useEffect(() => {
    if (unitData) {
      const newPumpUnitLOVData = unitData.map((data) => {
        return {
          type_name: data.type_name,
          product_name: data.product_name,
          value: data.data_value,
          label: data.data_value,
        };
      });

      setPumpUnitLOVData(newPumpUnitLOVData);
    }
  }, [unitData]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {id ? "Updating Motor" : "Adding Motor"}
        </h2>
        <Link to="/pump/motor_lov_list">Back</Link>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...motorLOVForm}>
            <form
              onSubmit={motorLOVForm.handleSubmit(
                handleUnitSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    motorLOVForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                }
              )}
            >
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Motor Information">
                  <div className="space-y-2">
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_code_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12">
                              Motor Code Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Motor Code Name"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_model"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Motor Model
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 1 or 10"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_serial_no"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Serial Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Serial Number"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_brand"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">Brand</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Motor Brand"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_drive"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Motor Drive
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Motor drive"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_standard"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Motor Standard
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 30 or 70"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_ie"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">Motor IE</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 1 or 10"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_speed_unit"
                      render={({ field: speedField }) => (
                        <FormItem>
                          <div className="w-full flex items-center">
                            <FormLabel className="w-32 lg:w-44">
                              Motor Speed
                            </FormLabel>
                            <div className="w-full flex gap-2">
                              <FormField
                                control={motorLOVForm.control}
                                name="motor_speed"
                                render={({ field: speedField }) => (
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Motor Speed"
                                      {...speedField}
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
                                      "pump_unit"
                                    ) || []
                                  } // Dropdown options
                                  label={
                                    motorData?.motor_speed_unit
                                      ? motorData.motor_speed_unit
                                      : "Select"
                                  }
                                  onChange={(value) => {
                                    speedField.onChange(value); // Update form state
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
                      control={motorLOVForm.control}
                      name="motor_rated_unit"
                      render={({ field: ratedField }) => (
                        <FormItem>
                          <div className="w-full flex items-center">
                            <FormLabel className="w-32 lg:w-44">
                              Motor Rated
                            </FormLabel>
                            <div className="w-full flex gap-2">
                              <FormField
                                control={motorLOVForm.control}
                                name="motor_rated"
                                render={({ field: ratedField }) => (
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Motor Rated"
                                      {...ratedField}
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
                                      "pump_unit"
                                    ) || []
                                  } // Dropdown options
                                  label={
                                    motorData?.motor_rated_unit
                                      ? motorData.motor_rated_unit
                                      : "Select"
                                  }
                                  onChange={(value) => {
                                    ratedField.onChange(value); // Update form state
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
                      control={motorLOVForm.control}
                      name="motor_factor"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Motor Factor
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Motor Factor"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_connection"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Motor Connection
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Motor Connection"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_phase"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Motor Phase
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Motor Phase"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={motorLOVForm.control}
                      name="motor_efficiency_unit"
                      render={({ field: ratedField }) => (
                        <FormItem>
                          <div className="w-full flex items-center">
                            <FormLabel className="w-32 lg:w-44">
                              Motor Efficiency
                            </FormLabel>
                            <div className="w-full flex gap-2">
                              <FormField
                                control={motorLOVForm.control}
                                name="motor_efficiency"
                                render={({ field: ratedField }) => (
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Motor Efficiency"
                                      {...ratedField}
                                    />
                                  </FormControl>
                                )}
                              />
                              <FormControl className="md:max-w-[500px]">
                                <Combobox
                                  className="min-w-[86px]"
                                  items={
                                    handleLOVDataFilter(
                                      "unit_efficiency",
                                      "pump_unit"
                                    ) || []
                                  } // Dropdown options
                                  label={
                                    motorData?.motor_efficiency_unit
                                      ? motorData.motor_efficiency_unit
                                      : "Select"
                                  }
                                  onChange={(value) => {
                                    ratedField.onChange(value); // Update form state
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
                      control={motorLOVForm.control}
                      name="motor_rated_current_unit"
                      render={({ field: ratedField }) => (
                        <FormItem>
                          <div className="w-full flex items-center">
                            <FormLabel className="w-32 lg:w-44">
                              Motor Rated Current
                            </FormLabel>
                            <div className="w-full flex gap-2">
                              <FormField
                                control={motorLOVForm.control}
                                name="motor_rated_current"
                                render={({ field: ratedField }) => (
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Motor Rated Current"
                                      {...ratedField}
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
                                      "pump_unit"
                                    ) || []
                                  } // Dropdown options
                                  label={
                                    motorData?.motor_rated_current_unit
                                      ? motorData.motor_rated_current_unit
                                      : "Select"
                                  }
                                  onChange={(value) => {
                                    ratedField.onChange(value); // Update form state
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
                      control={motorLOVForm.control}
                      name="coup_type"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Coupling Type
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Coupling Type"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button size="sm" className="sm:w-28 gap-1 " type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className=" sm:whitespace-nowrap">
                      {id ? "Update Motor" : "Add Motor"}
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

export const Route = createFileRoute("/_auth/pump/motor_lov_edit")({
  component: MotorLOVEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
