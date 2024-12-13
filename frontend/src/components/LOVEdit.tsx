import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import { useEffect } from "react";
import {AddingPumpLOVSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { FormBox } from "./common/FormBox";
import { Link } from "@tanstack/react-router";
import { useCreateLOV, useUpdateLOV, useGetLOVById } from "@/hook/pump/pump";
import { useSearch } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

/* import { AddPumpListData, AddUnitListData } from "@/api/pump/pump";
import { create } from "domain"; */

export function LOVEdit() {
  // Pump form setup
  const pumpForm = useForm<z.infer<typeof AddingPumpLOVSchema>>({
    resolver: zodResolver(AddingPumpLOVSchema),
  });

  const { id } = useSearch({ from: "/_auth/pump/lov_edit" });
  const { data } = useGetLOVById(id);
  
  useEffect(() => {
    if (id && data) {
      pumpForm.setValue("data_type", data?.type_name ?? "");
      pumpForm.setValue("data_name", data?.product_name ?? "");
      pumpForm.setValue("data_value", data?.data_value ?? "");
      pumpForm.setValue("additional_1", data?.data_value2 ?? "");
      pumpForm.setValue("additional_2", data?.data_value3 ?? "");
      pumpForm.setValue("additional_3", data?.data_value4 ?? "");
    }
  }, [id, data]);

  const { showDescriptions } = useSettings();
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const addData = {
    type_name: "",
    product_name: "",
    data_value: "",
    data_value2: "",
    data_value3: "",
    data_value4: "",
    created_at: new Date().toISOString(),
    created_by: userData?.email,
    updated_at: new Date().toISOString(),
    updated_by: userData?.email,
  };
  // Submission handlers

  const createMutation = useCreateLOV();
  const updateMutation = useUpdateLOV();
  
  const handlePumpSubmit = (values: z.infer<typeof AddingPumpLOVSchema>) => {
    if (!id) {
      createMutation.mutate({
        ...addData,
        type_name: values.data_type,
        product_name: values.data_name,
        data_value: values.data_value,
        data_value2: values.additional_1,
        data_value3: values.additional_2,
        data_value4: values.additional_3,
      });
    } else {
      updateMutation.mutate({
        id,
        data: {
          ...addData,
          type_name: values.data_type,
          product_name: values.data_name,
          data_value: values.data_value,
          data_value2: values.additional_1,
          data_value3: values.additional_2,
          data_value4: values.additional_3,
        },
      });
    }
  };

  return (
    <div className="container mx-auto p-4 items-center">
      <Link to="/pump/lov_list">Back</Link>
      <Card className="w-full mt-5">
        <CardContent>
          {/* Pump Data Tab */}
          <Form {...pumpForm}>
            <form onSubmit={pumpForm.handleSubmit(handlePumpSubmit)}>
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Pump Information">
                  <div className="space-y-2">
                    <FormField
                      control={pumpForm.control}
                      name="data_type"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12">Type</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. bearing or impeller"
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
                      control={pumpForm.control}
                      name="data_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 text-primary">
                              Name
                              <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. rotation or impeller_type_name"
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
                      control={pumpForm.control}
                      name="data_value"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 text-primary">
                              Value
                              <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. CCW or Semi-open"
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
                      control={pumpForm.control}
                      name="additional_1"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 text-primary">
                              Add. 1<span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Optional"
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
                      control={pumpForm.control}
                      name="additional_2"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 text-primary">
                              Add. 2<span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Optional"
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
                      control={pumpForm.control}
                      name="additional_3"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 text-primary">
                              Add. 3<span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Optional"
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
                  </div>
                  <Button size="sm" className="sm:w-28 gap-1 " type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sm:whitespace-nowrap">
                      {id ? "Update data" : "Add data"}
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
