import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";

import { PumpDetailSchema } from "@/validators/pump_detail";
import { useSettings } from "@/lib/settings";
import { FormBox } from "./common/FormBox";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

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

export function EngineeringDetail() {
  type PumpGeneralDetail = z.infer<typeof PumpDetailSchema>;
  const form = useForm<PumpGeneralDetail>({
    resolver: zodResolver(PumpDetailSchema),
  });
  const { showDescriptions } = useSettings();

  function onSubmit(values: PumpGeneralDetail) {
    console.log(values);
  }

  return (
    <div className="container mx-auto p-4 items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="Process Information">
            <div className="flex items-center space-x-4">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
                <TabsTrigger value="Process Information">Process Information</TabsTrigger>
                <TabsTrigger value="Pump Operating Information">Pump Operating Information</TabsTrigger>
              </TabsList>
              <Button size="sm" className="gap-1 mt-2 sm:mt-0">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Update Engineer</span>
              </Button>
            </div>
            <Card className="w-full mt-5">
              <CardContent>
                <TabsContent value="Process Information">
                  <div className="text-foreground dark:text-foreground grow flex-1">
                    <FormBox field="Process Information">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="w-1/12">Tank Position</FormLabel>
                                <FormControl>
                                  <Input placeholder="Tank Position" {...field} className="h-7" />
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
                                  Tank Design
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Tank Design" {...field} className="h-7" />
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
                                <FormLabel className="w-1/12">Tank Pressure (Head)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Tank Pressure (Head)" type="number" {...field} className="h-7" />
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
                                  Static Suction Head (V)
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Static Suction Head (V)"
                                    type="number"
                                    {...field}
                                    className="h-7"
                                  />
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
                                  Suction Pipe Length (H)
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Suction Pipe Length (H)"
                                    type="number"
                                    {...field}
                                    className="h-7"
                                  />
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
                                  Media Vapor Pressure
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Media Vapor Pressure" {...field} className="h-7" />
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
                                  Discharge Pipe Length (H)
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Discharge Pipe Length (H)"
                                    type="number"
                                    {...field}
                                    className="h-7"
                                  />
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
                                  Discharge Pipe Length (V)
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Discharge Pipe Length (V)"
                                    type="number"
                                    {...field}
                                    className="h-7"
                                  />
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
                                <FormLabel className="w-1/12">Suction Pipe I.D.</FormLabel>
                                <FormControl>
                                  <Input placeholder="Suction Pipe I.D." {...field} className="h-7" />
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
                                  Elbow
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Elbow" {...field} className="h-7" />
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
                                  Tee
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Tee" {...field} className="h-7" />
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
                                  Reducer
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Reducer" {...field} className="h-7" />
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
                                  Valve
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Valve" {...field} className="h-7" />
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
                                  Y-Strainer
                                  <span className="text-primary">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Y-Strainer" {...field} className="h-7" />
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
                <TabsContent value="Pump Operating Information"></TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
