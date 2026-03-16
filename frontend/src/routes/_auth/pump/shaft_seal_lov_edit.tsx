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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ShaftSealLOVSchema } from "@/validators/pump";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  useGetShaftSealDetailLOV,
  useUpdateShaftSealLOV,
  useCreateShaftSealLOV,
} from "@/hook/pump/pump";

import { PumpShaftSealLOVResponse } from "@/types";

function ShaftSealLOVEdit() {
  // Unit form setup
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const shaftSealLOVForm = useForm<z.infer<typeof ShaftSealLOVSchema>>({
    resolver: zodResolver(ShaftSealLOVSchema),
  });


  const { id } = useSearch({ from: "/_auth/pump/shaft_seal_lov_edit" });
  const { data: shaftSealData } = useGetShaftSealDetailLOV(id) as { data : PumpShaftSealLOVResponse };

  useEffect(() => {
    if (id && shaftSealData) {
        shaftSealLOVForm.setValue("shaft_seal_code_name", shaftSealData?.shaft_seal_code_name ?? "")
        shaftSealLOVForm.setValue("shaft_seal_design", shaftSealData?.shaft_seal_design ?? "")
        shaftSealLOVForm.setValue("shaft_seal_brand", shaftSealData?.shaft_seal_brand ?? "")
        shaftSealLOVForm.setValue("shaft_seal_model", shaftSealData?.shaft_seal_model ?? "")
        shaftSealLOVForm.setValue("shaft_seal_material", shaftSealData?.shaft_seal_material ?? "")
        shaftSealLOVForm.setValue("mechanical_seal_api_plan", shaftSealData?.mechanical_seal_api_plan ?? "")
    }  
  }, [id, shaftSealData]);

  //Get data for update when URL has id for update data
  const createMutation = useCreateShaftSealLOV();
  const updateMutation = useUpdateShaftSealLOV();

  const handleSubmit = (values: z.infer<typeof ShaftSealLOVSchema>) => {
    const addData = {
        shaft_seal_code_name : values.shaft_seal_code_name,
        shaft_seal_design : values.shaft_seal_design,
        shaft_seal_brand : values.shaft_seal_brand,
        shaft_seal_model : values.shaft_seal_model,
        shaft_seal_material : values.shaft_seal_material,
        mechanical_seal_api_plan : values.mechanical_seal_api_plan,
        updated_at : new Date().toISOString(),
        updated_by : userData?.user.user_email,
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
          {id ? "Updating Shaft/Seal" : "Adding Shaft/Seal"}
        </h2>
        <Link to="/pump/shaft_seal_lov_list">Back</Link>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...shaftSealLOVForm}>
            <form
              onSubmit={shaftSealLOVForm.handleSubmit(
                handleSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    shaftSealLOVForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                }
              )}
            >
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Shaft/Seal Information">
                  <div className="space-y-2">
                    <FormField
                      control={shaftSealLOVForm.control}
                      name="shaft_seal_code_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12">
                              Shaft/Seal Code Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Shaft/Seal Code Name"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shaftSealLOVForm.control}
                      name="shaft_seal_design"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Shaft/Seal Design
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Shaft/Seal Design"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shaftSealLOVForm.control}
                      name="shaft_seal_brand"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">Shaft/Seal Brand</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Shaft/Seal Brand"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shaftSealLOVForm.control}
                      name="shaft_seal_model"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Shaft/Seal Model
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Shaft/Seal Model"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shaftSealLOVForm.control}
                      name="shaft_seal_material"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Shaft/Seal Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Shaft/Seal Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shaftSealLOVForm.control}
                      name="mechanical_seal_api_plan"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">API Plan</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="API Plan"
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
                      {id ? "Update Shaft/Seal" : "Add Shaft/Seal"}
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

export const Route = createFileRoute("/_auth/pump/shaft_seal_lov_edit")({
  component: ShaftSealLOVEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
