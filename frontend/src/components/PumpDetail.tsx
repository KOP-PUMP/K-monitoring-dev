import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { FormBox } from "@/components/common/FormBox";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";

import { PumpGeneralDetailSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";

import { useForm } from "react-hook-form";

import { useGetPumpDetailById } from "@/api/pump/pump";
import { useDropdownData, useDropdownDesigns, useDropdownTypes } from "@/api/dropdown";

const frameworks: ComboboxItemProps[] = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

// const frameworks: ComboboxItemProps[] =

export default function PumpList() {
  const { data, error, isLoading } = useDropdownData();
  const { data: pumpData, error: pumpError, isLoading: pumpIsLoading } = useGetPumpDetailById(1);
  const { data: pumpTypes, error: pumpTypesError, isLoading: pumpTypesIsLoading } = useDropdownTypes();

  const pump_types: ComboboxItemProps[] = pumpTypes?.map((item) => ({
    value: item.pump_type,
    label: item.pump_type,
  }));

  // pumpData = PumpGeneralDetailSchema.parse(pumpData);
  // console.log(pumpData);

  type PumpGeneralDetail = z.infer<typeof PumpGeneralDetailSchema>;
  const form = useForm<PumpGeneralDetail>({
    resolver: zodResolver(PumpGeneralDetailSchema),
  });
  const { showDescriptions } = useSettings();

  function onSubmit(values: PumpGeneralDetail) {
    console.log(values);
  }

  if (pumpIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="Pump Details">
            <div className="flex items-center space-x-4">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
                <TabsTrigger value="Pump Details">Pump Details</TabsTrigger>
                <TabsTrigger value="Material and Impeller Details">Material and Impeller Details</TabsTrigger>
                <TabsTrigger value="Motor and Coupling Details">Motor and Coupling Details</TabsTrigger>
                <TabsTrigger value="Mechanical Seal Details">Mechanical Seal Details</TabsTrigger>
              </TabsList>
              <Button size="sm" className="gap-1 mt-2 sm:mt-0">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Pump</span>
              </Button>
            </div>
            <Card className="w-full mt-5">
              <CardContent>
                <TabsContent value="Pump Details" className="container flex-auto space-x-2 space-y-3 py-3">
                  <div className="grid grid-cols-1 grid-rows-2 space-y-2">
                    {/* General Detail */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Pump General Detail">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12">Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Location" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>This is the location of the pump.</FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Brand
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Brand" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the brand of the pump.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Model
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Model" {...field} className="h-7 " />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the model of the pump.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="tag_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-1/12">Tag&nbsp;No.</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tag No." {...field} className="h-7 " />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>This is the tag number of the pump.</FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="serial_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Serial&nbsp;No.
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Serial No." {...field} className="h-7 " />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>This is the serial number of the pump.</FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <FormField
                            control={form.control}
                            name="pump_standard_id"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Standard
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Combobox items={frameworks} name={"Standard"} />
                                  </FormControl>
                                  <FormControl>
                                    <Input placeholder="Standard" {...field} className="h-7 " />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the pump standard ID.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                          {/* <FormItem>
                            <div className="flex items-center ">
                              <FormLabel className="w-1/12 text-destructive">
                                Type
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Combobox items={pump_types} name={"Type"} />
                              </FormControl>
                            </div>
                            {showDescriptions && <FormDescription>This is the pump standard.</FormDescription>}
                            <FormMessage />
                          </FormItem> */}
                          {/* <FormItem>
                            <div className="flex items-center ">
                              <FormLabel className="w-1/12 text-destructive">
                                Design
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Combobox items={frameworks} name={"Design"} />
                              </FormControl>
                            </div>
                            {showDescriptions && <FormDescription>This is the pump type ID.</FormDescription>}
                            <FormMessage />
                          </FormItem> */}
                        </div>
                      </FormBox>
                    </div>
                    {/* Pump Technical Data */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Pump Technical Data">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12">Speed</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Speed" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the material of Media.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Efficiency
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Efficiency" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Viscosity.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Flow
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Flow" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Flow
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Flow" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Shutoff Head
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Shutoff Head" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Head
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Head" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    NPSHr
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="NPSHr" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    {/* Pump Applicational Data */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Pump Applicational Data">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12">Media</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Media" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the material of Casing.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Viscosity
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Viscosity" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Impeller.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Pumping Temp
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Pumping Temp" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Boiling Point
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Boiling Point" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-1/12 text-destructive">
                                    Vapor Pressure
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Vapor Pressure" type="number" {...field} className="h-7" />
                                  </FormControl>
                                </div>
                                {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="Material and Impeller Details" className="container flex-auto space-x-2 py-3">
                  <div className="text-foreground dark:text-foreground grow flex-1">
                    <FormBox field="Motor General Details">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Casing
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Casing" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Impeller
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Impeller" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Shaft
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Shaft" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormBox>
                    <FormBox field="Impeller Details">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Type
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Type" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Dia
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Dia" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormBox>
                  </div>
                </TabsContent>
                <TabsContent value="Motor and Coupling Details" className="container flex-auto space-x-2 py-3">
                  <div className="text-foreground dark:text-foreground grow flex-1">
                    <FormBox field="Motor General Details">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Brand</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brand" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Power
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Power" type="number" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Model</FormLabel>
                                <FormControl>
                                  <Input placeholder="Model" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Speed
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Speed" type="number" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Serial No.
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Serial No." {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Rated Current
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Rated Current" type="number" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Frame Size
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Frame Size" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Efficiency
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Efficiency" type="number" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Protection</FormLabel>
                                <FormControl>
                                  <Input placeholder="Protection" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Drive System
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Combobox items={frameworks} name={"frameworks"} />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Power Factor
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Power Factor" type="number" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  IE Class
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Combobox items={frameworks} name={"frameworks"} />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Voltage
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Voltage" type="number" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Connection
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Combobox items={frameworks} name={"frameworks"} />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormBox>
                    <FormBox field="Coupling Details">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Brand</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brand" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Model</FormLabel>
                                <FormControl>
                                  <Input placeholder="Model" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Type
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Combobox items={frameworks} name={"frameworks"} />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Size
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Size" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Spacer</FormLabel>
                                <FormControl>
                                  <Input placeholder="Spacer" type="number" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormBox>
                  </div>
                </TabsContent>
                <TabsContent value="Mechanical Seal Details" className="container flex-auto space-x-2 py-3">
                  <div className="text-foreground dark:text-foreground grow flex-1">
                    <FormBox field="Mechanical Seal Details">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Q'ty
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Combobox items={frameworks} name={"frameworks"} />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Seal Chamber Design
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Combobox items={frameworks} name={"frameworks"} />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormBox>
                    <FormBox field="Mechanical Seal">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Brand</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brand" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Modal</FormLabel>
                                <FormControl>
                                  <Input placeholder="Modal" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Size
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Size" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12 text-primary">
                                  Design
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Design" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">API PLAN</FormLabel>
                                <FormControl>
                                  <Input placeholder="API PLAN" {...field} className="h-7" />
                                </FormControl>
                              </div>
                              {showDescriptions && <FormDescription>This is the Shaft.</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormBox>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
