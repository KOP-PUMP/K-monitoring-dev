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

import { AddingUnitLOVSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { FormBox } from "./common/FormBox";

import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useCreateLOV } from "@/hook/pump/pump";
import { Link } from "@tanstack/react-router";

export function UnitEdit() {
  // Unit form setup
  const unitForm = useForm<z.infer<typeof AddingUnitLOVSchema>>({
    resolver: zodResolver(AddingUnitLOVSchema),
  });

  const { showDescriptions } = useSettings();
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const addData = {
    type_name: null,
    product_name: null,
    data_value: null,
    data_value_2: null,
    data_value_3: null,
    data_value_4: null,
    created_at: new Date().toISOString(),
    created_by: userData?.email,
    updated_at: new Date().toISOString(),
    updated_by: userData?.email,
  };
  // Submission handlers

  const mutation = useCreateLOV();

  const handleUnitSubmit = (values: z.infer<typeof AddingUnitLOVSchema>) => {
    console.log("Unit Data Submitted:", values);
    mutation.mutate({
      ...addData,
      type_name: "unit",
      product_name: values.unit_name,
      data_value: values.unit_value,
    });
  };

  return (
    <div className="container mx-auto p-4 items-center">
      <Link to="/pump/unit_list">Back</Link>
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
                  </div>
                  <Button size="sm" className="sm:w-28 gap-1 " type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className=" sm:whitespace-nowrap">Update</span>
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
