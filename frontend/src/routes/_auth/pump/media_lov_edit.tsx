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
import { AddingMediaLOVSchema } from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGetMediaLOVData, useUpdateMediaLOV, useCreateMediaLOV } from "@/hook/pump/pump";
import { create } from "domain";

function MediaLOVEdit() {
  // Unit form setup
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const mediaLOVForm = useForm<z.infer<typeof AddingMediaLOVSchema>>({
    resolver: zodResolver(AddingMediaLOVSchema),
  });

  const addData = {
    media_name: "",
    media_density: "",
    media_viscosity: "",
    media_concentration_percentage: "",
    operating_temperature: "",
    vapor_pressure: "",
  };

  const { id } = useSearch({ from: "/_auth/pump/media_lov_edit" });
  const { data } = useGetMediaLOVData(id);

  useEffect(() => {
    if (id && data) {
      mediaLOVForm.setValue("media_name", data?.media_name ?? "");
      mediaLOVForm.setValue("media_density", data?.media_density ?? "");
      mediaLOVForm.setValue("media_viscosity", data?.media_viscosity ?? "");
      mediaLOVForm.setValue("media_concentration_percentage", data?.media_concentration_percentage ?? "");
      mediaLOVForm.setValue("operating_temperature", data?.operating_temperature ?? "");
      mediaLOVForm.setValue("vapor_pressure", data?.vapor_pressure ?? "");
    }
  }, [id, data]);

  const { showDescriptions } = useSettings();

  //Get data for update when URL has id for update data
  const createMutation = useCreateMediaLOV();
  const updateMutation = useUpdateMediaLOV();

  const handleUnitSubmit = (values: z.infer<typeof AddingMediaLOVSchema>) => {
    if (!id) {
      createMutation.mutate(values);
    } else {
      updateMutation.mutate({id, data: {
        ...addData,
        media_name: values.media_name,
        media_density: values.media_density,
        media_viscosity: values.media_viscosity,
        media_concentration_percentage: values.media_concentration_percentage,
        operating_temperature: values.operating_temperature,
        vapor_pressure: values.vapor_pressure,
        updated_at: new Date().toISOString(),
        updated_by: userData?.user.user_email,
      }});
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
            <form onSubmit={mediaLOVForm.handleSubmit(handleUnitSubmit, (errors) => {
                console.log("Validation Errors:", [errors, mediaLOVForm.getValues()]);
                toast.error("Validation Errors");
              } )}>
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
                      name="media_density"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Density (g/cm³)
                              
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 1 or 0.98"
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
                      name="media_viscosity"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Viscosity (mm²/s)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 1 or 0.98"
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
                      name="vapor_pressure"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Vapor Pressure (g/mL)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="E.g. 1 or 10"
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
  validateSearch: (search : { id : string}) => {
    return { id: search.id || null};
  },
});
