import { createFileRoute } from "@tanstack/react-router";

import { set, string, z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@tanstack/react-router";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { CompanyOutSchema, ContactOutSchema } from "@/validators/user";
import { useSettings } from "@/lib/settings";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Car, CircleX, Key, PlusCircle, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  useGetPECCompanyDetail,
  useGetPECContactDetail,
  useCreateCompany,
  useUpdateCompany,
  useGetCompanyDetailByCode,
} from "@/hook/users/company";
import { useGetAllProvince } from "@/hook/dropdown";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  CompaniesResponse,
  ContactPersonResponse,
} from "@/types/users/company";

function CompanyEdit() {
  const [pecCompanyData, setPecCompanyData] =
    useState<CompaniesResponse | null>(null);
  const [pecContactData, setPecContactData] =
    useState<ContactPersonResponse | null>(null);
  const [companyCode, setCompanyCode] = useState<string | null>(null);
  const [isCLearClick, setClearClick] = useState<boolean>(false);
  const [provinceData, setProvinceData] = useState<ComboboxItemProps[]>([]);
  const { code } = useSearch({ from: "/_auth/users/company_edit" });
  const { data: provinceNames } = useGetAllProvince();
  const { data: contactData } = useGetPECContactDetail(
    companyCode || code || ""
  );
  const { data: companyData } = useGetPECCompanyDetail(companyCode || "");
  const { data: companyDetail } = useGetCompanyDetailByCode(code || "");
  const { showDescriptions } = useSettings();
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage ? JSON.parse(localstorage) : null;
  const geographic: { [key: string]: { th: string; en: string } } = {
    "1": { th: "ภาคเหนือ", en: "Northern" },
    "2": { th: "ภาคกลาง", en: "Central" },
    "3": { th: "ภาคตะวันออกเฉียงเหนือ", en: "Northeastern" },
    "4": { th: "ภาคตะวันตก", en: "Western" },
    "5": { th: "ภาคตะวันออก", en: "Eastern" },
    "6": { th: "ภาคใต้", en: "Southern" },
  };
  // Company form setup
  const CompanyForm = useForm<z.infer<typeof CompanyOutSchema>>({
    resolver: zodResolver(CompanyOutSchema),
    defaultValues: {
      customer_code: "",
      company_name_en: "",
      company_name_th: "",
      address_en: "",
      address_th: "",
      province: "",
      sales_area: "",
    },
  });

  const ContactForm = useForm<z.infer<typeof ContactOutSchema>>({
    resolver: zodResolver(ContactOutSchema),
  });

  useEffect(() => {
    if (pecCompanyData && !isCLearClick) {
      CompanyForm.reset({
        customer_code: pecCompanyData?.customer_code,
        company_name_en: pecCompanyData?.company_name_en,
        company_name_th: pecCompanyData?.company_name_th,
        address_en: pecCompanyData?.address_en,
        address_th: pecCompanyData?.address_th,
      });
    } else if (pecCompanyData && isCLearClick) {
      CompanyForm.reset({
        customer_code: "",
        company_name_en: "",
        company_name_th: "",
        address_en: "",
        address_th: "",
        province: "",
        sales_area: "",
      });
      setCompanyCode(null);
      setPecCompanyData(null);
      setPecContactData(null);
    }
  }, [pecCompanyData, CompanyForm, isCLearClick]);

  useEffect(() => {
    if (code) {
      CompanyForm.reset({
        customer_code: companyDetail?.customer_code,
        company_name_en: companyDetail?.company_name_en,
        company_name_th: companyDetail?.company_name_th,
        address_en: companyDetail?.address_en,
        address_th: companyDetail?.address_th,
        province: companyDetail?.province,
        sales_area: companyDetail?.sales_area,
      });
    }
  }, [code, companyDetail]);

  useEffect(() => {
    if (provinceNames) {
      const provinceList: ComboboxItemProps[] = provinceNames.map((arr) => ({
        value: `${arr.name_th} - ${arr.name_en}`,
        label: `${arr.name_th} - ${arr.name_en}`,
      }));
      setProvinceData(provinceList);
    }
  }, [provinceNames]);

  //Get data for update when URL has id for update data

  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  const handleSubmit = (values: z.infer<typeof CompanyOutSchema>) => {
    const date = new Date().toISOString();
    const formData = {
      ...values,
      customer_industry_id: "",
      customer_industry_group: "",
      map: "",
      created_by: pecCompanyData?.created_by || userData.email,
      created_at: pecCompanyData?.created_at || date,
      updated_by: userData.email,
      updated_at: date,
    };

    if (!code) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ code: code, data: formData });
    }
  };
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {code ? "Company Detail" : "Adding Company"}
        </h2>
        <Link to="/users/company_list">Back</Link>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...CompanyForm}>
            <form
              onSubmit={CompanyForm.handleSubmit(handleSubmit, (errors) => {
                console.log("Validation Errors:", errors);
                toast.error("Validation Errors");
              })}
            >
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Company Information">
                  <div className="space-y-4 sm:space-y-2">
                    <FormField
                      control={CompanyForm.control}
                      name="customer_code"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">Code</FormLabel>
                            <div className="w-full flex gap-2">
                              <FormControl>
                                <Input
                                  placeholder="Company Code"
                                  {...field}
                                  readOnly
                                />
                              </FormControl>
                              {!code && (
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button
                                      type="button"
                                      className="w-32 gap-1"
                                    >
                                      <Search className="h-3.5 w-3.5" />
                                      Company
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle>Find Company</SheetTitle>
                                      <SheetDescription>
                                        Please enter the company code
                                      </SheetDescription>
                                    </SheetHeader>
                                    <div className="gap-4 pt-8">
                                      <div className="flex flex-col items-start gap-4">
                                        <Label
                                          htmlFor="name"
                                          className="text-right"
                                        >
                                          Name
                                        </Label>
                                        <Input
                                          id="input_code"
                                          className="col-span-3"
                                        />
                                      </div>
                                      {companyData?.customer_code && (
                                        <div className="gap-4 pt-8">
                                          <SheetHeader>
                                            <SheetDescription className="text-center">
                                              ** Please check the information
                                              below **
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
                                              id="name"
                                              value={companyData.address_en}
                                              className="col-span-3"
                                              readOnly
                                            />
                                            <Input
                                              id="name"
                                              value={companyData.address_th}
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
                                                setPecCompanyData(companyData);
                                                setPecContactData(contactData);
                                                setClearClick(false);
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
                                          const input = document.getElementById(
                                            "input_code"
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
                              )}
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
                      control={CompanyForm.control}
                      name="company_name_en"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:sm:w-2/12">
                              {"Name (Eng)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company Name (Eng)"
                                {...field}
                                className="h-7"
                                readOnly
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
                      control={CompanyForm.control}
                      name="company_name_th"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              {"Name (TH)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company Name (TH)"
                                {...field}
                                className="h-7"
                                readOnly
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
                      control={CompanyForm.control}
                      name="address_en"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              {"Address (Eng)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company Address (Eng)"
                                {...field}
                                className="h-7"
                                readOnly
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
                      control={CompanyForm.control}
                      name="address_th"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              {"Address (TH)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company Address (TH)"
                                {...field}
                                className="h-7"
                                readOnly
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
                      control={CompanyForm.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              {"Province"}
                            </FormLabel>
                            <FormControl>
                              {code ? (
                                <Input
                                  placeholder="Company Address (TH)"
                                  {...field}
                                  className="h-7"
                                  readOnly
                                />
                              ) : (
                                <Combobox
                                  {...field}
                                  className="w-full"
                                  items={provinceData}
                                  label={"Select"}
                                  onChange={(value) => {
                                    CompanyForm.setValue(
                                      "province",
                                      String(value)
                                    );
                                    field.onChange(value);
                                    const selectedProvince =
                                      provinceNames?.find(
                                        (item) =>
                                          item.name_th ===
                                          (value as string).split("-")[0].trim()
                                      );
                                    if (selectedProvince) {
                                      const geo_id = `${selectedProvince.geography_id}`;
                                      CompanyForm.setValue(
                                        "sales_area",
                                        `${geographic[geo_id].th} - ${geographic[geo_id].en}`
                                      );
                                    } else {
                                      CompanyForm.setValue(
                                        "sales_area",
                                        "not found"
                                      );
                                    }
                                  }}
                                />
                              )}
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
                      control={CompanyForm.control}
                      name="sales_area"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              {"Sales Area"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Sales Area"
                                {...field}
                                className="h-7"
                                readOnly
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
                  {!code && (
                    <CardFooter className="p-0 flex justify-between">
                      <Button
                        size="sm"
                        className="sm:w-32 gap-1 "
                        type="submit"
                      >
                        <PlusCircle className="h-5 w-3.5" />
                        <span className="sm:whitespace-nowrap">
                          Add Company
                        </span>
                      </Button>
                      <Button
                        type="button"
                        size={"sm"}
                        variant={"destructive"}
                        onClick={() => setClearClick(true)}
                        className="flex gap-1 "
                      >
                        <CircleX className="h-5 w-3.5" />
                        Clear
                      </Button>
                    </CardFooter>
                  )}
                </FormBox>
              </div>
            </form>
          </Form>
          <Form {...ContactForm}>
            <form>
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="Contact Person Information">
                  <div className="space-y-4 sm:space-y-2">
                    {Array.isArray(pecContactData) &&
                    pecContactData.length > 0 ? (
                      pecContactData.map((contact, index) => (
                        <Accordion type="single" collapsible key={index}>
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="w-full flex justify-between items-center py-2 border-y-[1px]">
                              {contact?.name_surname_en || "( No name detail )"}
                            </AccordionTrigger>
                            <AccordionContent className="py-4 flex flex-col gap-4 border-b-[1px]">
                              <FormField
                                control={ContactForm.control}
                                name="name_surname_en"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                      <FormLabel className="sm:sm:w-2/12">
                                        {"Name (Eng)"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Contact Person Name (Eng)"
                                          {...field}
                                          className="h-7"
                                          value={contact.name_surname_en}
                                          readOnly
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
                                control={ContactForm.control}
                                name="name_surname_th"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                      <FormLabel className="sm:w-2/12">
                                        {"Name (TH)"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Contact Person Name (TH)"
                                          {...field}
                                          className="h-7"
                                          value={contact.name_surname_th}
                                          readOnly
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
                                control={ContactForm.control}
                                name="position_en"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                      <FormLabel className="sm:w-2/12">
                                        {"Position (Eng)"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Position (Eng)"
                                          {...field}
                                          className="h-7"
                                          value={pecContactData?.position_en}
                                          readOnly
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
                                control={ContactForm.control}
                                name="position_th"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                      <FormLabel className="sm:w-2/12">
                                        {"Position (TH)"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Position (TH)"
                                          {...field}
                                          className="h-7"
                                          value={contact.position_th}
                                          readOnly
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
                                control={ContactForm.control}
                                name="tel"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                      <FormLabel className="sm:w-2/12">
                                        {"Telephone"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Telephone"
                                          {...field}
                                          className="h-7"
                                          value={contact.tel}
                                          readOnly
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
                                control={ContactForm.control}
                                name="mobile"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                      <FormLabel className="sm:w-2/12">
                                        {"Mobile"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Mobile"
                                          {...field}
                                          className="h-7"
                                          value={contact.mobile}
                                          readOnly
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
                                control={ContactForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                      <FormLabel className="sm:w-2/12">
                                        {"Email"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Email"
                                          {...field}
                                          className="h-7"
                                          value={contact.email}
                                          readOnly
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
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))
                    ) : !code ? (
                      <p>Please Select Company</p>
                    ) : (
                      <p>Contact person not found</p>
                    )}
                  </div>
                </FormBox>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/users/company_edit")({
  component: CompanyEdit,
  validateSearch: (search: { code: string }) => {
    return { code: search.code || null };
  },
});
