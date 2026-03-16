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
import { PumpMatLOVSchema } from "@/validators/pump";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  useGetMaterialDetailLOV,
  useUpdateMaterialLOV,
  useCreateMaterialLOV,
} from "@/hook/pump/pump";
import { PumpMatLOVResponse } from "@/types/pump/pumps";

function MaterialLOVEdit() {
  // Unit form setup
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const materialLOVForm = useForm<z.infer<typeof PumpMatLOVSchema>>({
    resolver: zodResolver(PumpMatLOVSchema),
  });

  const { id } = useSearch({ from: "/_auth/pump/material_lov_edit" });
  const { data: materialData } = useGetMaterialDetailLOV(id) as {
    data: PumpMatLOVResponse;
  };

  useEffect(() => {
    if (id && materialData) {
      materialLOVForm.setValue(
        "mat_code_name",
        materialData?.mat_code_name ?? "",
      );
      materialLOVForm.setValue(
        "pump_type_mat",
        materialData?.pump_type_mat ?? "",
      );
      materialLOVForm.setValue(
        "pump_mat_code",
        materialData?.pump_mat_code ?? "",
      );
      materialLOVForm.setValue("casing_mat", materialData?.casing_mat ?? "");
      materialLOVForm.setValue(
        "casing_cover_mat",
        materialData?.casing_cover_mat ?? "",
      );
      materialLOVForm.setValue(
        "impeller_mat",
        materialData?.impeller_mat ?? "",
      );
      materialLOVForm.setValue("liner_mat", materialData?.liner_mat ?? "");
      materialLOVForm.setValue(
        "pump_base_mat",
        materialData?.pump_base_mat ?? "",
      );
      materialLOVForm.setValue(
        "pump_head_mat",
        materialData?.pump_head_mat ?? "",
      );
      materialLOVForm.setValue(
        "pump_head_cover_mat",
        materialData?.pump_head_cover_mat ?? "",
      );
      materialLOVForm.setValue(
        "stage_casing_diffuser_mat",
        materialData?.stage_casing_diffuser_mat ?? "",
      );
    }
  }, [id, materialData]);

  //Get data for update when URL has id for update data
  const createMutation = useCreateMaterialLOV();
  const updateMutation = useUpdateMaterialLOV();

  const handleMatSubmit = (values: z.infer<typeof PumpMatLOVSchema>) => {
    const addData = {
      mat_code_name: values.mat_code_name,
      pump_type_mat: values.pump_type_mat,
      pump_mat_code: values.pump_mat_code,
      casing_mat: values.casing_mat,
      casing_cover_mat: values.casing_cover_mat,
      impeller_mat: values.impeller_mat,
      liner_mat: values.liner_mat,
      pump_base_mat: values.pump_base_mat,
      pump_head_mat: values.pump_head_mat,
      pump_head_cover_mat: values.pump_head_cover_mat,
      stage_casing_diffuser_mat: values.stage_casing_diffuser_mat,
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
          {id ? "Updating Motor" : "Adding Motor"}
        </h2>
        <Link to="/pump/material_lov_list">Back</Link>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...materialLOVForm}>
            <form
              onSubmit={materialLOVForm.handleSubmit(
                handleMatSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    materialLOVForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                },
              )}
            >
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Motor Information">
                  <div className="space-y-2">
                    <FormField
                      control={materialLOVForm.control}
                      name="mat_code_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12">
                              Material Code Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Material Code Name"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="pump_type_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Material Type
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump Material Type"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="pump_mat_code"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Material Code
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump Material Code"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="casing_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Casing Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Casing Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="casing_cover_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Casing Cover Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Casing Cover Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="impeller_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Impeller Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Impeller Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="liner_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Liner Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Liner Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="pump_base_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Base Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Base Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="pump_head_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Head Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump Head Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="pump_head_cover_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Pump Head Cover Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pump Head Cover Material"
                                {...field}
                                className="h-7"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialLOVForm.control}
                      name="stage_casing_diffuser_mat"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="w-2/12 ">
                              Stage Casing Diffuser Material
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Stage Casing Diffuser Material"
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
                      {id ? "Update Material" : "Add Material"}
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

export const Route = createFileRoute("/_auth/pump/material_lov_edit")({
  component: MaterialLOVEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
