import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@tanstack/react-router";
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
import { AddingUnitLOVSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGetLOVById, useUpdateLOV, useCreateLOV } from "@/hook/pump/pump";

function UnitEdit() {
  // Unit form setup
  const unitForm = useForm<z.infer<typeof AddingUnitLOVSchema>>({
    resolver: zodResolver(AddingUnitLOVSchema),
  });

  const { id } = useSearch({ from: "/_auth/pump/unit_edit" });
  const { data } = useGetLOVById(id);

  useEffect(() => {
    if (id && data) {
      unitForm.setValue("unit_name", data?.product_name ?? "");
      unitForm.setValue("unit_value", data?.data_value ?? "");
      unitForm.setValue("additional_1", data?.data_value2 ?? "");
      unitForm.setValue("additional_2", data?.data_value3 ?? "");
      unitForm.setValue("additional_3", data?.data_value4 ?? "");
    }
  }, [id, data]);

  const { showDescriptions } = useSettings();
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const addData = {
    type_name: "unit",
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

  //Get data for update when URL has id for update data

  const createMutation = useCreateLOV();
  const updateMutation = useUpdateLOV();

  const handleUnitSubmit = (values: z.infer<typeof AddingUnitLOVSchema>) => {
    console.log("Unit Data Submitted:", values);
    if (!id) {
      createMutation.mutate({
        ...addData,
        product_name: values.unit_name,
        data_value: values.unit_value,
        data_value2: values.additional_1,
        data_value3: values.additional_2,
        data_value4: values.additional_3,
      });
    } else {
      updateMutation.mutate({
        id,
        data: {
          ...addData,
          product_name: values.unit_name,
          data_value: values.unit_value,
          data_value2: values.additional_1,
          data_value3: values.additional_2,
          data_value4: values.additional_3,
        },
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {id ? "Updating Unit" : "Adding Unit"}
        </h2>
        <Link to="/pump/unit_list">Back</Link>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...unitForm}>
            <form onSubmit={unitForm.handleSubmit(handleUnitSubmit)}>
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Unit Information">
                  <div className="space-y-2">
                    <FormField
                      control={unitForm.control}
                      name="unit_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12">Unit name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. viscosity_unit or flow_unit"
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
                      control={unitForm.control}
                      name="unit_value"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 text-primary">
                              Unit value
                              <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. m3/h or Pa"
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
                      control={unitForm.control}
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
                      control={unitForm.control}
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
                      control={unitForm.control}
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
                    <span className=" sm:whitespace-nowrap">
                      {id ? "Update unit" : "Add unit"}
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


export const Route = createFileRoute("/_auth/pump/unit_edit")({
  component: UnitEdit,
  validateSearch: (search : { id : string}) => {
    return { id: search.id || null};
  },
});
