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
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import { Input } from "@/components/ui/input";
import { AddingMediaLOVSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useGetMediaLOVData,
  useUpdateMediaLOV,
  useCreateMediaLOV,
  useGetAllUnitLOVData,
} from "@/hook/pump/pump";
import { create } from "domain";

function MediaLOVEdit() {
  // Unit form setup
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const mediaLOVForm = useForm<z.infer<typeof AddingMediaLOVSchema>>({
    resolver: zodResolver(AddingMediaLOVSchema),
  });
  const { data: pumpUnitLOVResponse } = useGetAllUnitLOVData();
  const [pumpUnitLOVData, setPumpUnitLOVData] = useState<ComboboxItemProps[]>();

  useEffect(() => {
    if (pumpUnitLOVResponse) {
      const newPumpUnitLOVData = pumpUnitLOVResponse.map((data) => {
        return {
          type_name: data.type_name,
          product_name: data.product_name,
          value: data.data_value,
          label: data.data_value,
        };
      });
      setPumpUnitLOVData(newPumpUnitLOVData);
    }
  }, []);

  const { id } = useSearch({ from: "/_auth/pump/media_lov_edit" });
  const { data } = useGetMediaLOVData(id);

  useEffect(() => {
    if (id && data) {
      mediaLOVForm.setValue("media_name", data?.media_name ?? "");
      mediaLOVForm.setValue("media_density", data?.media_density ?? "");
      mediaLOVForm.setValue(
        "media_density_unit",
        data?.media_density_unit ?? ""
      );
      mediaLOVForm.setValue("media_viscosity", data?.media_viscosity ?? "");
      mediaLOVForm.setValue(
        "media_viscosity_unit",
        data?.media_viscosity_unit ?? ""
      );
      mediaLOVForm.setValue(
        "media_concentration_percentage",
        data?.media_concentration_percentage ?? ""
      );
      mediaLOVForm.setValue(
        "operating_temperature",
        data?.operating_temperature ?? ""
      );
      mediaLOVForm.setValue("vapor_pressure", data?.vapor_pressure ?? "");
      mediaLOVForm.setValue(
        "vapor_pressure_unit",
        data?.vapor_pressure_unit ?? ""
      );
    }
  }, [id, data]);

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

  const getFormData = (key: string) =>
    JSON.parse(localStorage.getItem(key) || "{}");

  const { showDescriptions } = useSettings();

  //Get data for update when URL has id for update data
  const createMutation = useCreateMediaLOV();
  const updateMutation = useUpdateMediaLOV();

  const handleUnitSubmit = (values: z.infer<typeof AddingMediaLOVSchema>) => {
    const addData = {
      media_name: values.media_name,
      media_density: values.media_density,
      media_density_unit: values.media_density_unit,
      media_viscosity: values.media_viscosity,
      media_viscosity_unit: values.media_viscosity_unit,
      media_concentration_percentage: values.media_concentration_percentage,
      operating_temperature: values.operating_temperature,
      vapor_pressure: values.vapor_pressure,
      vapor_pressure_unit: values.vapor_pressure_unit,
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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {id ? "Updating Media" : "Adding Media"}
        </h2>
        <Link to="/pump/media_lov_list">Back</Link>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...mediaLOVForm}>
            <form
              onSubmit={mediaLOVForm.handleSubmit(
                handleUnitSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    mediaLOVForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                }
              )}
            >
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Media Information">
                  <div className="space-y-2">
                    <FormField
                      control={mediaLOVForm.control}
                      name="media_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12">Media name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. Water (30C) or Oil (60C)"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                          {showDescriptions && (
                            <FormDescription>
                              This is the Shaft.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mediaLOVForm.control}
                      name="media_density_unit"
                      render={({ field: Field }) => (
                        <FormItem>
                          <div className="w-full flex items-center">
                            <FormLabel className="w-32 lg:w-44">
                              Media Density
                            </FormLabel>
                            <div className="w-full flex gap-2">
                              <FormField
                                control={mediaLOVForm.control}
                                name="media_density"
                                render={({ field: Field }) => (
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Media Density"
                                      {...Field}
                                    />
                                  </FormControl>
                                )}
                              />
                              <FormControl className="md:max-w-[500px]">
                                <Combobox
                                  className="min-w-[86px]"
                                  items={
                                    handleLOVDataFilter(
                                      "unit_density",
                                      "pump_unit"
                                    ) || []
                                  } // Dropdown options
                                  label={
                                    mediaLOVForm.getValues("media_density_unit")
                                      ? mediaLOVForm.getValues(
                                          "media_density_unit"
                                        )
                                      : "Select"
                                  }
                                  onChange={(value) => {
                                    Field.onChange(value); // Update form state
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
                      control={mediaLOVForm.control}
                      name="media_viscosity_unit"
                      render={({ field: Field }) => (
                        <FormItem>
                          <div className="w-full flex items-center">
                            <FormLabel className="w-32 lg:w-44">
                              Media Viscosity
                            </FormLabel>
                            <div className="w-full flex gap-2">
                              <FormField
                                control={mediaLOVForm.control}
                                name="media_viscosity"
                                render={({ field: Field }) => (
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Media Viscosity"
                                      {...Field}
                                    />
                                  </FormControl>
                                )}
                              />
                              <FormControl className="md:max-w-[500px]">
                                <Combobox
                                  className="min-w-[86px]"
                                  items={
                                    handleLOVDataFilter(
                                      "unit_viscosity",
                                      "pump_unit"
                                    ) || []
                                  } // Dropdown options
                                  label={
                                    mediaLOVForm.getValues(
                                      "media_viscosity_unit"
                                    )
                                      ? mediaLOVForm.getValues(
                                          "media_viscosity_unit"
                                        )
                                      : "Select"
                                  }
                                  onChange={(value) => {
                                    Field.onChange(value); // Update form state
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
                      control={mediaLOVForm.control}
                      name="media_concentration_percentage"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Concentration Percentage
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 0 - 100"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                          {showDescriptions && (
                            <FormDescription>
                              This is the Shaft.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mediaLOVForm.control}
                      name="operating_temperature"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Operating Temperature (°C)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 30 or 70"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                          {showDescriptions && (
                            <FormDescription>
                              This is the Shaft.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mediaLOVForm.control}
                      name="vapor_pressure_unit"
                      render={({ field: Field }) => (
                        <FormItem>
                          <div className="w-full flex items-center">
                            <FormLabel className="w-32 lg:w-44">
                              Vapor Pressure
                            </FormLabel>
                            <div className="w-full flex gap-2">
                              <FormField
                                control={mediaLOVForm.control}
                                name="vapor_pressure"
                                render={({ field: Field }) => (
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Vapor Pressure"
                                      {...Field}
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
                                      "pump_unit"
                                    ) || []
                                  } // Dropdown options
                                  label={
                                    mediaLOVForm.getValues(
                                      "vapor_pressure_unit"
                                    )
                                      ? mediaLOVForm.getValues(
                                          "vapor_pressure_unit"
                                        )
                                      : "Select"
                                  }
                                  onChange={(value) => {
                                    Field.onChange(value); // Update form state
                                  }}
                                />
                              </FormControl>
                            </div>
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button size="sm" className="sm:w-28 gap-1 " type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className=" sm:whitespace-nowrap">
                      {id ? "Update Media" : "Add Media"}
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

export const Route = createFileRoute("/_auth/pump/media_lov_edit")({
  component: MediaLOVEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
