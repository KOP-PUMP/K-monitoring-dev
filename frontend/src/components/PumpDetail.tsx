import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PumpDetailFormSchema,
  MotorAndCouplingDetailFormSchema,
  MaterialAndImpellerDetailFormSchema,
  MechanicalSealDetailFormSchema,
  FlangeAndBearingDetailFormSchema,
} from "@/validators/pump";
import { useSettings } from "@/lib/settings";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useGetCompanyDetailByCode } from "@/hook/users/company";

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
  const [SelectedCompanyCode, setSelectedCompanyCode] = useState<string>("");
  const [CompanyCode, setCompanyCode] = useState<string>("");
  const [stepName, setStepName] = useState(1);
  const [isAdd, setIsAdd] = useState(false);
  const { showDescriptions } = useSettings();
  const { data: companyData } = useGetCompanyDetailByCode(CompanyCode);
  const getFormData = (key: string) =>
    JSON.parse(localStorage.getItem(key) || "{}");

  /* Tab 1 */
  type PumpGeneralDetail = z.infer<typeof PumpDetailFormSchema>;
  const formPumpGeneralDetail = useForm<PumpGeneralDetail>({
    resolver: zodResolver(PumpDetailFormSchema),
    defaultValues: getFormData("formData1"),
  });

  /* Tab 2 */
  type MaterialAndImpellerDetail = z.infer<
    typeof MaterialAndImpellerDetailFormSchema
  >;
  const formMaterialAndImpellerDetail = useForm<MaterialAndImpellerDetail>({
    resolver: zodResolver(MaterialAndImpellerDetailFormSchema),
    defaultValues: getFormData("formData2"),
  });

  /* Tab 3 */
  type MotorAndCouplingDetail = z.infer<
    typeof MotorAndCouplingDetailFormSchema
  >;
  const formMotorAndCouplingDetail = useForm<MotorAndCouplingDetail>({
    resolver: zodResolver(MotorAndCouplingDetailFormSchema),
    defaultValues: getFormData("formData3"),
  });

  /* Tab 4 */
  type MechanicalSealDetail = z.infer<typeof MechanicalSealDetailFormSchema>;
  const formMechanicalSealDetail = useForm<MechanicalSealDetail>({
    resolver: zodResolver(MechanicalSealDetailFormSchema),
    defaultValues: getFormData("formData4"),
  });

  /* Tab 5 */
  type FlangeAndBearingDetail = z.infer<
    typeof FlangeAndBearingDetailFormSchema
  >;
  const formFlangeAndBearingDetail = useForm<FlangeAndBearingDetail>({
    resolver: zodResolver(FlangeAndBearingDetailFormSchema),
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
                            name="company_code"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-2/12">Code</FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Company Code"
                                        {...field}
                                        readOnly
                                      />
                                    </FormControl>
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <Button
                                          type="button"
                                          className="w-32 gap-1"
                                        >
                                          <Search className="h-3.5 w-3.5" />
                                          Find
                                        </Button>
                                      </SheetTrigger>
                                      <SheetContent>
                                        <SheetHeader>
                                          <SheetTitle>User Company</SheetTitle>
                                          <SheetDescription>
                                            Please enter customer code here
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="gap-4 pt-8">
                                          <div className="flex flex-col items-start gap-4">
                                            <Label
                                              htmlFor="name"
                                              className="text-right"
                                            >
                                              Code
                                            </Label>
                                            <Input
                                              id="input_code"
                                              className="col-span-3"
                                              onChange={(e) =>
                                                setSelectedCompanyCode(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          {companyData?.customer_code && (
                                            <div className="gap-4 pt-8">
                                              <SheetHeader>
                                                <SheetDescription className="text-center">
                                                  ** Please check the
                                                  information below **
                                                </SheetDescription>
                                              </SheetHeader>
                                              <div className="flex flex-col gap-4 pt-4 items-start">
                                                <Label
                                                  htmlFor="name"
                                                  className="text-right"
                                                >
                                                  Name
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_en
                                                  }
                                                  className="col-span-3 text-wrap h-4rem"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_th
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="address"
                                                  className="text-right pt-2"
                                                >
                                                  Address
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={companyData.address_en}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={companyData.address_th}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="province"
                                                  className="text-right pt-2"
                                                >
                                                  Province
                                                </Label>
                                                <Input
                                                  id="province"
                                                  value={companyData.province}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="sales_area"
                                                  className="text-right pt-2"
                                                >
                                                  Sales Area
                                                </Label>
                                                <Input
                                                  id="sales_area"
                                                  value={companyData.sales_area}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <SheetFooter className="pt-8">
                                          {companyData &&
                                            companyData.customer_code && (
                                              <SheetClose asChild>
                                                <Button
                                                  className="bg-green-500 hover:bg-green-600 w-full"
                                                  type="button"
                                                  onClick={() => {
                                                    setIsAdd(true);
                                                  }}
                                                >
                                                  <PlusCircle className="mr-2 h-3.5 w-3.5" />
                                                  Add
                                                </Button>
                                              </SheetClose>
                                            )}
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              setCompanyCode(
                                                SelectedCompanyCode
                                              );
                                            }}
                                          >
                                            Find
                                          </Button>
                                          <SheetClose asChild>
                                            <Button
                                              type="button"
                                              variant={"destructive"}
                                            >
                                              Close
                                            </Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
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
                            name="doc_customer"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Document
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
                            name="doc_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Document No.
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
                            name="doc_date"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Document Date
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
                            name="pump_lov_id"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-2/12">
                                    Select Pump
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Company Code"
                                        {...field}
                                        readOnly
                                      />
                                    </FormControl>
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <Button
                                          type="button"
                                          className="w-32 gap-1"
                                        >
                                          <Search className="h-3.5 w-3.5" />
                                          Find
                                        </Button>
                                      </SheetTrigger>
                                      <SheetContent>
                                        <SheetHeader>
                                          <SheetTitle>User Company</SheetTitle>
                                          <SheetDescription>
                                            Please enter customer code here
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="gap-4 pt-8">
                                          <div className="flex flex-col items-start gap-4">
                                            <Label
                                              htmlFor="name"
                                              className="text-right"
                                            >
                                              Code
                                            </Label>
                                            <Input
                                              id="input_code"
                                              className="col-span-3"
                                              onChange={(e) =>
                                                setSelectedCompanyCode(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          {companyData?.customer_code && (
                                            <div className="gap-4 pt-8">
                                              <SheetHeader>
                                                <SheetDescription className="text-center">
                                                  ** Please check the
                                                  information below **
                                                </SheetDescription>
                                              </SheetHeader>
                                              <div className="flex flex-col gap-4 pt-4 items-start">
                                                <Label
                                                  htmlFor="name"
                                                  className="text-right"
                                                >
                                                  Name
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_en
                                                  }
                                                  className="col-span-3 text-wrap h-4rem"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_th
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="address"
                                                  className="text-right pt-2"
                                                >
                                                  Address
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={companyData.address_en}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={companyData.address_th}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="province"
                                                  className="text-right pt-2"
                                                >
                                                  Province
                                                </Label>
                                                <Input
                                                  id="province"
                                                  value={companyData.province}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="sales_area"
                                                  className="text-right pt-2"
                                                >
                                                  Sales Area
                                                </Label>
                                                <Input
                                                  id="sales_area"
                                                  value={companyData.sales_area}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <SheetFooter className="pt-8">
                                          {companyData &&
                                            companyData.customer_code && (
                                              <SheetClose asChild>
                                                <Button
                                                  className="bg-green-500 hover:bg-green-600 w-full"
                                                  type="button"
                                                  onClick={() => {
                                                    setIsAdd(true);
                                                  }}
                                                >
                                                  <PlusCircle className="mr-2 h-3.5 w-3.5" />
                                                  Add
                                                </Button>
                                              </SheetClose>
                                            )}
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              setCompanyCode(
                                                SelectedCompanyCode
                                              );
                                            }}
                                          >
                                            Find
                                          </Button>
                                          <SheetClose asChild>
                                            <Button
                                              type="button"
                                              variant={"destructive"}
                                            >
                                              Close
                                            </Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
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
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="base_plate"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Base Plate
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
                            name="pump_status"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Pump Status
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
                            name="max_temp"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Max Temperature (°C)
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            name="max_flow_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Max Flow
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="max_flow"
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
                            name="min_flow_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Min Flow
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="min_flow"
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
                            name="hyd_power_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Hydraulic Power
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="hyd_power"
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
                            name="shut_off_head_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Shut Off Head
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="shut_off_head"
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
                            name="max_head_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Max Head
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="max_head"
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
                            name="suction_velo_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Velocity
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="suction_velo"
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
                            name="discharge_velo_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Velocity
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="discharge_velo"
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
                            name="bep_flow_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    BEP Flow
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="bep_flow"
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
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="power_required_cal_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Power Required (Cal.)
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="power_required_cal"
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
                            name="power_min_flow_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Power Min Flow
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="power_min_flow"
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
                            name="power_max_flow_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Power Max Flow
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="power_max_flow"
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
                            name="power_bep_flow_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    BEP Flow
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="power_bep_flow"
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
                            name="oper_temp"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Operation Temperature (°C)
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            name="solid_type"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Solid Type
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
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="solid_diameter"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Solid Diameter
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
                            name="density_unit"
                            render={({ field: viscosityField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Density
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for viscosity */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="density"
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
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="tank_position"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Tank Position
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
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="tank_design"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Tank Design
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
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="tank_pressure"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Tank Pressure (??)
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            name="suction_head"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Suction Head (??)
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            name="concentration"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Concentration (??)
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            name="solid_percentage"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Solid Percentage (%)
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Materials details">
                        <div className="space-y-2">
                          <FormField
                            control={formMaterialAndImpellerDetail.control}
                            name="material_lov_id"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-2/12">
                                    Material Group
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Company Code"
                                        {...field}
                                        readOnly
                                      />
                                    </FormControl>
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <Button
                                          type="button"
                                          className="w-32 gap-1"
                                        >
                                          <Search className="h-3.5 w-3.5" />
                                          Find
                                        </Button>
                                      </SheetTrigger>
                                      <SheetContent>
                                        <SheetHeader>
                                          <SheetTitle>User Company</SheetTitle>
                                          <SheetDescription>
                                            Please enter customer code here
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="gap-4 pt-8">
                                          <div className="flex flex-col items-start gap-4">
                                            <Label
                                              htmlFor="name"
                                              className="text-right"
                                            >
                                              Code
                                            </Label>
                                            <Input
                                              id="input_code"
                                              className="col-span-3"
                                              onChange={(e) =>
                                                setSelectedCompanyCode(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          {companyData?.customer_code && (
                                            <div className="gap-4 pt-8">
                                              <SheetHeader>
                                                <SheetDescription className="text-center">
                                                  ** Please check the
                                                  information below **
                                                </SheetDescription>
                                              </SheetHeader>
                                              <div className="flex flex-col gap-4 pt-4 items-start">
                                                <Label
                                                  htmlFor="name"
                                                  className="text-right"
                                                >
                                                  Name
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_en
                                                  }
                                                  className="col-span-3 text-wrap h-4rem"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_th
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="address"
                                                  className="text-right pt-2"
                                                >
                                                  Address
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={companyData.address_en}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={companyData.address_th}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="province"
                                                  className="text-right pt-2"
                                                >
                                                  Province
                                                </Label>
                                                <Input
                                                  id="province"
                                                  value={companyData.province}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="sales_area"
                                                  className="text-right pt-2"
                                                >
                                                  Sales Area
                                                </Label>
                                                <Input
                                                  id="sales_area"
                                                  value={companyData.sales_area}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <SheetFooter className="pt-8">
                                          {companyData &&
                                            companyData.customer_code && (
                                              <SheetClose asChild>
                                                <Button
                                                  className="bg-green-500 hover:bg-green-600 w-full"
                                                  type="button"
                                                  onClick={() => {
                                                    setIsAdd(true);
                                                  }}
                                                >
                                                  <PlusCircle className="mr-2 h-3.5 w-3.5" />
                                                  Add
                                                </Button>
                                              </SheetClose>
                                            )}
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              setCompanyCode(
                                                SelectedCompanyCode
                                              );
                                            }}
                                          >
                                            Find
                                          </Button>
                                          <SheetClose asChild>
                                            <Button
                                              type="button"
                                              variant={"destructive"}
                                            >
                                              Close
                                            </Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
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
                            control={formMaterialAndImpellerDetail.control}
                            name="casing_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Casing Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            control={formMaterialAndImpellerDetail.control}
                            name="casing_cover_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Casing Cover Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            control={formMaterialAndImpellerDetail.control}
                            name="diffuser_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Diffuser Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            control={formMaterialAndImpellerDetail.control}
                            name="pump_base_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Base Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            control={formMaterialAndImpellerDetail.control}
                            name="pump_head_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Head Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            control={formMaterialAndImpellerDetail.control}
                            name="pump_base_cover_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Head Cover Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            control={formMaterialAndImpellerDetail.control}
                            name="pump_lining_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Pump Lining Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                                    Design Impeller Diameter (mm.)
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
                          <FormField
                            control={formMaterialAndImpellerDetail.control}
                            name="impeller_max"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Max Diameter (mm.)
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            control={formMaterialAndImpellerDetail.control}
                            name="impeller_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Material
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
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
                            name="motor_lov_id"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-2/12">
                                    Select Motor
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Company Code"
                                        {...field}
                                        readOnly
                                      />
                                    </FormControl>
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <Button
                                          type="button"
                                          className="w-32 gap-1"
                                        >
                                          <Search className="h-3.5 w-3.5" />
                                          Find
                                        </Button>
                                      </SheetTrigger>
                                      <SheetContent>
                                        <SheetHeader>
                                          <SheetTitle>User Company</SheetTitle>
                                          <SheetDescription>
                                            Please enter customer code here
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="gap-4 pt-8">
                                          <div className="flex flex-col items-start gap-4">
                                            <Label
                                              htmlFor="name"
                                              className="text-right"
                                            >
                                              Code
                                            </Label>
                                            <Input
                                              id="input_code"
                                              className="col-span-3"
                                              onChange={(e) =>
                                                setSelectedCompanyCode(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          {companyData?.customer_code && (
                                            <div className="gap-4 pt-8">
                                              <SheetHeader>
                                                <SheetDescription className="text-center">
                                                  ** Please check the
                                                  information below **
                                                </SheetDescription>
                                              </SheetHeader>
                                              <div className="flex flex-col gap-4 pt-4 items-start">
                                                <Label
                                                  htmlFor="name"
                                                  className="text-right"
                                                >
                                                  Name
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_en
                                                  }
                                                  className="col-span-3 text-wrap h-4rem"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_th
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="address"
                                                  className="text-right pt-2"
                                                >
                                                  Address
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={companyData.address_en}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={companyData.address_th}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="province"
                                                  className="text-right pt-2"
                                                >
                                                  Province
                                                </Label>
                                                <Input
                                                  id="province"
                                                  value={companyData.province}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="sales_area"
                                                  className="text-right pt-2"
                                                >
                                                  Sales Area
                                                </Label>
                                                <Input
                                                  id="sales_area"
                                                  value={companyData.sales_area}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <SheetFooter className="pt-8">
                                          {companyData &&
                                            companyData.customer_code && (
                                              <SheetClose asChild>
                                                <Button
                                                  className="bg-green-500 hover:bg-green-600 w-full"
                                                  type="button"
                                                  onClick={() => {
                                                    setIsAdd(true);
                                                  }}
                                                >
                                                  <PlusCircle className="mr-2 h-3.5 w-3.5" />
                                                  Add
                                                </Button>
                                              </SheetClose>
                                            )}
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              setCompanyCode(
                                                SelectedCompanyCode
                                              );
                                            }}
                                          >
                                            Find
                                          </Button>
                                          <SheetClose asChild>
                                            <Button
                                              type="button"
                                              variant={"destructive"}
                                            >
                                              Close
                                            </Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
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
                            name="motor_speed_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Speed
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="motor_speed"
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
                            name="motor_rated_unit"
                            render={({ field: motorRateField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Rated
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for motor_rate */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_rated"
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
                            name="motor_efficiency_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Efficiency
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_efficiency"
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
                            control={formMotorAndCouplingDetail.control}
                            name="motor_rated_current_unit"
                            render={({ field: speedField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Rated Current
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_rated_current"
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
                            name="motor_standard"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Motor Standard
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
                            name="motor_phase"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 text-primary">
                                    Motor Phase
                                  </FormLabel>
                                  <FormControl className="w-full md:max-w-[500px]">
                                    <Input
                                      placeholder="motor_phase"
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
                            name="shaft_seal_design_id"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-2/12">
                                    Select Seal ID
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Company Code"
                                        {...field}
                                        readOnly
                                      />
                                    </FormControl>
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <Button
                                          type="button"
                                          className="w-32 gap-1"
                                        >
                                          <Search className="h-3.5 w-3.5" />
                                          Find
                                        </Button>
                                      </SheetTrigger>
                                      <SheetContent>
                                        <SheetHeader>
                                          <SheetTitle>User Company</SheetTitle>
                                          <SheetDescription>
                                            Please enter customer code here
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="gap-4 pt-8">
                                          <div className="flex flex-col items-start gap-4">
                                            <Label
                                              htmlFor="name"
                                              className="text-right"
                                            >
                                              Code
                                            </Label>
                                            <Input
                                              id="input_code"
                                              className="col-span-3"
                                              onChange={(e) =>
                                                setSelectedCompanyCode(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          {companyData?.customer_code && (
                                            <div className="gap-4 pt-8">
                                              <SheetHeader>
                                                <SheetDescription className="text-center">
                                                  ** Please check the
                                                  information below **
                                                </SheetDescription>
                                              </SheetHeader>
                                              <div className="flex flex-col gap-4 pt-4 items-start">
                                                <Label
                                                  htmlFor="name"
                                                  className="text-right"
                                                >
                                                  Name
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_en
                                                  }
                                                  className="col-span-3 text-wrap h-4rem"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={
                                                    companyData.company_name_th
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="address"
                                                  className="text-right pt-2"
                                                >
                                                  Address
                                                </Label>
                                                <Input
                                                  id="address"
                                                  value={companyData.address_en}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Input
                                                  id="address"
                                                  value={companyData.address_th}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="province"
                                                  className="text-right pt-2"
                                                >
                                                  Province
                                                </Label>
                                                <Input
                                                  id="province"
                                                  value={companyData.province}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="sales_area"
                                                  className="text-right pt-2"
                                                >
                                                  Sales Area
                                                </Label>
                                                <Input
                                                  id="sales_area"
                                                  value={companyData.sales_area}
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <SheetFooter className="pt-8">
                                          {companyData &&
                                            companyData.customer_code && (
                                              <SheetClose asChild>
                                                <Button
                                                  className="bg-green-500 hover:bg-green-600 w-full"
                                                  type="button"
                                                  onClick={() => {
                                                    setIsAdd(true);
                                                  }}
                                                >
                                                  <PlusCircle className="mr-2 h-3.5 w-3.5" />
                                                  Add
                                                </Button>
                                              </SheetClose>
                                            )}
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              setCompanyCode(
                                                SelectedCompanyCode
                                              );
                                            }}
                                          >
                                            Find
                                          </Button>
                                          <SheetClose asChild>
                                            <Button
                                              type="button"
                                              variant={"destructive"}
                                            >
                                              Close
                                            </Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
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
                            name="mech_api_plan"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    API Plan
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
                            name="shaft_seal_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Material
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
                            name="mech_main_temp"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Main Temperature (°C)
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
                            name="mech_main_pre"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Main Pressure (??)
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
                            name="seal_cham"
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
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="shaft_seal_brand"
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
                            name="shaft_seal_design"
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
                            name="pump_suction_size_id_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction size (ID)
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="pump_suction_size_id"
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
                            name="suction_pipe_length"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Pipe length
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_pipe_id_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Pipe ID
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="suction_pipe_id"
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
                            name="suction_elbow"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Elbow Pipe
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_tee"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Tee Pipe
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_reducer"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Reducer Pipe
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_valve"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Valve
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_valve"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Valve
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_y_strainer"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Y Strainer
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_other"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Other Component
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
                            control={formFlangeAndBearingDetail.control}
                            name="suction_equi_length"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Equivalent length 
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
                            control={formFlangeAndBearingDetail.control}
                            name="pump_discharge_size_id_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge size (ID)
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="pump_discharge_size_id"
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
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe_id_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Pipe ID
                                  </FormLabel>
                                  <div className="w-full md:max-w-[500px] flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="discharge_pipe_id"
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
                            name="discharge_pipe_length_h"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Horizontal Discharge Pipe Length
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe_length_v"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Vertical Discharge Pipe Length
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Elbow Pipe
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_elbow"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Elbow Pipe
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_tee"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Tee Pipe
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_reducer"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Reducer Pipe
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_valve"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Valve
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_valve"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Valve
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_y_strainer"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    SDischarge Y Strainer
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_other"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Other Component
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
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_equi_length"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Equivalent length 
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
