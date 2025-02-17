import { createFileRoute } from "@tanstack/react-router";
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
import { UserOutSchema } from "@/validators/user";
import { PECPersonResponse } from "@/types/users/users";
import { useSettings } from "@/lib/settings";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Car, CircleX, Key, PlusCircle, Search } from "lucide-react";
import { useEffect } from "react";
import { useGetPECPersonByCode } from "@/hook/users/users";
import { useGetCompanyDetailByCode } from "@/hook/users/company";
import { useState } from "react";
import { toast } from "react-hot-toast";

function CreateUser() {
  const [SelectedPECCode, setSelectedPECCode] = useState<string>("");
  const [SelectedCompanyCode, setSelectedCompanyCode] = useState<string>("");
  const [PECPersonCode, setPECPersonCode] = useState<string>("");
  const [CompanyCode, setCompanyCode] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const { data: companyData } = useGetCompanyDetailByCode(CompanyCode);
  const { data: PECPersonDetail } = useGetPECPersonByCode(PECPersonCode);
  const { showDescriptions } = useSettings();
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage ? JSON.parse(localstorage) : null;
  const date = new Date().toISOString();
  console.log(typeof userData.email, userData.email)
  const roleData = [
    {
      value: "Developer",
      label: "Developer",
    },
    {
      value: "Engineer",
      label: "Engineer",
    },
    {
      value: "Customer",
      label: "Customer",
    },
  ];
  const defaultValues = {
    user_email: "",
    user_username: "",
    user_password: "",
    user_password_re: "",
    user_name: "",
    user_company_code: "",
    user_role: "",
    show_name_th: "",
    show_name_en: "",
    show_department: "",
    show_position: "",
    show_mobile: "",
    show_tel: "",
    show_company_name_en: "",
    show_company_name_th: "",
    show_address_en: "",
    show_address_th: "",
    show_province: "",
    show_sales_area: "",
    created_by: userData.email,
    created_at: date,
    updated_by: userData.email,
    updated_at: date,
  };
  const USERCreateForm = useForm<z.infer<typeof UserOutSchema>>({
    resolver: zodResolver(UserOutSchema),
    defaultValues,
  });

  //Get data for update when URL has id for update data

  /* const createMutation = useCreateCompany(); */
  useEffect(() => {
    if (companyData?.customer_code && isAdd) {
      const currentValues = USERCreateForm.getValues();
      USERCreateForm.reset({
        ...currentValues,
        user_company_code: companyData.customer_code,
        show_company_name_th: companyData.company_name_en,
        show_company_name_en: companyData.company_name_th,
        show_address_th: companyData.address_th,
        show_address_en: companyData.address_en,
        show_province: companyData.province,
        show_sales_area: companyData.sales_area,
      });
    }
  }, [companyData, isAdd]);

  useEffect(() => {
    if (selectedRole !== "Developer" && selectedRole !== "Engineer") {
      USERCreateForm.reset(defaultValues);
      setCompanyCode("");
      setPECPersonCode("");
      setSelectedPECCode("");
      setIsAdd(false);
    }
  }, [selectedRole, USERCreateForm]);

  const handleSubmit = (values: z.infer<typeof UserOutSchema>) => {
    console.log(values);
    /* const date = new Date().toISOString();
    const formData = {
      ...values,
      user_email: "",
      user_username: "",
      user_password: "",
      user_name: "",
      user_company_code: "",
      user_role: "",
      created_by: userData.email,
      created_at: date,
      updated_by: userData.email,
      updated_at: date,
    }; */

    /* if (!code) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ code: code, data: formData });
    } */
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Create</h2>
      </div>

      <Card className="w-full mt-5">
        <CardContent>
          <Form {...USERCreateForm}>
            <form
              onSubmit={USERCreateForm.handleSubmit(handleSubmit, (errors) => {
                console.log("Validation Errors:", errors);
                toast.error("Validation Errors");
              })}
            >
              <div className="text-foreground dark:text-foreground grow flex-1">
                <FormBox field="User Information">
                  <div className="space-y-4 sm:space-y-2">
                    <FormField
                      control={USERCreateForm.control}
                      name="user_role"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">Role</FormLabel>
                            <FormControl>
                              <Combobox
                                items={roleData} // Dropdown options
                                label="Select"
                                onChange={(value) => {
                                  field.onChange(value); // Update form state
                                  setSelectedRole(
                                    USERCreateForm.getValues("user_role")
                                  );
                                }}
                                className="w-full"
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
                    {selectedRole !== "Customer" && selectedRole && (
                      <>
                        <FormField
                          control={USERCreateForm.control}
                          name="user_name"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="sm:w-2/12">
                                  PEC Code
                                </FormLabel>
                                <div className="w-full flex gap-2">
                                  <FormControl>
                                    <Input
                                      placeholder={"PEC Code"}
                                      {...field}
                                      className="h-8"
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
                                        <SheetTitle>PEC Member</SheetTitle>
                                        <SheetDescription>
                                          Please search you code
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
                                            id="input_PEC_code"
                                            className="col-span-3"
                                            onChange={(e) =>
                                              setSelectedPECCode(e.target.value)
                                            }
                                          />
                                        </div>
                                        {PECPersonDetail &&
                                          PECPersonDetail[0].pec_code && (
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
                                                  id="name"
                                                  value={
                                                    PECPersonDetail[0]
                                                      .name_surname_en
                                                  }
                                                  className="col-span-3 text-wrap h-4rem"
                                                  readOnly
                                                />
                                                <Input
                                                  id="name"
                                                  value={
                                                    PECPersonDetail[0]
                                                      .name_surname_th
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="position"
                                                  className="text-right pt-2"
                                                >
                                                  Position
                                                </Label>
                                                <Input
                                                  id="email"
                                                  value={
                                                    PECPersonDetail[0].position
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="department"
                                                  className="text-right pt-2"
                                                >
                                                  Department
                                                </Label>
                                                <Input
                                                  id="email"
                                                  value={
                                                    PECPersonDetail[0]
                                                      .department
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                                <Label
                                                  htmlFor="email"
                                                  className="text-right pt-2"
                                                >
                                                  Email
                                                </Label>
                                                <Input
                                                  id="email"
                                                  value={
                                                    PECPersonDetail[0].email
                                                  }
                                                  className="col-span-3"
                                                  readOnly
                                                />
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                      <SheetFooter className="pt-8">
                                        {PECPersonDetail &&
                                          PECPersonDetail[0].pec_code && (
                                            <SheetClose asChild>
                                              <Button
                                                className="bg-green-500 hover:bg-green-600 w-full"
                                                type="button"
                                                onClick={() => {
                                                  const currentValues =
                                                    USERCreateForm.getValues();
                                                  USERCreateForm.reset({
                                                    ...currentValues,
                                                    user_name:
                                                      PECPersonDetail[0]
                                                        .pec_code,
                                                    user_email:
                                                      PECPersonDetail[0].email,
                                                    show_name_th:
                                                      PECPersonDetail[0]
                                                        .name_surname_th,
                                                    show_name_en:
                                                      PECPersonDetail[0]
                                                        .name_surname_en,
                                                    show_department:
                                                      PECPersonDetail[0]
                                                        .name_surname_en,
                                                    show_position:
                                                      PECPersonDetail[0]
                                                        .position,
                                                    show_mobile:
                                                      PECPersonDetail[0].mobile,
                                                    show_tel:
                                                      PECPersonDetail[0].tel,
                                                  });
                                                  setCompanyCode("PEC");
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
                                            setPECPersonCode(SelectedPECCode);
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
                          control={USERCreateForm.control}
                          name="show_name_th"
                          render={({ field: name }) => (
                            <FormItem>
                              <div className="w-full flex items-start">
                                <FormLabel className="sm:w-2/12">
                                  Name
                                </FormLabel>
                                <div className="w-full flex flex-col gap-2">
                                  <FormField
                                    control={USERCreateForm.control}
                                    name="show_name_en"
                                    render={({ field: name }) => (
                                      <FormControl>
                                        <Input
                                          placeholder="Name (Eng)"
                                          {...name}
                                          readOnly
                                        />
                                      </FormControl>
                                    )}
                                  />
                                  {/* Combobox for pump_speed_unit */}
                                  <FormControl>
                                    <Input
                                      placeholder="Name (TH)"
                                      {...name}
                                      readOnly
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
                          control={USERCreateForm.control}
                          name="show_department"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="sm:w-2/12">
                                  Department
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Department"
                                    {...field}
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
                          control={USERCreateForm.control}
                          name="show_position"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="sm:w-2/12">
                                  Position
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Position"
                                    {...field}
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
                          control={USERCreateForm.control}
                          name="show_mobile"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="sm:w-2/12">
                                  Mobile
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Mobile"
                                    {...field}
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
                          control={USERCreateForm.control}
                          name="show_tel"
                          render={({ field }) => (
                            <FormItem>
                              <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                                <FormLabel className="sm:w-2/12">
                                  Tel.
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Telephone"
                                    {...field}
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
                      </>
                    )}
                    <FormField
                      control={USERCreateForm.control}
                      name="user_username"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              Username
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Username" {...field} />
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
                      control={USERCreateForm.control}
                      name="user_email"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
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
                      control={USERCreateForm.control}
                      name="user_password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
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
                      control={USERCreateForm.control}
                      name="user_password_re"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm Password"
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
                    {selectedRole === "Customer" && (
                      <FormField
                        control={USERCreateForm.control}
                        name="user_name"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="sm:w-2/12">
                                Display Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Customer Display Name"
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
                    )}
                  </div>
                </FormBox>
                <FormBox field="Company detail">
                  <div className="space-y-4 sm:space-y-2">
                    {selectedRole === "Customer" && selectedRole ? (
                      <FormField
                        control={USERCreateForm.control}
                        name="user_company_code"
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
                                          setCompanyCode(SelectedCompanyCode);
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
                    ) : (
                      <FormField
                        control={USERCreateForm.control}
                        name="user_company_code"
                        render={({ field }) => (
                          <FormItem>
                            <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                              <FormLabel className="sm:sm:w-2/12">
                                Company Code
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Company Code"
                                  {...field}
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
                    )}

                    <FormField
                      control={USERCreateForm.control}
                      name="show_company_name_en"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:sm:w-2/12">
                              {"Company Name (Eng)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company Name (Eng)"
                                {...field}
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
                      control={USERCreateForm.control}
                      name="show_company_name_th"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              {"Company Name (TH)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company Name (TH)"
                                {...field}
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
                      control={USERCreateForm.control}
                      name="show_address_en"
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
                      control={USERCreateForm.control}
                      name="show_address_th"
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
                      control={USERCreateForm.control}
                      name="show_province"
                      render={({ field }) => (
                        <FormItem>
                          <div className="w-full flex sm:flex-row flex-col gap-4 sm:gap-0 sm:items-center">
                            <FormLabel className="sm:w-2/12">
                              {"Province"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Company Address (TH)"
                                {...field}
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
                      control={USERCreateForm.control}
                      name="show_sales_area"
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
                </FormBox>
              </div>
              <CardFooter className="px-4 flex justify-end">
                <Button type="submit">Create</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/users/create_user")({
  component: CreateUser,
});
