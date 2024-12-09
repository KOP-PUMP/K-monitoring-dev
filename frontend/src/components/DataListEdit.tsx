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

import { AddingUnitLOVSchema, AddingPumpLOVSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { FormBox } from "./common/FormBox";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent } from "@/components/ui/card";
import { CloudCog, PlusCircle } from "lucide-react";

/* import { AddPumpListData, AddUnitListData } from "@/api/pump/pump";
import { create } from "domain"; */

export function DataListEdit() {
  // Pump form setup
  const pumpForm = useForm<z.infer<typeof AddingPumpLOVSchema>>({
    resolver: zodResolver(AddingPumpLOVSchema),
  });

  // Unit form setup
  const unitForm = useForm<z.infer<typeof AddingUnitLOVSchema>>({
    resolver: zodResolver(AddingUnitLOVSchema),
  });

  const { showDescriptions } = useSettings();
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const addData = {
    data_type: "",
    data_name: "",
    data_value: "",
    additional_1: "",
    additional_2: "",
    additional_3: "",
    created_at: new Date().toISOString(),
    created_by: userData?.email,
    updated_at: new Date().toISOString(),
    updated_by: userData?.email,
  };
  // Submission handlers
  const handlePumpSubmit = (values: z.infer<typeof AddingPumpLOVSchema>) => {
    console.log("Pump Data Submitted:", values);
    console.log(userData);
  };

  const handleUnitSubmit = (values: z.infer<typeof AddingUnitLOVSchema>) => {
    console.log("Unit Data Submitted:", values);
    console.log(userData);
  };

  return (
    <div className="container mx-auto p-4 items-center">
      <Tabs defaultValue="Pump Data">
        <div className="flex items-center space-x-4">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger value="Pump Data">Pump Data Information</TabsTrigger>
            <TabsTrigger value="Unit Data">Unit Data Information</TabsTrigger>
          </TabsList>
        </div>
        <Card className="w-full mt-5">
          <CardContent>
            {/* Pump Data Tab */}
            <TabsContent value="Pump Data">
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
                                <FormLabel className="w-2/12">
                                  Data type
                                </FormLabel>
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
                                  Data name
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
                      </div>
                      <Button
                        size="sm"
                        className="sm:w-28 gap-1 "
                        type="submit"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sm:whitespace-nowrap">Update</span>
                      </Button>
                    </FormBox>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Unit Data Tab */}
            <TabsContent value="Unit Data">
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
                                <FormLabel className="w-2/12">
                                  Unit name
                                </FormLabel>
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
                      <Button
                        size="sm"
                        className="sm:w-28 gap-1 "
                        type="submit"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className=" sm:whitespace-nowrap">Update</span>
                      </Button>
                    </FormBox>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
