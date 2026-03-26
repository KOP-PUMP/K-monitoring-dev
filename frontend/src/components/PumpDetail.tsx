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
  MaterialDetailFormSchema,
  MechanicalSealDetailFormSchema,
  FlangeAndBearingDetailFormSchema,
} from "@/validators/pump";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useGetCompanyDetailByCode } from "@/hook/users/company";
import {
  useGetAllUnitLOVData,
  useGetAllPumpLOVData,
  useGetPumpDetailLOV,
  useGetMaterialDetailLOV,
  useGetShaftSealDetailLOV,
  useGetMotorDetailLOV,
  useGetMediaLOVData,
} from "@/hook/pump/pump";
import {
  PumpDetailLOVResponse,
  PumpMatLOVResponse,
  PumpShaftSealLOVResponse,
  MotorDetailLOVResponse,
  MediaLOVResponse,
} from "@/types/pump/pumps";
import { CompaniesResponse } from "@/types/users/company";
import { useGetCalPumpData } from "@/hook/factory_curve/factory_curve";
import { HeadFlowGraph } from "@/components/chart/HeadFlowGraph";

export default function PumpList() {
  /* Setup state and variable */
  /* page state */
  const [step, setStep] = useState({
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  });

  const [stepName, setStepName] = useState<string>("1");
  /* data filter state */
  const [CompanyCode, setCompanyCode] = useState<string>("");
  const [searchKey, setSearchKey] = useState({
    pump_lov_search: "",
    pump_mat_lov_search: "",
    pump_shaft_seal_lov_search: "",
    pump_motor_search: "",
  });
  /* fetched data state */
  const [pumpDetailCalData, setPumpDetailCalData] = useState<any>();
  const [pumpLOVData, setPumpLOVData] = useState<ComboboxItemProps[]>([]);
  const [pumpMatLOVData, setPumpMatLOVData] = useState<PumpMatLOVResponse[]>();
  const [pumpShaftSealData, setPumpShaftSealLOVData] =
    useState<PumpShaftSealLOVResponse[]>();
  const [pumpMotorLOVData, setPumpMotorLOVData] =
    useState<MotorAndCouplingDetail[]>();
  const [pumpUnitLOVData, setPumpUnitLOVData] = useState<ComboboxItemProps[]>();
  const [mediaLOVData, setMediaLOVData] = useState<ComboboxItemProps[]>();
  const [pumpDetailLOVData, setPumpDetailLOVData] =
    useState<PumpDetailLOVResponse[]>();
  /* Dropdown option from pump data */
  const { data: mediaData } = useGetMediaLOVData("") as {
    data: MediaLOVResponse[];
  };
  const { data: companyData } = useGetCompanyDetailByCode(CompanyCode);
  const { data: pumpDetailLOVResponse } = useGetPumpDetailLOV("");
  const { data: pumpMatLOVResponse } = useGetMaterialDetailLOV("") as {
    data: PumpMatLOVResponse[];
  };
  const { data: pumpShaftSealLOVResponse } = useGetShaftSealDetailLOV("") as {
    data: PumpShaftSealLOVResponse[];
  };
  const { data: pumpMotorLOVResponse } = useGetMotorDetailLOV("") as {
    data: MotorDetailLOVResponse[];
  };
  /* Dropdown option from LOV */
  const { data: pumpLOVResponse } = useGetAllPumpLOVData();
  const { data: pumpUnitLOVResponse } = useGetAllUnitLOVData();

  /* Mapping Data for drop down option */
  useEffect(() => {
    if (
      pumpLOVResponse &&
      pumpUnitLOVResponse &&
      pumpMatLOVResponse &&
      mediaData
    ) {
      const newPumpLOVData = pumpLOVResponse.map((data) => {
        return {
          type_name: data.type_name,
          product_name: data.product_name,
          value: data.data_value,
          label: data.data_value,
        };
      });
      const newPumpUnitLOVData = pumpUnitLOVResponse.map((data) => {
        return {
          type_name: data.type_name,
          product_name: data.product_name,
          value: data.data_value,
          label: data.data_value,
        };
      });
      const newMediaLOVData = mediaData.map((data) => {
        return {
          type_name: "media",
          product_name: "media",
          value: data.media_name,
          label: data.media_name,
        };
      });

      setPumpLOVData(newPumpLOVData);
      setPumpUnitLOVData(newPumpUnitLOVData);
      setMediaLOVData(newMediaLOVData);
    }
  }, [pumpLOVResponse, mediaData]);

  const getFormData = (key: string) =>
    JSON.parse(localStorage.getItem(key) || "{}");

  /* Tab 1 */
  type PumpGeneralDetail = z.infer<typeof PumpDetailFormSchema>;
  const formPumpGeneralDetail = useForm<PumpGeneralDetail>({
    resolver: zodResolver(PumpDetailFormSchema),
    defaultValues: getFormData("formData1"),
  });

  const generalDetailCurrentValue = formPumpGeneralDetail.getValues();

  /* Tab 2 */
  type MaterialAndImpellerDetail = z.infer<typeof MaterialDetailFormSchema>;
  const formMaterialDetail = useForm<MaterialAndImpellerDetail>({
    resolver: zodResolver(MaterialDetailFormSchema),
    defaultValues: getFormData("formData2"),
  });

  const materialDetailCurrentValue = formMaterialDetail.getValues();

  /* Tab 3 */
  type MotorAndCouplingDetail = z.infer<
    typeof MotorAndCouplingDetailFormSchema
  >;
  const formMotorAndCouplingDetail = useForm<MotorAndCouplingDetail>({
    resolver: zodResolver(MotorAndCouplingDetailFormSchema),
    defaultValues: getFormData("formData3"),
  });

  const motorAndCouplingDetailCurrentValue =
    formMotorAndCouplingDetail.getValues();

  /* Tab 4 */
  type MechanicalSealDetail = z.infer<typeof MechanicalSealDetailFormSchema>;
  const formMechanicalSealDetail = useForm<MechanicalSealDetail>({
    resolver: zodResolver(MechanicalSealDetailFormSchema),
    defaultValues: getFormData("formData4"),
  });

  const mechanicalSealDetailCurrentValue = formMechanicalSealDetail.getValues();

  /* Tab 5 */
  type FlangeAndBearingDetail = z.infer<
    typeof FlangeAndBearingDetailFormSchema
  >;
  const formFlangeAndBearingDetail = useForm<FlangeAndBearingDetail>({
    resolver: zodResolver(FlangeAndBearingDetailFormSchema),
    defaultValues: getFormData("formData5"),
  });

  /* const flangeAndBearingCurrentValue = formFlangeAndBearingDetail.getValues(); */

  const handleNextStep = (
    currentStep: string,
    nextName: string,
    formName: UseFormReturn<any>,
  ) => {
    formName.handleSubmit(
      (data) => {
        localStorage.setItem(`formData${currentStep}`, JSON.stringify(data));
        setStep((prev) => ({
          ...prev,
          [currentStep]: true,
        }));
        setStepName(nextName);
      },
      (errors) => {
        console.error("Validation errors:", errors);
      },
    )();
  };

  console.log(stepName);

  const handlePreviousStep = (currentStep: string, stepName: string) => {
    setStep((prev) => ({
      ...prev,
      [Number(currentStep) - 1]: false,
      [currentStep]: false,
    }));
    setStepName(stepName);
  };

  const handleLOVDataFilter = (name: string, type: string) => {
    if (type === "pump_data") {
      const filterData = pumpLOVData?.filter((data) => {
        return data.product_name === name;
      });
      return filterData;
    }
    if (type === "pump_unit") {
      const filterData = pumpUnitLOVData?.filter((data) => {
        return data.product_name == name;
      });
      return filterData;
    }
  };

  const handleResetCompanyDetailLOV = (data: CompaniesResponse) => {
    formPumpGeneralDetail.reset({
      ...generalDetailCurrentValue,
      company_id: data.company_id ?? "",
      company_code: data.customer_code ?? "",
      customer_industry_group: data.customer_industry_group ?? "",
      company_name_en: data.company_name_en ?? "",
      address_en: data.address_en ?? "",
      company_name_th: data.company_name_th ?? "",
      address_th: data.address_th ?? "",
      map: data.map ?? "",
      province: data.province ?? "",
      sales_area: data.sales_area ?? "",
    });
  };

  const handleResetPumpDetailLOV = (data: PumpDetailLOVResponse) => {
    formPumpGeneralDetail.reset({
      ...generalDetailCurrentValue,
      pump_lov_id: data.pump_lov_id ?? "",
      pump_code_name: data.pump_code_name ?? "",
      pump_brand: data.pump_brand ?? "",
      pump_model: data.pump_model ?? "",
      pump_model_size: data.pump_model_size ?? "",
      pump_design: data.pump_design ?? "",
      pump_standard: data.pump_standard ?? "",
      pump_standard_no: data.pump_standard_no ?? "",
      pump_impeller_type: data.pump_impeller_type ?? "",
      pump_flange_con_std: data.pump_flange_con_std ?? "",
      pump_type_name: data.pump_type_name ?? "",
      pump_stage: data.pump_stage ?? "",
      pump_seal_chamber: data.pump_seal_chamber ?? "",
      pump_oil_seal: data.pump_oil_seal ?? "",
      pump_max_temp: data.pump_max_temp ?? "",
      pump_suction_size_id: data.pump_suction_size_id ?? "",
      pump_suction_size: data.pump_suction_size ?? "",
      pump_suction_rating: data.pump_suction_rating ?? "",
      pump_discharge_size_id: data.pump_discharge_size_id ?? "",
      pump_discharge_size: data.pump_discharge_size ?? "",
      pump_discharge_rating: data.pump_discharge_rating ?? "",
      pump_impeller_max_size: data.pump_impeller_max_size ?? "",
    });
  };

  const handleResetMediaLOV = (data: MediaLOVResponse) => {
    formPumpGeneralDetail.reset({
      ...generalDetailCurrentValue,
      media_lov_id: data.media_lov_id ?? "",
      media_name: data.media_name ?? "",
      media_density: data.media_density ?? "",
      media_density_unit: data.media_density_unit ?? "",
      media_viscosity: data.media_viscosity ?? "",
      media_viscosity_unit: data.media_viscosity_unit ?? "",
      media_concentration_percentage: data.media_concentration_percentage ?? "",
      operating_temperature: data.operating_temperature ?? "",
      vapor_pressure: data.vapor_pressure ?? "",
      vapor_pressure_unit: data.vapor_pressure_unit ?? "",
    });
  };

  const handleResetMatLOV = (data: PumpMatLOVResponse) => {
    formMaterialDetail.reset({
      ...materialDetailCurrentValue,
      mat_lov_id: data.mat_lov_id ?? "",
      mat_code_name: data.mat_code_name ?? "",
      pump_type_mat: data.pump_type_mat ?? "",
      pump_mat_code: data.pump_mat_code ?? "",
      casing_mat: data.casing_mat ?? "",
      casing_cover_mat: data.casing_cover_mat ?? "",
      impeller_mat: data.impeller_mat ?? "",
      liner_mat: data.liner_mat ?? "",
      pump_base_mat: data.pump_base_mat ?? "",
      pump_head_mat: data.pump_head_mat ?? "",
      pump_head_cover_mat: data.pump_head_cover_mat ?? "",
      stage_casing_diffuser_mat: data.stage_casing_diffuser_mat ?? "",
    });
  };

  const handleResetMotorLOV = (data: MotorDetailLOVResponse) => {
    formMotorAndCouplingDetail.reset({
      ...motorAndCouplingDetailCurrentValue,
      motor_lov_id: data.motor_lov_id ?? "",
      motor_code_name: data.motor_code_name ?? "",
      motor_model: data.motor_model ?? "",
      motor_serial_no: data.motor_serial_no ?? "",
      motor_brand: data.motor_brand ?? "",
      motor_drive: data.motor_drive ?? "",
      motor_standard: data.motor_standard ?? "",
      motor_ie: data.motor_ie ?? "",
      motor_speed: data.motor_speed ?? "",
      motor_speed_unit: data.motor_speed_unit ?? "",
      motor_rated: data.motor_rated ?? "",
      motor_rated_unit: data.motor_rated_unit ?? "",
      motor_factor: data.motor_factor ?? "",
      motor_connection: data.motor_connection ?? "",
      motor_phase: data.motor_phase ?? "",
      motor_efficiency: data.motor_efficiency ?? "",
      motor_efficiency_unit: data.motor_efficiency_unit ?? "",
      motor_rated_current: data.motor_rated_current ?? "",
      motor_rated_current_unit: data.motor_rated_current_unit ?? "",
    });
  };

  const handleResetMechanicalSealLOV = (data: PumpShaftSealLOVResponse) => {
    formMechanicalSealDetail.reset({
      ...mechanicalSealDetailCurrentValue,
      shaft_seal_lov_id: data.shaft_seal_lov_id ?? "",
      shaft_seal_code_name: data.shaft_seal_code_name ?? "",
      shaft_seal_design: data.shaft_seal_design ?? "",
      shaft_seal_brand: data.shaft_seal_brand ?? "",
      shaft_seal_model: data.shaft_seal_model ?? "",
      shaft_seal_material: data.shaft_seal_material ?? "",
      mechanical_seal_api_plan: data.mechanical_seal_api_plan ?? "",
    });
  };

  /* const createMutation = useCreatePumpDetail(); */
  /* const localstorage = window.localStorage.getItem("user"); */
  /* const userData = localstorage !== null ? JSON.parse(localstorage) : null; */
  /* const handleDataSubmit = () => {
    const form1 = formPumpGeneralDetail.getValues();
    const form2 = formMaterialDetail.getValues();
    const form3 = formMotorAndCouplingDetail.getValues();
    const form4 = formMechanicalSealDetail.getValues();
    const form5 = formFlangeAndBearingDetail.getValues();
    createMutation.mutate({
      ...form1,
      ...form2,
      ...form3,
      ...form4,
      ...form5,
      created_at: new Date().toISOString(),
      created_by: userData?.user.user_email,
      updated_at: new Date().toISOString(),
      updated_by: userData?.user.user_email,
    });
  }; */

  const { mutate, isPending, isError } = useGetCalPumpData();

  const handleCalculateClick = () => {
    const calculateFormSchema = z.object({
      design_impeller_dia: z.string().min(1),
      pump_model: z.string().min(1),
      pump_model_size: z.string().min(1),
      pump_speed: z.string().min(1),
      pump_speed_unit: z.string().min(1),
      design_flow: z.string().min(1),
      design_flow_unit: z.string().min(1),
      design_head: z.string().min(1),
      design_head_unit: z.string().min(1),
      media_name: z.string().min(1),
      media_density: z.string().min(1),
      media_density_unit: z.string().min(1),
    });

    const formValues = {
      design_impeller_dia:
        formPumpGeneralDetail.getValues("design_impeller_dia") ?? "",
      pump_model: formPumpGeneralDetail.getValues("pump_model") ?? "",
      pump_model_size: formPumpGeneralDetail.getValues("pump_model_size") ?? "",
      pump_speed: formPumpGeneralDetail.getValues("pump_speed") ?? "",
      pump_speed_unit: formPumpGeneralDetail.getValues("pump_speed_unit") ?? "",
      design_flow: formPumpGeneralDetail.getValues("design_flow") ?? "",
      design_flow_unit:
        formPumpGeneralDetail.getValues("design_flow_unit") ?? "",
      design_head: formPumpGeneralDetail.getValues("design_head") ?? "",
      design_head_unit:
        formPumpGeneralDetail.getValues("design_head_unit") ?? "",
      media_name: formPumpGeneralDetail.getValues("media_name") ?? "",
      media_density: formPumpGeneralDetail.getValues("media_density") ?? "",
      media_density_unit:
        formPumpGeneralDetail.getValues("media_density_unit") ?? "",
    };

    const result = calculateFormSchema.safeParse(formValues);
    if (!result.success) {
      const errors: { [key: string]: any } = result.error.flatten().fieldErrors;

      Object.keys(formValues).forEach((key) => {
        if (errors[key]) {
          formPumpGeneralDetail.setError(key as any, {
            message: "*Please fill in the required fields",
          });
        } else {
          formPumpGeneralDetail.clearErrors(key as any);
        }
      });
      return;
    }

    Object.keys(formValues).forEach((key) => {
      formPumpGeneralDetail.clearErrors(key as any);
    });

    mutate(formValues, {
      onSuccess: (data) => {
        console.log("✅ success:", data);
        setPumpDetailCalData(data);
      },
      onError: (err: any) => {
        console.error("❌ failed:", err.message);
      },
    });
  };

  /* {
    "design_impeller_dia": "197",
    "model_short": "KDIN",
    "pump_model_size": "150-20",
    "pump_speed": "1450",
    "pump_speed_unit": "rpm",
    "design_flow": "225",
    "design_flow_unit": "m³/h",
    "design_head": "11.3",
    "design_head_unit": "m",
    "media": "Water (70)",
    "density": "0.998",
    "density_unit": "sg"
  } */

  useEffect(() => {
    if (pumpDetailCalData) {
      formPumpGeneralDetail.reset({
        ...generalDetailCurrentValue,
        min_flow: pumpDetailCalData.min_flow_point.point_flow
          .toFixed(2)
          .toString(),
        min_head: pumpDetailCalData.min_flow_point.point_head
          .toFixed(2)
          .toString(),
        max_flow: pumpDetailCalData.max_flow_point.point_flow
          .toFixed(2)
          .toString(),
        max_head: pumpDetailCalData.max_flow_point.point_head
          .toFixed(2)
          .toString(),
        bep_flow: pumpDetailCalData.bep_point.point_flow.toFixed(2).toString(),
        bep_head: pumpDetailCalData.bep_point.point_head.toFixed(2).toString(),
        shut_off_head: pumpDetailCalData.shut_off_head.toFixed(2).toString(),
        npshr: pumpDetailCalData.npshr.toFixed(2).toString(),
        pump_efficiency: pumpDetailCalData.operation_point.eff
          .toFixed(2)
          .toString(),
        hyd_power: pumpDetailCalData.hydraulic_power_kW.toFixed(2).toString(),
        power_min_flow: pumpDetailCalData.power_min_flow_kW
          .toFixed(2)
          .toString(),
        power_max_flow: pumpDetailCalData.power_max_flow_kW
          .toFixed(2)
          .toString(),
        power_required_cal: pumpDetailCalData.power_required_cal_kW
          .toFixed(2)
          .toString(),
        power_bep_flow: pumpDetailCalData.power_bep_kW.toFixed(2).toString(),
        pump_efficiency_unit: pumpDetailCalData.units.unit_eff.toString(),
        shut_off_head_unit: pumpDetailCalData.units.unit_head.toString(),
      });
    }
  }, [pumpDetailCalData]);

  return (
    <Tabs
        value={stepName}
        onValueChange={setStepName}
        className="container mx-auto p-4 items-center"
      >
        <div className="flex items-center ">
          <TabsList className="w-full h-auto flex justify-between bg-white ">
            <TabsTrigger
              value="1"
              className={`rounded-full ${step["1"] && "bg-primary text-white"}`}
            >
              {step["1"] ? <Check className="w-[12px] h-[20px]" /> : "1"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step["1"] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value="2"
              className={`rounded-full ${step["2"] && "bg-primary text-white"}`}
            >
              {step["2"] ? <Check className="w-[12px] h-[20px]" /> : "2"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step["2"] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value="3"
              className={`rounded-full ${step["3"] && "bg-primary text-white"}`}
            >
              {step["3"] ? <Check className="w-[12px] h-[20px]" /> : "3"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step["3"] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value="4"
              className={`rounded-full ${step["4"] && "bg-primary text-white"}`}
            >
              {step["4"] ? <Check className="w-[12px] h-[20px]" /> : "4"}
            </TabsTrigger>
            <hr
              className={`border-[1px] w-[20%] ${step["4"] ? "border-primary" : "border-neutral-300"}`}
            />
            <TabsTrigger
              value="5"
              className={`rounded-full ${step["5"] && "bg-primary text-white"}`}
            >
              {step["5"] ? <Check className="w-[12px] h-[20px]" /> : "5"}
            </TabsTrigger>
          </TabsList>
        </div>
        <Card className="w-full mt-5">
          <CardContent>
            {/* Pump Details */}
            <TabsContent
              value="1"
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
                                  <FormLabel className="w-32 lg:w-44">
                                    Company Code
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
                                              id="input_company_code"
                                              className="w-full"
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
                                                    handleResetCompanyDetailLOV(
                                                      companyData,
                                                    );
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
                                              const input =
                                                document.getElementById(
                                                  "input_company_code",
                                                ) as HTMLInputElement;
                                              setCompanyCode(input?.value);
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

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="customer_industry_group"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Industry Group
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Industry Group"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="company_name_en"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Company Name (EN)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Company Name (EN)"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="company_name_th"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Company Name (TH)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Company Name (TH)"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="address_en"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Address (EN)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Address (EN)"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="address_th"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Address (TH)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Address (TH)"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="map"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Map
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Map"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Province
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Province"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="sales_area"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Sale Area
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Sale Area"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="doc_customer"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Document
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input placeholder="Document" {...field} />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44">
                                    Document No.
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Document No."
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Document Date"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

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
                                    Tag No.
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input placeholder="Tag No." {...field} />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44">
                                    Serial number
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Serial number"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_code_name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Pump Model
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Pump Model"
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
                                      <SheetContent
                                        side="right"
                                        className="w-[400px] sm:w-[540px]"
                                        style={{ zIndex: 1000 }}
                                      >
                                        <SheetHeader>
                                          <SheetTitle>Select a User</SheetTitle>
                                          <SheetDescription>
                                            Choose a user from the list below
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="py-6">
                                          <Input
                                            placeholder="Search model..."
                                            className="mb-6"
                                            value={searchKey.pump_lov_search}
                                            onChange={(e) => {
                                              const searchValue =
                                                e.target.value.toLowerCase(); // Ensure case insensitivity

                                              const filterData =
                                                pumpDetailLOVResponse?.filter(
                                                  (data) =>
                                                    data.pump_model
                                                      ?.toLowerCase()
                                                      .includes(searchValue),
                                                );
                                              setSearchKey({
                                                ...searchKey,
                                                pump_lov_search: e.target.value,
                                              });

                                              setPumpDetailLOVData(filterData);
                                            }}
                                          />
                                          <div className="space-y-4 h-[400px] max-h-[400px] overflow-y-auto">
                                            {searchKey.pump_lov_search ===
                                            "" ? (
                                              pumpDetailLOVResponse?.map(
                                                (data) => (
                                                  <SheetClose
                                                    key={data.pump_brand}
                                                    className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                    onClick={() =>
                                                      handleResetPumpDetailLOV(
                                                        data,
                                                      )
                                                    }
                                                  >
                                                    <div className="font-medium">
                                                      {data.pump_code_name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground flex flex-col items-start">
                                                      <p>
                                                        Brand :{" "}
                                                        {data.pump_brand}
                                                      </p>
                                                      <p>
                                                        Model :{" "}
                                                        {data.pump_model}
                                                      </p>
                                                      <p>
                                                        Design :{" "}
                                                        {data.pump_design}
                                                      </p>
                                                      <p>
                                                        Type :{" "}
                                                        {data.pump_type_name}
                                                      </p>
                                                    </div>
                                                  </SheetClose>
                                                ),
                                              )
                                            ) : pumpDetailLOVData &&
                                              pumpDetailLOVData?.length > 0 ? (
                                              pumpDetailLOVData.map((data) => (
                                                <SheetClose
                                                  key={data.pump_brand}
                                                  className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                  onClick={() => {
                                                    setSearchKey({
                                                      ...searchKey,
                                                      pump_lov_search: "",
                                                    });
                                                    handleResetPumpDetailLOV(
                                                      data,
                                                    );
                                                  }}
                                                >
                                                  <div className="font-medium">
                                                    {data.pump_model}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground flex flex-col items-start">
                                                    <p>
                                                      Brand : {data.pump_brand}
                                                    </p>
                                                    <p>
                                                      Model : {data.pump_model}
                                                    </p>
                                                    <p>
                                                      Design :{" "}
                                                      {data.pump_design}
                                                    </p>
                                                    <p>
                                                      Type :{" "}
                                                      {data.pump_type_name}
                                                    </p>
                                                  </div>
                                                </SheetClose>
                                              ))
                                            ) : (
                                              <div className="h-[400px] p-3 border rounded-md flex justify-center items-center">
                                                <p className="text-sm">
                                                  Pump not found.
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <SheetFooter>
                                          <SheetClose asChild>
                                            <Button type="button">Done</Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_brand"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Brand
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Brand"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Model
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Model"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_model_size"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Model Size
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Model"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44">
                                    Design
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Design"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44">
                                    Type
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Type"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_standard"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Standard
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      items={
                                        handleLOVDataFilter(
                                          "pump_standard",
                                          "pump_data",
                                        ) || []
                                      }
                                      label={
                                        getFormData("formData1").pump_standard
                                          ? getFormData("formData1")
                                              .pump_standard
                                          : "Select"
                                      }
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_standard_no"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Standard No.
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Standard No."
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_impeller_max_size"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Impeller Max
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Impeller Max"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_stage"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Stage
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Stage"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_impeller_type"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Impeller type
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Impeller type"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="base_plate"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Base Plate
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Base Plate"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input placeholder="Location" {...field} />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Combobox
                                      items={
                                        handleLOVDataFilter(
                                          "pump_status",
                                          "pump_data",
                                        ) || []
                                      }
                                      label={
                                        getFormData("formData1").pump_status
                                          ? getFormData("formData1").pump_status
                                          : "Select"
                                      }
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    {/* Pump Application Data */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Pump Application Data">
                        <div className="space-y-2">
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="media_name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Media
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      items={mediaLOVData || []}
                                      label={
                                        getFormData("formData1").media
                                          ? getFormData("formData1").media
                                          : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                        if (value) {
                                          const selectedMedia = mediaData?.find(
                                            (item) => item.media_name === value,
                                          );
                                          if (selectedMedia) {
                                            handleResetMediaLOV(selectedMedia);
                                          }
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="operating_temperature"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Operation Temperature (°C)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      readOnly
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="media_density_unit"
                            render={({ field: densityField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Density
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for density */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="media_density"
                                      render={({ field: densityField }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Density"
                                            {...densityField}
                                            readOnly
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_density",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          formPumpGeneralDetail.getValues(
                                            "media_density_unit",
                                          )
                                            ? formPumpGeneralDetail.getValues(
                                                "media_density_unit",
                                              )
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          densityField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="media_viscosity_unit"
                            render={({ field: viscosityField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Viscosity
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for viscosity */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="media_viscosity"
                                      render={({ field: viscosityField }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Viscosity"
                                            {...viscosityField}
                                            defaultValue={
                                              getFormData("formData1").viscosity
                                                ? getFormData("formData1")
                                                    .viscosity
                                                : ""
                                            }
                                            readOnly
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for viscosity_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_viscosity",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          formPumpGeneralDetail.getValues(
                                            "media_viscosity_unit",
                                          )
                                            ? formPumpGeneralDetail.getValues(
                                                "media_viscosity_unit",
                                              )
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          viscosityField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

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
                                  <div className="w-full flex gap-2">
                                    {/* Input for Vapor Pressure */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="vapor_pressure"
                                      render={({
                                        field: vaporPressureField,
                                      }) => (
                                        <FormControl className="w-full">
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
                                            readOnly
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    {/* Combobox for vapor_pressure_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_pres",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
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

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="media_concentration_percentage"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Concentration (%)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Concentration (%)"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData1")
                                          .media_concentration_percentage
                                          ? getFormData("formData1")
                                              .media_concentration_percentage
                                          : ""
                                      }
                                      readOnly
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Combobox
                                      items={
                                        handleLOVDataFilter(
                                          "solid_type",
                                          "pump_data",
                                        ) || []
                                      }
                                      label={
                                        getFormData("formData1").solid_type
                                          ? getFormData("formData1").solid_type
                                          : "Select"
                                      }
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Solid Diameter"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData1").solid_diameter
                                          ? getFormData("formData1")
                                              .solid_diameter
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="solid_percentage"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Solid Percentage
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Solid Percentage"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData1")
                                          .solid_percentage
                                          ? getFormData("formData1")
                                              .solid_percentage
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
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
                            name="design_impeller_dia"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Impeller Diameter (mm)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Impeller Diameter (mm)"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="max_temp"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Max Temperature (°C)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Max Temperature (°C)"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="pump_speed_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Speed
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="pump_speed"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Pump"
                                            {...Field}
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
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_speed",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .pump_speed_unit
                                            ? getFormData("formData1")
                                                .pump_speed_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formPumpGeneralDetail.control}
                            name="design_flow_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Flow
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="design_flow"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Flow"
                                            {...Field}
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
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_flow",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData1")
                                            .design_flow_unit
                                            ? getFormData("formData1")
                                                .design_flow_unit
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

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
                                  <div className="w-full flex gap-2">
                                    {/* Input for design_head */}
                                    <FormField
                                      control={formPumpGeneralDetail.control}
                                      name="design_head"
                                      render={({ field: headField }) => (
                                        <FormControl className="w-full">
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_head",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
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

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="button" onClick={handleCalculateClick}>
                            Calculate
                          </Button>
                          {pumpDetailCalData && (
                            <>
                              <HeadFlowGraph
                                chartData={
                                  pumpDetailCalData && [
                                    ...pumpDetailCalData.desire_imp_curve_data,
                                    ...pumpDetailCalData.efficiency_curve_data,
                                    pumpDetailCalData.min_flow_point,
                                    pumpDetailCalData.max_flow_point,
                                    pumpDetailCalData.operation_point,
                                    pumpDetailCalData.bep_point,
                                  ]
                                }
                                scatter={false}
                                isLoading={isPending}
                                isError={isError}
                              />
                              <FormBox field="Technical Details : Operating Point">
                                <div className="space-y-2">
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="pump_efficiency_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Efficiency
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_efficiency */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="pump_efficiency"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Efficiency"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .pump_efficiency
                                                        ? getFormData(
                                                            "formData1",
                                                          ).pump_efficiency
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_efficiency",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .pump_efficiency_unit
                                                    ? getFormData("formData1")
                                                        .pump_efficiency_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_eff
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="shut_off_head_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Shut Off Head
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_speed */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="shut_off_head"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Shut off head"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .shut_off_head
                                                        ? getFormData(
                                                            "formData1",
                                                          ).shut_off_head
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_head",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .shut_off_head_unit
                                                    ? getFormData("formData1")
                                                        .shut_off_head_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_head
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

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
                                          <div className="w-full flex gap-2">
                                            {/* Input for npshr */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="npshr"
                                              render={({
                                                field: npshrField,
                                              }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="NPSHr"
                                                    {...npshrField}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .npshr
                                                        ? getFormData(
                                                            "formData1",
                                                          ).npshr
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_npshr",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .npshr_unit
                                                    ? getFormData("formData1")
                                                        .npshr_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_npshr
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  npshrField.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="hyd_power_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Hydraulic Power
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_speed */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="hyd_power"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Pump"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .hyd_power
                                                        ? getFormData(
                                                            "formData1",
                                                          ).hyd_power
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_power",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .hyd_power_unit
                                                    ? getFormData("formData1")
                                                        .hyd_power_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_power
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="power_required_cal_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Power Required (Cal.)
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_speed */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="power_required_cal"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Power Required (Cal.)"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .power_required_cal
                                                        ? getFormData(
                                                            "formData1",
                                                          ).power_required_cal
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_power",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .power_required_cal_unit
                                                    ? getFormData("formData1")
                                                        .power_required_cal_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_power
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </FormBox>
                              <FormBox field="Technical Details : Best Efficiency Point">
                                <div className="space-y-2">
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="bep_flow_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            BEP. Flow
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_speed */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="bep_flow"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="BEP. Flow"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .bep_flow
                                                        ? getFormData(
                                                            "formData1",
                                                          ).bep_flow
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_flow",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .bep_flow_unit
                                                    ? getFormData("formData1")
                                                        .bep_flow_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_flow
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="bep_head_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            BEP Head
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_speed */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="bep_head"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Pump"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .bep_head
                                                        ? getFormData(
                                                            "formData1",
                                                          ).bep_head
                                                        : ""
                                                    }
                                                  />
                                                </FormControl>
                                              )}
                                            />
                                            <FormControl className="md:max-w-[500px]">
                                              <Combobox
                                                className="min-w-[86px]"
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_flow",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .bep_head_unit
                                                    ? getFormData("formData1")
                                                        .bep_head_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_head
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>
                                        <FormField
                                          control={
                                            formPumpGeneralDetail.control
                                          }
                                          name="power_bep_flow_unit"
                                          render={({ field: Field }) => (
                                            <FormItem>
                                              <div className="w-full flex items-center">
                                                <FormLabel className="w-32 lg:w-44">
                                                  Power BEP Flow
                                                </FormLabel>
                                                <div className="w-full flex gap-2">
                                                  {/* Input for pump_speed */}
                                                  <FormField
                                                    control={
                                                      formPumpGeneralDetail.control
                                                    }
                                                    name="power_bep_flow"
                                                    render={({
                                                      field: Field,
                                                    }) => (
                                                      <FormControl className="w-full">
                                                        <Input
                                                          placeholder="Power BEP Flow"
                                                          {...Field}
                                                          readOnly
                                                          defaultValue={
                                                            getFormData(
                                                              "formData1",
                                                            ).power_bep_flow
                                                              ? getFormData(
                                                                  "formData1",
                                                                ).power_bep_flow
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
                                                      items={
                                                        handleLOVDataFilter(
                                                          "unit_power",
                                                          "pump_unit",
                                                        ) || []
                                                      } // Dropdown options
                                                      label={
                                                        getFormData("formData1")
                                                          .power_bep_flow_unit
                                                          ? getFormData(
                                                              "formData1",
                                                            )
                                                              .power_bep_flow_unit
                                                          : pumpDetailCalData
                                                            ? pumpDetailCalData
                                                                .units.unit_flow
                                                            : "Select"
                                                      }
                                                      onChange={(value) => {
                                                        Field.onChange(value); // Update form state
                                                      }}
                                                    />
                                                  </FormControl>
                                                </div>
                                              </div>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </FormBox>
                              <FormBox field="Technical Details : Min Flow Point">
                                <div className="space-y-2">
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="min_flow_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Min Flow
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="min_flow"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Min Flow"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .min_flow
                                                        ? getFormData(
                                                            "formData1",
                                                          ).min_flow
                                                        : ""
                                                    }
                                                  />
                                                </FormControl>
                                              )}
                                            />
                                            <FormControl className="md:max-w-[500px]">
                                              <Combobox
                                                className="min-w-[86px]"
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_flow",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .min_flow_unit
                                                    ? getFormData("formData1")
                                                        .min_flow_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_flow
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="min_head_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Min Head
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="min_head"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Min Head"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .min_head
                                                        ? getFormData(
                                                            "formData1",
                                                          ).min_head
                                                        : ""
                                                    }
                                                  />
                                                </FormControl>
                                              )}
                                            />
                                            <FormControl className="md:max-w-[500px]">
                                              <Combobox
                                                className="min-w-[86px]"
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_head",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .min_head_unit
                                                    ? getFormData("formData1")
                                                        .min_head_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_head
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="power_min_flow_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Power Min Flow
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_speed */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="power_min_flow"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Pump"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .power_min_flow
                                                        ? getFormData(
                                                            "formData1",
                                                          ).power_min_flow
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_power",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .power_min_flow_unit
                                                    ? getFormData("formData1")
                                                        .power_min_flow_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_flow
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </FormBox>
                              <FormBox field="Technical Details : Max Flow Point">
                                <div className="space-y-2">
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="max_flow_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Max Flow
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="max_flow"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Max Flow"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .max_flow
                                                        ? getFormData(
                                                            "formData1",
                                                          ).max_flow
                                                        : ""
                                                    }
                                                  />
                                                </FormControl>
                                              )}
                                            />
                                            <FormControl className="md:max-w-[500px]">
                                              <Combobox
                                                className="min-w-[86px]"
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_flow",
                                                    "pump_unit",
                                                  ) || []
                                                }
                                                label={
                                                  getFormData("formData1")
                                                    .max_flow_unit
                                                    ? getFormData("formData1")
                                                        .max_flow_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_flow
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="max_head_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Max Head
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="max_head"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Max Head"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .max_head
                                                        ? getFormData(
                                                            "formData1",
                                                          ).max_head
                                                        : ""
                                                    }
                                                  />
                                                </FormControl>
                                              )}
                                            />
                                            <FormControl className="md:max-w-[500px]">
                                              <Combobox
                                                className="min-w-[86px]"
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_flow",
                                                    "pump_unit",
                                                  ) || []
                                                }
                                                label={
                                                  getFormData("formData1")
                                                    .max_head_unit
                                                    ? getFormData("formData1")
                                                        .max_head_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_head
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={formPumpGeneralDetail.control}
                                    name="power_max_flow_unit"
                                    render={({ field: Field }) => (
                                      <FormItem>
                                        <div className="w-full flex items-center">
                                          <FormLabel className="w-32 lg:w-44">
                                            Power Max Flow
                                          </FormLabel>
                                          <div className="w-full flex gap-2">
                                            {/* Input for pump_speed */}
                                            <FormField
                                              control={
                                                formPumpGeneralDetail.control
                                              }
                                              name="power_max_flow"
                                              render={({ field: Field }) => (
                                                <FormControl className="w-full">
                                                  <Input
                                                    placeholder="Pump"
                                                    {...Field}
                                                    readOnly
                                                    defaultValue={
                                                      getFormData("formData1")
                                                        .power_max_flow
                                                        ? getFormData(
                                                            "formData1",
                                                          ).power_max_flow
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
                                                items={
                                                  handleLOVDataFilter(
                                                    "unit_power",
                                                    "pump_unit",
                                                  ) || []
                                                } // Dropdown options
                                                label={
                                                  getFormData("formData1")
                                                    .power_max_flow_unit
                                                    ? getFormData("formData1")
                                                        .power_max_flow_unit
                                                    : pumpDetailCalData
                                                      ? pumpDetailCalData.units
                                                          .unit_power
                                                      : "Select"
                                                }
                                                onChange={(value) => {
                                                  Field.onChange(value); // Update form state
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </FormBox>
                            </>
                          )}
                        </div>
                      </FormBox>
                    </div>
                    <div className="w-full flex justify-end">
                      <Button
                        size="sm"
                        type="button"
                        className="gap-1 m-4 w-32"
                        onClick={() => {
                          handleNextStep("1", "2", formPumpGeneralDetail);
                        }}
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
              value="2"
              className="container flex-auto space-x-2 space-y-3 py-3"
            >
              <h2 className="w-full text-2xl font-bold flex items-center justify-center">
                Material Details
              </h2>
              <Form {...formMaterialDetail}>
                <form>
                  <div className="flex flex-col">
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Materials details">
                        <div className="space-y-2">
                          <FormField
                            control={formMaterialDetail.control}
                            name="mat_code_name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Select Material Model
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Material Model"
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
                                      <SheetContent
                                        side="right"
                                        className="w-[400px] sm:w-[540px]"
                                        style={{ zIndex: 1000 }}
                                      >
                                        <SheetHeader>
                                          <SheetTitle>Select a User</SheetTitle>
                                          <SheetDescription>
                                            Choose a user from the list below
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="py-6">
                                          <Input
                                            placeholder="Search model..."
                                            className="mb-6"
                                            onChange={(e) => {
                                              const searchValue =
                                                e.target.value.toLowerCase(); // Ensure case insensitivity

                                              const filterData =
                                                pumpMatLOVResponse?.filter(
                                                  (data) =>
                                                    data.casing_mat
                                                      ?.toLowerCase()
                                                      .includes(searchValue),
                                                );
                                              setSearchKey({
                                                ...searchKey,
                                                pump_mat_lov_search:
                                                  e.target.value,
                                              });

                                              setPumpMatLOVData(filterData);
                                            }}
                                          />
                                          <div className="space-y-4 h-[400px] max-h-[400px] overflow-y-auto">
                                            {searchKey.pump_mat_lov_search ===
                                            "" ? (
                                              pumpMatLOVResponse?.map(
                                                (data) => (
                                                  <SheetClose
                                                    key={data.mat_lov_id}
                                                    className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                    onClick={() => {
                                                      handleResetMatLOV(data);
                                                    }}
                                                  >
                                                    <div className="font-medium">
                                                      {data.mat_code_name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      Casing : {data.casing_mat}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      Casing cover :{" "}
                                                      {data.casing_cover_mat}
                                                    </div>
                                                  </SheetClose>
                                                ),
                                              )
                                            ) : pumpMatLOVData &&
                                              pumpMatLOVData?.length > 0 ? (
                                              pumpMatLOVData.map((data) => (
                                                <SheetClose
                                                  key={data.mat_lov_id}
                                                  className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                  onClick={() => {
                                                    setSearchKey({
                                                      ...searchKey,
                                                      pump_mat_lov_search: "",
                                                    });
                                                    handleResetMatLOV(data);
                                                  }}
                                                >
                                                  <div className="font-medium">
                                                    {data.mat_code_name}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    Casing : {data.casing_mat}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    Casing cover :{" "}
                                                    {data.casing_cover_mat}
                                                  </div>
                                                </SheetClose>
                                              ))
                                            ) : (
                                              <div className="h-[400px] p-3 border rounded-md flex justify-center items-center">
                                                <p className="text-sm">
                                                  Pump not found.
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <SheetFooter>
                                          <SheetClose asChild>
                                            <Button type="button">Done</Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="casing_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Casing Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Casing Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="impeller_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Impeller Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Impeller Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="casing_cover_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Casing Cover Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Casing Cover Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="liner_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Pump Lining Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Pump Lining Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="pump_base_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Base Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Base Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="pump_head_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Head Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Head Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="pump_head_cover_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Head Cover Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Head Cover Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMaterialDetail.control}
                            name="stage_casing_diffuser_mat"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Diffuser Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder=" Diffuser Material"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    {/*Impeller Details*/}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <div className="w-full flex align-center justify-between">
                        <Button
                          size="sm"
                          variant={"outline"}
                          className="w-32"
                          onClick={() => handlePreviousStep("2", "1")}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          className="w-32 gap-2"
                          onClick={() => {
                            console.log(formMaterialDetail.getValues());
                            handleNextStep("2", "3", formMaterialDetail);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Submit</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
            {/* Motor and Coupling Details */}
            <TabsContent
              value="3"
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
                            name="motor_code_name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Code Name
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Please Select Motor"
                                        {...field}
                                        readOnly
                                        defaultValue={
                                          getFormData("formData3")
                                            .motor_code_name
                                            ? getFormData("formData3")
                                                .motor_code_name
                                            : ""
                                        }
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
                                      <SheetContent
                                        side="right"
                                        className="w-[400px] sm:w-[540px]"
                                        style={{ zIndex: 1000 }}
                                      >
                                        <SheetHeader>
                                          <SheetTitle>Select Motor</SheetTitle>
                                          <SheetDescription>
                                            Choose a motor from the list below
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="py-6">
                                          <Input
                                            placeholder="Search model..."
                                            className="mb-6"
                                            onChange={(e) => {
                                              const searchValue =
                                                e.target.value.toLowerCase(); // Ensure case insensitivity

                                              const filterData =
                                                pumpMotorLOVResponse?.filter(
                                                  (data) =>
                                                    data.motor_model
                                                      ?.toLowerCase()
                                                      .includes(searchValue),
                                                );
                                              setSearchKey({
                                                ...searchKey,
                                                pump_motor_search:
                                                  e.target.value,
                                              });

                                              setPumpMotorLOVData(filterData);
                                            }}
                                          />
                                          <div className="space-y-4 h-[400px] max-h-[400px] overflow-y-auto">
                                            {searchKey.pump_motor_search ===
                                            "" ? (
                                              pumpMotorLOVResponse?.map(
                                                (data) => (
                                                  <SheetClose
                                                    key={data.motor_lov_id}
                                                    className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                    onClick={() => {
                                                      handleResetMotorLOV(data);
                                                    }}
                                                  >
                                                    <div className="font-medium">
                                                      {data.motor_code_name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      Model : {data.motor_model}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      Brand : {data.motor_brand}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      Standard :{" "}
                                                      {data.motor_standard}
                                                    </div>
                                                  </SheetClose>
                                                ),
                                              )
                                            ) : pumpMotorLOVData &&
                                              pumpMotorLOVData?.length > 0 ? (
                                              pumpMotorLOVData.map((data) => (
                                                <SheetClose
                                                  key={data.motor_lov_id}
                                                  className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                  onClick={() => {
                                                    console.log(data);
                                                    setSearchKey({
                                                      ...searchKey,
                                                      pump_motor_search: "",
                                                    });
                                                    handleResetMotorLOV(data);
                                                  }}
                                                >
                                                  <div className="font-medium">
                                                    {data.motor_code_name}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    Model : {data.motor_model}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    Brand : {data.motor_brand}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    Standard :{" "}
                                                    {data.motor_standard}
                                                  </div>
                                                </SheetClose>
                                              ))
                                            ) : (
                                              <div className="h-[400px] p-3 border rounded-md flex justify-center items-center">
                                                <p className="text-sm">
                                                  Motor not found.
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <SheetFooter>
                                          <SheetClose asChild>
                                            <Button type="button">Done</Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
                                  </div>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Serial No.
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Serial No."
                                      {...field}
                                      defaultValue={
                                        getFormData("formData3").motor_serial_no
                                          ? getFormData("formData3")
                                              .motor_serial_no
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Model"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3").motor_model
                                          ? getFormData("formData3").motor_model
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Brand"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3").motor_brand
                                          ? getFormData("formData3").motor_brand
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Drive System
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Drive System"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3").motor_drive
                                          ? getFormData("formData3").motor_drive
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Motor Standard
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Power Factor"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3").motor_standard
                                          ? getFormData("formData3")
                                              .motor_standard
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    IE Class
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="IE Class"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3").motor_ie
                                          ? getFormData("formData3").motor_ie
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMotorAndCouplingDetail.control}
                            name="motor_speed_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Speed
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_speed"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Motor Speed"
                                            {...Field}
                                            readOnly
                                            defaultValue={
                                              getFormData("formData3")
                                                .motor_speed
                                                ? getFormData("formData3")
                                                    .motor_speed
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_speed",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData3")
                                            .motor_speed_unit
                                            ? getFormData("formData3")
                                                .motor_speed_unit
                                            : formMotorAndCouplingDetail.getValues(
                                                  "motor_speed_unit",
                                                )
                                              ? formMotorAndCouplingDetail.getValues(
                                                  "motor_speed_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
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
                                  <div className="w-full flex gap-2">
                                    {/* Input for motor_rate */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_rated"
                                      render={({ field: motorRateField }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Rated Current"
                                            {...motorRateField}
                                            readOnly
                                            defaultValue={
                                              getFormData("formData3")
                                                .motor_rated
                                                ? getFormData("formData3")
                                                    .motor_rated
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />

                                    {/* Combobox for motor_rate_unit */}
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_power",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData3")
                                            .motor_rated_unit
                                            ? getFormData("formData3")
                                                .motor_rated_unit
                                            : formMotorAndCouplingDetail.getValues(
                                                  "motor_rated_unit",
                                                )
                                              ? formMotorAndCouplingDetail.getValues(
                                                  "motor_rated_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          motorRateField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Power Factor
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Power Factor"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3").motor_factor
                                          ? getFormData("formData3")
                                              .motor_factor
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Connection
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Connection"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3")
                                          .motor_connection
                                          ? getFormData("formData3")
                                              .motor_connection
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Motor Phase
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Motor Phase"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData3").motor_phase
                                          ? getFormData("formData3").motor_phase
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMotorAndCouplingDetail.control}
                            name="motor_efficiency_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Efficiency
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_efficiency"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Pump"
                                            {...Field}
                                            readOnly
                                            defaultValue={
                                              getFormData("formData3")
                                                .motor_efficiency
                                                ? getFormData("formData3")
                                                    .motor_efficiency
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_efficiency",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData3")
                                            .motor_efficiency_unit
                                            ? getFormData("formData3")
                                                .motor_efficiency_unit
                                            : formMotorAndCouplingDetail.getValues(
                                                  "motor_efficiency_unit",
                                                )
                                              ? formMotorAndCouplingDetail.getValues(
                                                  "motor_efficiency_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMotorAndCouplingDetail.control}
                            name="motor_rated_current_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Rated Current
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="motor_rated_current"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Pump"
                                            {...Field}
                                            readOnly
                                            defaultValue={
                                              getFormData("formData3")
                                                .motor_rated_current
                                                ? getFormData("formData3")
                                                    .motor_rated_current
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_power",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData3")
                                            .motor_rated_current_unit
                                            ? getFormData("formData3")
                                                .motor_rated_current_unit
                                            : formMotorAndCouplingDetail.getValues(
                                                  "motor_rated_current_unit",
                                                )
                                              ? formMotorAndCouplingDetail.getValues(
                                                  "motor_rated_current_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMotorAndCouplingDetail.control}
                            name="voltage_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Motor Voltage
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={
                                        formMotorAndCouplingDetail.control
                                      }
                                      name="voltage"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Pump"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData3").voltage
                                                ? getFormData("formData3")
                                                    .voltage
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_power",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData3").voltage_unit
                                            ? getFormData("formData3")
                                                .voltage_unit
                                            : formMotorAndCouplingDetail.getValues(
                                                  "voltage_unit",
                                                )
                                              ? formMotorAndCouplingDetail.getValues(
                                                  "voltage_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Coupling Type
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      items={
                                        handleLOVDataFilter(
                                          "coup_type",
                                          "pump_data",
                                        ) || []
                                      }
                                      label={
                                        getFormData("formData1").coup_type
                                          ? getFormData("formData1").coup_type
                                          : "Select"
                                      }
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>
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
                        onClick={() => handlePreviousStep("3", "2")}
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        className="w-32 gap-2"
                        onClick={() => {
                          console.log(formMotorAndCouplingDetail.getValues());
                          handleNextStep("3", "4", formMotorAndCouplingDetail);
                        }}
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
              value="4"
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
                            name="shaft_seal_code_name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Select Shaft Seal Model
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    <FormControl>
                                      <Input
                                        placeholder="Shaft / Seal Model"
                                        {...field}
                                        readOnly
                                        defaultValue={
                                          getFormData("formData4")
                                            .shaft_seal_code_name
                                            ? getFormData("formData4")
                                                .shaft_seal_code_name
                                            : ""
                                        }
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
                                      <SheetContent
                                        side="right"
                                        className="w-[400px] sm:w-[540px]"
                                        style={{ zIndex: 1000 }}
                                      >
                                        <SheetHeader>
                                          <SheetTitle>
                                            Select a Shaft / Seal
                                          </SheetTitle>
                                          <SheetDescription>
                                            Choose from the list below
                                          </SheetDescription>
                                        </SheetHeader>
                                        <div className="py-6">
                                          <Input
                                            placeholder="Search model..."
                                            className="mb-6"
                                            onChange={(e) => {
                                              const searchValue =
                                                e.target.value.toLowerCase(); // Ensure case insensitivity
                                              const filterData =
                                                pumpShaftSealLOVResponse?.filter(
                                                  (data) =>
                                                    data.shaft_seal_code_name
                                                      ?.toLowerCase()
                                                      .includes(searchValue),
                                                );
                                              setSearchKey({
                                                ...searchKey,
                                                pump_shaft_seal_lov_search:
                                                  e.target.value,
                                              });

                                              setPumpShaftSealLOVData(
                                                filterData,
                                              );
                                            }}
                                          />
                                          <div className="space-y-4 h-[400px] max-h-[400px] overflow-y-auto">
                                            {searchKey.pump_shaft_seal_lov_search ===
                                            "" ? (
                                              pumpShaftSealLOVResponse?.map(
                                                (data) => (
                                                  <SheetClose
                                                    key={data.shaft_seal_lov_id}
                                                    className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                    onClick={() => {
                                                      handleResetMechanicalSealLOV(
                                                        data,
                                                      );
                                                    }}
                                                  >
                                                    <div className="font-medium">
                                                      {
                                                        data.shaft_seal_code_name
                                                      }
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      Material :{" "}
                                                      {data.shaft_seal_material}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      API Plan :{" "}
                                                      {
                                                        data.mechanical_seal_api_plan
                                                      }
                                                    </div>
                                                  </SheetClose>
                                                ),
                                              )
                                            ) : pumpShaftSealData &&
                                              pumpShaftSealData?.length > 0 ? (
                                              pumpShaftSealData.map((data) => (
                                                <SheetClose
                                                  key={data.shaft_seal_lov_id}
                                                  className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                                  onClick={() => {
                                                    setSearchKey({
                                                      ...searchKey,
                                                      pump_shaft_seal_lov_search:
                                                        "",
                                                    });
                                                    handleResetMechanicalSealLOV(
                                                      data,
                                                    );
                                                  }}
                                                >
                                                  <div className="font-medium">
                                                    {`${data.shaft_seal_code_name}`}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    Material :{" "}
                                                    {data.shaft_seal_material}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    API Plan :{" "}
                                                    {
                                                      data.mechanical_seal_api_plan
                                                    }
                                                  </div>
                                                </SheetClose>
                                              ))
                                            ) : (
                                              <div className="h-[400px] p-3 border rounded-md flex justify-center items-center">
                                                <p className="text-sm">
                                                  Pump not found.
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <SheetFooter>
                                          <SheetClose asChild>
                                            <Button type="button">Done</Button>
                                          </SheetClose>
                                        </SheetFooter>
                                      </SheetContent>
                                    </Sheet>
                                  </div>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Design
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Design"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData4")
                                          .shaft_seal_design
                                          ? getFormData("formData4")
                                              .shaft_seal_design
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Brand"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData4")
                                          .shaft_seal_brand
                                          ? getFormData("formData4")
                                              .shaft_seal_brand
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="shaft_seal_model"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Model
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Model"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData4")
                                          .shaft_seal_model
                                          ? getFormData("formData4")
                                              .shaft_seal_model
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="shaft_seal_material"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Material
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Material"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData4")
                                          .shaft_seal_material
                                          ? getFormData("formData4")
                                              .shaft_seal_material
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="mech_size_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Size
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for density */}
                                    <FormField
                                      control={formMechanicalSealDetail.control}
                                      name="mech_size"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Size"
                                            {...Field}
                                            readOnly
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_size",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          formMechanicalSealDetail.getValues(
                                            "mech_size_unit",
                                          )
                                            ? formMechanicalSealDetail.getValues(
                                                "mech_size_unit",
                                              )
                                            : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44">
                                    Seal Chamber
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Seal Chamber"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData4").seal_cham
                                          ? getFormData("formData4").seal_cham
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="mechanical_seal_api_plan"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    API Plan
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="API Plan"
                                      {...field}
                                      readOnly
                                      defaultValue={
                                        getFormData("formData4")
                                          .mechanical_seal_api_plan
                                          ? getFormData("formData4")
                                              .mechanical_seal_api_plan
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formMechanicalSealDetail.control}
                            name="mech_main_pre_unit"
                            render={({ field: Field }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Main Pressure
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_speed */}
                                    <FormField
                                      control={formMechanicalSealDetail.control}
                                      name="mech_main_pre"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Main Pressure"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData4")
                                                .mech_main_pre
                                                ? getFormData("formData4")
                                                    .mech_main_pre
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_pressure",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData4")
                                            .mech_main_pre_unit
                                            ? getFormData("formData4")
                                                .mech_main_pre_unit
                                            : formMechanicalSealDetail.getValues(
                                                  "mech_main_pre_unit",
                                                )
                                              ? formMechanicalSealDetail.getValues(
                                                  "mech_main_pre_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          Field.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Mechanical Seal Temperature (°C)
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Mechanical Seal Temperature (°C)"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData4").mech_main_temp
                                          ? getFormData("formData4")
                                              .mech_main_temp
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
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
                        onClick={() => handlePreviousStep("4", "3")}
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        className="w-32 gap-2"
                        onClick={() => {
                          console.log(formMechanicalSealDetail.getValues());
                          handleNextStep("4", "5", formMechanicalSealDetail);
                        }}
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
              value="5"
              className="container flex-auto space-x-2 space-y-3 py-3"
            >
              <h2 className="w-full text-2xl font-bold flex items-center justify-center">
                Flange and Bearing Details
              </h2>
              <Form {...formFlangeAndBearingDetail}>
                <form>
                  <div className="flex flex-col">
                    {/* Suction Flange Detail */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Suction Flange Details">
                        <div className="space-y-2">
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="flang_con_std"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Flange Connection Standard
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pump_flang_con_std",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5").flang_con_std
                                          ? getFormData("formData5")
                                              .flang_con_std
                                          : formFlangeAndBearingDetail.getValues(
                                                "flang_con_std",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "flang_con_std",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Suction rating
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pump_flange_rating",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .pump_suction_rating
                                          ? getFormData("formData5")
                                              .pump_suction_rating
                                          : formFlangeAndBearingDetail.getValues(
                                                "pump_suction_rating",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "pump_suction_rating",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="pump_suction_size"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Suction size
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pump_flange_size",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .pump_suction_size
                                          ? getFormData("formData5")
                                              .pump_suction_size
                                          : formFlangeAndBearingDetail.getValues(
                                                "pump_suction_size",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "pump_suction_size",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Suction Pipe SCH.
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pump_flange_pipe_sch",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .suction_pipe_sch
                                          ? getFormData("formData5")
                                              .suction_pipe_sch
                                          : formFlangeAndBearingDetail.getValues(
                                                "suction_pipe_sch",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "suction_pipe_sch",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Suction Pipe Size
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pipe_size",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
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
                                    Suction Pipe ID.
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="suction_pipe_id"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Suction Pipe ID."
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .suction_pipe_id
                                                ? getFormData("formData5")
                                                    .suction_pipe_id
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_size",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .suction_pipe_id_unit
                                            ? getFormData("formData5")
                                                .suction_pipe_id_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "suction_pipe_id_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "suction_pipe_id_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="suction_pipe_length_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Pipe Length
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="suction_pipe_length"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Suction Pipe Length"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .suction_pipe_length
                                                ? getFormData("formData5")
                                                    .suction_pipe_length
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_size",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .suction_pipe_length_unit
                                            ? getFormData("formData5")
                                                .suction_pipe_length_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "suction_pipe_length_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "suction_pipe_length_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Suction Elbow Pipe"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Suction Tee Pipe"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Suction Reducer Pipe"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Suction Valve"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Suction Y Strainer"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Other Component"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Suction Equivalent length"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="suction_head_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Head
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="suction_head"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Suction Head"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .suction_head
                                                ? getFormData("formData5")
                                                    .suction_head
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_head",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .suction_head_unit
                                            ? getFormData("formData5")
                                                .suction_head_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "suction_head_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "suction_head_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="suction_velo_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Suction Velocity
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="suction_velo"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Suction Velocity"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .suction_velo
                                                ? getFormData("formData5")
                                                    .suction_velo
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_velocity",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .suction_velo_unit
                                            ? getFormData("formData5")
                                                .suction_velo_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "suction_velo_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "suction_velo_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    {/* Discharge Flange Detail */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Suction Flange Details">
                        <div className="space-y-2">
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="pump_discharge_rating"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Discharge rating
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pump_flange_rating",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .pump_discharge_rating
                                          ? getFormData("formData5")
                                              .pump_discharge_rating
                                          : formFlangeAndBearingDetail.getValues(
                                                "pump_discharge_rating",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "pump_discharge_rating",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="pump_discharge_size"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Discharge size
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pump_flange_size",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .pump_discharge_size
                                          ? getFormData("formData5")
                                              .pump_discharge_size
                                          : formFlangeAndBearingDetail.getValues(
                                                "pump_discharge_size",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "pump_discharge_size",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Discharge Pipe SCH.
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "pump_flange_pipe_sch",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .discharge_pipe_sch
                                          ? getFormData("formData5")
                                              .discharge_pipe_sch
                                          : formFlangeAndBearingDetail.getValues(
                                                "discharge_pipe_sch",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "discharge_pipe_sch",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>

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
                                    Discharge Pipe ID.
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="discharge_pipe_id"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Discharge Pipe ID."
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .discharge_pipe_id
                                                ? getFormData("formData5")
                                                    .discharge_pipe_id
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_size",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .discharge_pipe_id_unit
                                            ? getFormData("formData5")
                                                .discharge_pipe_id_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "discharge_pipe_id_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "discharge_pipe_id_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe_length_h_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Horizontal Discharge Pipe Length
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="discharge_pipe_length_h"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Horizontal Discharge Pipe Length"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .discharge_pipe_length_h
                                                ? getFormData("formData5")
                                                    .discharge_pipe_length_h
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_size",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .discharge_pipe_length_h_unit
                                            ? getFormData("formData5")
                                                .discharge_pipe_length_h_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "discharge_pipe_length_h_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "discharge_pipe_length_h_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_pipe_length_v_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Vertical Discharge Pipe Length
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="discharge_pipe_length_v"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Vertical Discharge Pipe Length"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .discharge_pipe_length_v
                                                ? getFormData("formData5")
                                                    .discharge_pipe_length_v
                                                : ""
                                            }
                                          />
                                        </FormControl>
                                      )}
                                    />
                                    <FormControl className="md:max-w-[500px]">
                                      <Combobox
                                        className="min-w-[86px]"
                                        items={
                                          handleLOVDataFilter(
                                            "unit_size",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .discharge_pipe_length_h_unit
                                            ? getFormData("formData5")
                                                .discharge_pipe_length_h_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "discharge_pipe_length_v_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "discharge_pipe_length_v_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Brand"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Discharge Tee Pipe"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Discharge Reducer Pipe"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>
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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Discharge Valve"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                    Discharge Y Strainer
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Discharge Y Strainer"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Other Component"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Discharge Equivalent length"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="discharge_velo_unit"
                            render={({ field: suctionSizeField }) => (
                              <FormItem>
                                <div className="w-full flex items-center">
                                  <FormLabel className="w-32 lg:w-44">
                                    Discharge Velocity
                                  </FormLabel>
                                  <div className="w-full flex gap-2">
                                    {/* Input for pump_suction_size */}
                                    <FormField
                                      control={
                                        formFlangeAndBearingDetail.control
                                      }
                                      name="discharge_velo"
                                      render={({ field: Field }) => (
                                        <FormControl className="w-full">
                                          <Input
                                            placeholder="Discharge Velocity"
                                            {...Field}
                                            defaultValue={
                                              getFormData("formData5")
                                                .discharge_velo
                                                ? getFormData("formData5")
                                                    .discharge_velo
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
                                        items={
                                          handleLOVDataFilter(
                                            "unit_velocity",
                                            "pump_unit",
                                          ) || []
                                        } // Dropdown options
                                        label={
                                          getFormData("formData5")
                                            .discharge_velo_unit
                                            ? getFormData("formData5")
                                                .discharge_velo_unit
                                            : formFlangeAndBearingDetail.getValues(
                                                  "discharge_velo_unit",
                                                )
                                              ? formFlangeAndBearingDetail.getValues(
                                                  "discharge_velo_unit",
                                                )
                                              : "Select"
                                        }
                                        onChange={(value) => {
                                          suctionSizeField.onChange(value); // Update form state
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    {/* Bearing Set1 */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Bearing Set 1">
                        <div className="space-y-2">
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_nde_one"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Bearing NDE
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Bearing NDE"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData5").bearing_nde_one
                                          ? getFormData("formData5")
                                              .bearing_nde_one
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_de_one"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Bearing DE
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Bearing DE"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData5").bearing_de_one
                                          ? getFormData("formData5")
                                              .bearing_de_one
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormBox>
                    </div>
                    {/* Bearing Set2 */}
                    <div className="text-foreground dark:text-foreground grow flex-1">
                      <FormBox field="Bearing Set 2 (Optional)">
                        <div className="space-y-2">
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_nde_two"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Bearing NDE
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Bearing NDE"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData5").bearing_nde_two
                                          ? getFormData("formData5")
                                              .bearing_nde_two
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="bearing_de_two"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Bearing DE
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Bearing DE"
                                      {...field}
                                      defaultValue={
                                        getFormData("formData5").bearing_de_two
                                          ? getFormData("formData5")
                                              .bearing_de_two
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>

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
                            name="bearing_last_chg_dt"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center ">
                                  <FormLabel className="w-32 lg:w-44">
                                    Bearing Last Change Date
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Input
                                      placeholder="Bearing Last Change Date"
                                      {...field}
                                      type="date"
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Bearing Lubrication Type
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "lubric_type",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .bearing_lubric_type
                                          ? getFormData("formData5")
                                              .bearing_lubric_type
                                          : formFlangeAndBearingDetail.getValues(
                                                "bearing_lubric_type",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "bearing_lubric_type",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Bearing Lubrication Brand
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "lubric_brand",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .bearing_lubric_brand
                                          ? getFormData("formData5")
                                              .bearing_lubric_brand
                                          : formFlangeAndBearingDetail.getValues(
                                                "bearing_lubric_brand",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "bearing_lubric_brand",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>

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
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Bearing Lubrication No.
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "lubric_no",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5")
                                          .bearing_lubric_no
                                          ? getFormData("formData5")
                                              .bearing_lubric_no
                                          : formFlangeAndBearingDetail.getValues(
                                                "bearing_lubric_no",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "bearing_lubric_no",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="oil_seal"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Bearing Oil Seal
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "oil_seal",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5").oil_seal
                                          ? getFormData("formData5").oil_seal
                                          : formFlangeAndBearingDetail.getValues(
                                                "oil_seal",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "oil_seal",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formFlangeAndBearingDetail.control}
                            name="rotation_de"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center">
                                  <FormLabel className="w-32 lg:w-44 ">
                                    Rotation
                                  </FormLabel>
                                  <FormControl className="w-full">
                                    <Combobox
                                      className="min-w-[86px]"
                                      items={
                                        handleLOVDataFilter(
                                          "rotation_de",
                                          "pump_data",
                                        ) || []
                                      } // Dropdown options
                                      label={
                                        getFormData("formData5").rotation_de
                                          ? getFormData("formData5").rotation_de
                                          : formFlangeAndBearingDetail.getValues(
                                                "rotation_de",
                                              )
                                            ? formFlangeAndBearingDetail.getValues(
                                                "rotation_de",
                                              )
                                            : "Select"
                                      }
                                      onChange={(value) => {
                                        field.onChange(value); // Update form state
                                      }}
                                    />
                                  </FormControl>
                                </div>
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
                        onClick={() => handlePreviousStep("5", "4")}
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        className="w-32 gap-2"
                        onClick={(e) => {
                          console.log(formFlangeAndBearingDetail.getValues());
                          e.preventDefault();
                          /* handleDataSubmit(); */
                        }}
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Submit</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
  );
}
