import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PlusCircle } from "lucide-react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FormBox } from "@/components/common/FormBox";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import {
  PumpDetailSchema,
  MaterialAndImpellerDetailSchema,
  MotorAndCouplingDetailSchema,
  MechanicalSealDetailSchema,
  FlangeAndBearingDetailSchema,
} from "@/validators/pump_detail";
import { useSettings } from "@/lib/settings";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

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

export default function PumpList() {
  const [step, setStep] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [stepName, setStepName] = useState(1);
  const { showDescriptions } = useSettings();
  const getFormData = (key: string) =>
    JSON.parse(localStorage.getItem(key) || "{}");

  /* Tab 1 */
  type PumpGeneralDetail = z.infer<typeof PumpDetailSchema>;
  const formPumpGeneralDetail = useForm<PumpGeneralDetail>({
    resolver: zodResolver(PumpDetailSchema),
    defaultValues: getFormData("formData1"),
  });

  /* Tab 2 */
  type MaterialAndImpellerDetail = z.infer<
    typeof MaterialAndImpellerDetailSchema
  >;
  const formMaterialAndImpellerDetail = useForm<MaterialAndImpellerDetail>({
    resolver: zodResolver(MaterialAndImpellerDetailSchema),
    defaultValues: getFormData("formData2"),
  });

  /* Tab 3 */
  type MotorAndCouplingDetail = z.infer<typeof MotorAndCouplingDetailSchema>;
  const formMotorAndCouplingDetail = useForm<MotorAndCouplingDetail>({
    resolver: zodResolver(MotorAndCouplingDetailSchema),
    defaultValues: getFormData("formData3"),
  });

  /* Tab 4 */
  type MechanicalSealDetail = z.infer<typeof MechanicalSealDetailSchema>;
  const formMechanicalSealDetail = useForm<MechanicalSealDetail>({
    resolver: zodResolver(MechanicalSealDetailSchema),
    defaultValues: getFormData("formData4"),
  });

  /* Tab 5 */
  type FlangeAndBearingDetail = z.infer<typeof FlangeAndBearingDetailSchema>;
  const formFlangeAndBearingDetail = useForm<FlangeAndBearingDetail>({
    resolver: zodResolver(FlangeAndBearingDetailSchema),
    defaultValues: getFormData("formData5"),
  });

  const handleNextStep = (
    currentStep: number,
    stepName: number,
    formName: UseFormReturn<any>
  ) => {
    formName.handleSubmit(
      (data) => {
        localStorage.setItem(`formData${currentStep}`, JSON.stringify(data));
        setStep((prev) => ({
          ...prev,
          [currentStep]: true,
        }));
        setStepName(stepName);
      },
      (errors) => {
        console.error("Validation errors:", errors);
      }
    )();
  };

  const handlePreviousStep = (currentStep: number, stepName: number) => {
    setStep((prev) => ({
      ...prev,
      [currentStep - 1]: false,
      [currentStep]: false,
    }));
    setStepName(stepName);
  };

  return (
    <div className="container mx-auto p-4 items-center">
      <Tabs value={stepName}>
        <div className="flex items-center ">
          <TabsList className="w-full h-auto flex justify-between bg-white ">
            <TabsTrigger
              value={1}
              className={`rounded-full ${step[1] && "bg-primary text-white"}`}
            >
              {step[1] ? <Check className="w-[12px] h-[20px]" /> : "1"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step[1] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value={2}
              className={`rounded-full ${step[2] && "bg-primary text-white"}`}
            >
              {step[2] ? <Check className="w-[12px] h-[20px]" /> : "2"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step[2] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value={3}
              className={`rounded-full ${step[3] && "bg-primary text-white"}`}
            >
              {step[3] ? <Check className="w-[12px] h-[20px]" /> : "3"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step[3] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value={4}
              className={`rounded-full ${step[4] && "bg-primary text-white"}`}
            >
              {step[4] ? <Check className="w-[12px] h-[20px]" /> : "4"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step[4] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value={5}
              className={`rounded-full ${step[5] && "bg-primary text-white"}`}
            >
              {step[5] ? <Check className="w-[12px] h-[20px]" /> : "5"}
            </TabsTrigger>
          </TabsList>
        </div>
        <Card className="w-full mt-5">
          <CardContent>
            {/* Pump Details */}
            <TabsContent
              value={1}
              className="container flex-auto space-x-2 space-y-3 py-3"
            >
              <Form {...formPumpGeneralDetail}>
                <form>
                  <h2 className="w-full text-2xl font-bold flex items-center justify-center">
                    Pumps Details
                  </h2>
                  <div className="flex flex-col">
                    {/* General Detail */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Pump General Detail">
                        <div className="space-y-2">
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Location
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Location" {...field} />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the location of the pump.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="brand"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Brand
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Brand" {...field} />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the brand of the pump.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Model
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Model" {...field} />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the model of the pump.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="tag_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Tag&nbsp;No.
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Tag No." {...field} />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the tag number of the pump.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="serial_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Serial&nbsp;No.
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Serial No."
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the serial number of the pump.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_standard"
                            render={({ field: standardField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Standard
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_standard_no */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="pump_standard_no"
                                      render={({ field: standardNoField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Pump Standard No."
                                            {...standardNoField}
                                          />
                                        </FormControl>
                                      )}
                                    />

                                    {/* Combobox for pump_standard */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1").pump_standard
                                            ? getFormData("formData1")
                                                .pump_standard
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          standardField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_type_name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Pump Type
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      items={frameworks}
                                      label={
                                        getFormData("formData1").pump_type_name
                                          ? getFormData("formData1")
                                              .pump_type_name
                                          : "Select"
                                      }
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the serial number of the pump.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_design"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Pump design
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      items={frameworks}
                                      label={
                                        getFormData("formData1").pump_design
                                          ? getFormData("formData1").pump_design
                                          : "Select"
                                      }
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the serial number of the pump.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    {/* Pump Technical Data */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Pump Technical Data">
                        <div className="space-y-2">
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_speed_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Speed
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="pump_speed"
                                      render={({ field: speedField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Pump"
                                            {...speedField}
                                            defaultValue={
                                              getFormData("formData1")
                                                .pump_speed
                                                ? getFormData("formData1")
                                                    .pump_speed
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for pump_speed_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .pump_speed_unit
                                            ? getFormData("formData1")
                                                .pump_speed_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          speedField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_efficiency_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Efficiency
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_efficiency */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="pump_efficiency"
                                      render={({ field: speedField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Efficiency"
                                            {...speedField}
                                            defaultValue={
                                              getFormData("formData1")
                                                .pump_efficiency
                                                ? getFormData("formData1")
                                                    .pump_efficiency
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for pump_efficiency_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .pump_efficiency_unit
                                            ? getFormData("formData1")
                                                .pump_efficiency_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          speedField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="design_flow_unit"
                            render={({ field: flowField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Flow
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for design_flow */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="design_flow"
                                      render={({ field: flowField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Flow"
                                            {...flowField}
                                            defaultValue={
                                              getFormData("formData1")
                                                .design_flow
                                                ? getFormData("formData1")
                                                    .design_flow
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for design_flow_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .design_flow_unit
                                            ? getFormData("formData1")
                                                .design_flow_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          flowField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="min_head_unit"
                            render={({ field: shutoffHeadField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Shutoff head
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for min_head */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="min_head"
                                      render={({ field: shutoffHeadField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Shutoff head"
                                            {...shutoffHeadField}
                                            defaultValue={
                                              getFormData("formData1").min_head
                                                ? getFormData("formData1")
                                                    .min_head
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for design_flow_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1").min_head_unit
                                            ? getFormData("formData1")
                                                .min_head_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          shutoffHeadField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="design_head_unit"
                            render={({ field: headField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Head
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for design_head */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="design_head"
                                      render={({ field: headField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Head"
                                            {...headField}
                                            defaultValue={
                                              getFormData("formData1")
                                                .design_head
                                                ? getFormData("formData1")
                                                    .design_head
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for design_head_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .design_head_unit
                                            ? getFormData("formData1")
                                                .design_head_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          headField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="npshr_unit"
                            render={({ field: npshrField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    NPSHr
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for npshr */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="npshr"
                                      render={({ field: npshrField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="NPSHr"
                                            {...npshrField}
                                            defaultValue={
                                              getFormData("formData1").npshr
                                                ? getFormData("formData1").npshr
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for npshr_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1").npshr_unit
                                            ? getFormData("formData1")
                                                .npshr_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          npshrField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
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
                            control={formPumpGeneralDetail.control}
                            name="media"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Media
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Media"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData1").media
                                          ? getFormData("formData1").media
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the material of Casing.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="viscosity_unit"
                            render={({ field: viscosityField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Viscosity
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for viscosity */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="viscosity"
                                      render={({ field: viscosityField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Viscosity"
                                            {...viscosityField}
                                            defaultValue={
                                              getFormData("formData1").viscosity
                                                ? getFormData("formData1")
                                                    .viscosity
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for viscosity_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .viscosity_unit
                                            ? getFormData("formData1")
                                                .viscosity_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          viscosityField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <FormField
                            control={formPumpGeneralDetail.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Pumping Temp
                                    
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Pumping Temp"
                                      type="number"
                                      {...field}
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
                          /> */}
                          {/* <FormField
                            control={formPumpGeneralDetail.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Boiling Point
                                    
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Boiling Point"
                                      type="number"
                                      {...field}
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
                          /> */}
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="vapor_pressure_unit"
                            render={({ field: vaporPressureField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Vapor Pressure
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for Vapor Pressure */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="vapor_pressure"
                                      render={({
                                        field: vaporPressureField,
                                      }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Vapor Pressure"
                                            {...vaporPressureField}
                                            defaultValue={
                                              getFormData("formData1")
                                                .vapor_pressure
                                                ? getFormData("formData1")
                                                    .vapor_pressure
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for vapor_pressure_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .vapor_pressure_unit
                                            ? getFormData("formData1")
                                                .vapor_pressure_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          vaporPressureField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    <div className="w-full flex justify-end">
                      <Button
                        size="sm"
                        type="button"
                        className="gap-1 m-4 w-32"
                        onClick={() =>
                          handleNextStep(1, 2, formPumpGeneralDetail)
                        }
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Submit</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
            {/*Material and Impeller Details*/}
            <TabsContent
              value={2}
              className="container flex-auto space-x-2 space-y-3 py-3"
            >
              <h2 className="w-full text-2xl font-bold flex items-center justify-center">
                Material and Impeller Details
              </h2>
              <Form {...formMaterialAndImpellerDetail}>
                <form>
                  <div className="flex flex-col">
                    {/*Motor General Details*/}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Motor General Details">
                        <div className="space-y-2">
                          <FormField
                            control={formMaterialAndImpellerDetail.control}
                            name="casing_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Casing
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Casing material"
                                      {...field}
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
                            control={formMaterialAndImpellerDetail.control}
                            name="impeller_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Impeller
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Impeller material"
                                      {...field}
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
                            control={formMaterialAndImpellerDetail.control}
                            name="shaft_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Shaft
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Shaft material"
                                      {...field}
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
                      </FormBox>
                    </div>
                    {/*Impeller Details*/}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Impeller Details">
                        <div className="space-y-2">
                          <FormField
                            control={formMaterialAndImpellerDetail.control}
                            name="impeller_type"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Type
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Impeller type"
                                      {...field}
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
                            control={formMaterialAndImpellerDetail.control}
                            name="design_impeller_dia"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Diameter
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Impeller diameter"
                                      {...field}
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
                        <div className="w-full flex align-center justify-between">
                          <Button
                            size="sm"
                            variant={"outline"}
                            className="w-32"
                            onClick={() => handlePreviousStep(2, 1)}
                          >
                            Back
                          </Button>
                          <Button
                            size="sm"
                            className="w-32 gap-2"
                            onClick={() =>
                              handleNextStep(
                                2,
                                3,
                                formMaterialAndImpellerDetail
                              )
                            }
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Submit</span>
                          </Button>
                        </div>
                      </FormBox>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
            {/* Motor and Coupling Details */}
            <TabsContent
              value={3}
              className="container flex-auto space-x-2 space-y-3 py-3"
            >
              <h2 className="w-full text-2xl font-bold flex items-center justify-center">
                Motor and Coupling Details
              </h2>
              <Form {...formMotorAndCouplingDetail}>
                <form>
                  <div className="flex flex-col">
                    {/* Motor General Details */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Motor General Details">
                        <div className="space-y-2">
                          <FormField
                            control={formMotorAndCouplingDetail.control}
                            name="motor_brand"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Brand
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Brand" {...field} />
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Power
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Power (kW)"
                                      type="number"
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Model
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Model" {...field} />
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_speed"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Speed
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Speed (RPM)"
                                      type="number"
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_serial_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Serial No.
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Serial No."
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_rate_unit"
                            render={({ field: motorRateField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Rated Current
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for motor_rate */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_rate"
                                      render={({ field: motorRateField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Rated Current"
                                            {...motorRateField}
                                          />
                                        </FormControl>
                                      )}
                                    />

                                    {/* Combobox for motor_rate_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData3")
                                            .motor_rate_unit
                                            ? getFormData("formData3")
                                                .motor_rate_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          motorRateField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMotorAndCouplingDetail.control}
                            name="motor_frame"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Frame Size
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Frame Size"
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_efficiency"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Efficiency
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Efficiency"
                                      type="number"
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_protection"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Protection
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Protection"
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_drive"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Drive System
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData3").motor_drive
                                          ? getFormData("formData3").motor_drive
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_factor"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Power Factor
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Power Factor"
                                      type="number"
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_ie"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    IE Class
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData3").motor_ie
                                          ? getFormData("formData3").motor_ie
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formMotorAndCouplingDetail.control}
                            name="voltage"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Voltage
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Voltage"
                                      type="number"
                                      {...field}
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_connection"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Connection
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData3")
                                          .motor_connection
                                          ? getFormData("formData3")
                                              .motor_connection
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                      </FormBox>
                    </div>
                    {/* Flat Details */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Coupling Details">
                        <div className="space-y-2">
                          <FormField
                            control={formMotorAndCouplingDetail.control}
                            name="coup_brand"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Brand
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Brand" {...field} />
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
                            control={formMotorAndCouplingDetail.control}
                            name="coup_model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Model
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Model" {...field} />
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
                            control={formMotorAndCouplingDetail.control}
                            name="coup_type"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Type
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData3").coup_type
                                          ? getFormData("formData3").coup_type
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formMotorAndCouplingDetail.control}
                            name="coup_size"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Size
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Size" {...field} />
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
                            control={formMotorAndCouplingDetail.control}
                            name="coup_spacer"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Spacer
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Spacer"
                                      type="number"
                                      {...field}
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
                      </FormBox>
                    </div>
                    <div className="w-full flex align-center justify-between">
                      <Button
                        size="sm"
                        variant={"outline"}
                        className="w-32"
                        onClick={() => handlePreviousStep(3, 2)}
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        className="w-32 gap-2"
                        onClick={() =>
                          handleNextStep(3, 4, formMotorAndCouplingDetail)
                        }
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Submit</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
            {/* Mechanical Seal Details */}
            <TabsContent
              value={4}
              className="container flex-auto space-x-2 space-y-3 py-3"
            >
              <h2 className="w-full text-2xl font-bold flex items-center justify-center">
                Mechanical Seal Details
              </h2>
              <Form {...formMechanicalSealDetail}>
                <form>
                  <div className="flex flex-col">
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Mechanical Seal Details">
                        <div className="space-y-2">
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="mech_quantity"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Quantity
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData4").mech_quantity
                                          ? getFormData("formData4")
                                              .mech_quantity
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formMechanicalSealDetail.control}
                            name="mech_seal_cham"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Seal Chamber Design
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData4").mech_seal_cham
                                          ? getFormData("formData4")
                                              .mech_seal_cham
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                      </FormBox>
                    </div>
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Mechanical Seal">
                        <div className="space-y-2">
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="mech_brand"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Brand
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Brand" {...field} />
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
                            control={formMechanicalSealDetail.control}
                            name="mech_model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Modal
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Modal" {...field} />
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
                            control={formMechanicalSealDetail.control}
                            name="mech_size_unit"
                            render={({ field: mechSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Size
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for mech_size */}
                                    <FormField
                                      control={formMechanicalSealDetail.control}
                                      name="mech_size"
                                      render={({ field: mechSizeField }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Size"
                                            {...mechSizeField}
                                            defaultValue={
                                              getFormData("formData4").mech_size
                                                ? getFormData("formData4")
                                                    .mech_size
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for mech_size_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData4")
                                            .mech_size_unit
                                            ? getFormData("formData4")
                                                .mech_size_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          mechSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="mech_design"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Design
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="Design" {...field} />
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
                            control={formMechanicalSealDetail.control}
                            name="mech_api_plan"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    API PLAN
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input placeholder="API PLAN" {...field} />
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
                      </FormBox>
                    </div>
                    <div className="w-full flex align-center justify-between">
                      <Button
                        size="sm"
                        variant={"outline"}
                        className="w-32"
                        onClick={() => handlePreviousStep(4, 3)}
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        className="w-32 gap-2"
                        onClick={() =>
                          handleNextStep(4, 5, formMechanicalSealDetail)
                        }
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Submit</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
            {/* Flange and Bearing Details */}
            <TabsContent
              value={5}
              className="container flex-auto space-x-2 space-y-3 py-3"
            >
              <h2 className="w-full text-2xl font-bold flex items-center justify-center">
                Flange and Bearing Details
              </h2>
              <Form {...formFlangeAndBearingDetail}>
                <form>
                  <div className="flex flex-col">
                    {/* Flange Detail */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Flange Details">
                        <div className="space-y-2">
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="pump_suction_size_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction size
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="pump_suction_size"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Suction size"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .pump_suction_size
                                                ? getFormData("formData5")
                                                    .pump_suction_size_unit
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for pump_suction_size_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .pump_suction_size_unit
                                            ? getFormData("formData5")
                                                .pump_suction_size_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="pump_suction_rating"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Suction rating
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .pump_suction_rating
                                          ? getFormData("formData5")
                                              .pump_suction_rating
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_pipe_size"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Suction Pipe Size
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .suction_pipe_size
                                          ? getFormData("formData5")
                                              .suction_pipe_size
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_pipe_rating"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Suction Pipe Rating
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .suction_pipe_rating
                                          ? getFormData("formData5")
                                              .suction_pipe_rating
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_pipe_sch"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    SCH.
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .suction_pipe_sch
                                          ? getFormData("formData5")
                                              .suction_pipe_sch
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="pump_discharge_size_unit"
                            render={({ field: dischargeSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge size
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_discharge_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="pump_discharge_size"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full md:max-w-[500px]">
                                          <Input
                                            placeholder="Discharge size"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .pump_discharge_size
                                                ? getFormData("formData5")
                                                    .pump_discharge_size_unit
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for pump_discharge_size_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={frameworks} // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .pump_discharge_size_unit
                                            ? getFormData("formData5")
                                                .pump_discharge_size_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          dischargeSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                {showDescriptions && (
                                  <FormDescription>
                                    This is the pump standard and its number.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="pump_discharge_rating"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Discharge rating
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .pump_discharge_rating
                                          ? getFormData("formData5")
                                              .pump_discharge_rating
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe_size"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Discharge Pipe Size
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .discharge_pipe_size
                                          ? getFormData("formData5")
                                              .discharge_pipe_size
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe_rating"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Discharge Pipe Rating
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .discharge_pipe_rating
                                          ? getFormData("formData5")
                                              .discharge_pipe_rating
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe_sch"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    SCH.
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .discharge_pipe_sch
                                          ? getFormData("formData5")
                                              .discharge_pipe_sch
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                      </FormBox>
                    </div>
                    {/* Bearing Details */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Bearing Details">
                        <div className="space-y-2">
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="rotation_de"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Rotation
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5").rotation_de
                                          ? getFormData("formData5").rotation_de
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_lubric_type"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Lubrication Type
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .bearing_lubric_type
                                          ? getFormData("formData5")
                                              .bearing_lubric_type
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_lubric_brand"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Lubrication Brand
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .bearing_lubric_brand
                                          ? getFormData("formData5")
                                              .bearing_lubric_brand
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_lubric_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Lubrication No.
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={frameworks} // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .bearing_lubric_no
                                          ? getFormData("formData5")
                                              .bearing_lubric_no
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
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
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_nde"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Bearing NDE
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Bearing NDE"
                                      {...field}
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
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_de"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Bearing DE
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Bearing DE"
                                      {...field}
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
                        <div className="w-full flex align-center justify-between">
                          <Button
                            size="sm"
                            variant={"outline"}
                            className="w-32"
                            onClick={() => handlePreviousStep(5, 4)}
                          >
                            Back
                          </Button>
                          <Button
                            size="sm"
                            className="w-32 gap-2"
                            onClick={() =>
                              handleNextStep(5, 5, formFlangeAndBearingDetail)
                            }
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Submit</span>
                          </Button>
                        </div>
                      </FormBox>
                    </div>
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
