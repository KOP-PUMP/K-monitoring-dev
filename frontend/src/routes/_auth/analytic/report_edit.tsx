import { createFileRoute } from "@tanstack/react-router";
import { useGetPumpDetail } from "@/hook/pump/pump";
import { useCreateEngineerReport } from "@/hook/engineer/engineer";
import { EngineerReportSchema } from "@/validators/engineer";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FormBox } from "@/components/common/FormBox";
import { PumpDetailResponse } from "@/types";
import { PlusCircle, Search, ChevronsUpDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";

function ReportEdit() {
  const { data: pumpDetail } = useGetPumpDetail(null);
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const createMutation = useCreateEngineerReport();
  const engineerReportForm = useForm<z.infer<typeof EngineerReportSchema>>({
    resolver: zodResolver(EngineerReportSchema),
  });
  const [filteredPump, setFilteredPump] = useState("");
  const [selectedPump, setSelectedPump] = useState<PumpDetailResponse>();
  const [searchKey, setSearchKey] = useState({
    pump_code_name: "",
  });
  const handleDataSubmit = () => {
    const addData = {
      pump_detail: selectedPump?.pump_id,
      user_detail: userData.user.user_email,
      updated_at: new Date().toISOString(),
      updated_by: userData?.user.user_email,
      created_at: new Date().toISOString(),
      created_by: userData?.user.user_email,
    };
    console.log(addData);
    createMutation.mutate(addData);
  };

  const engineerReportCurrentValue = engineerReportForm.getValues();

  const handleResetPumpDetail = (data: PumpDetailLOVResponse) => {
    engineerReportForm.reset({
      ...engineerReportCurrentValue,
      pump_lov_id: data.pump_lov_id,
      brand: data.pump_brand,
      pump_code_name: `${data.pump_brand} ${data.pump_model}`,
      model_short: data.pump_model?.split(" ")[0],
      model: data.pump_model,
      pump_model_size: data.model_size,
      pump_design: data.pump_design,
      pump_type_name: data.pump_type,
      stage: data.pump_stage,
      impeller_type: data.pump_impeller_type,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Report</h2>
        <Link to="/analytic/report">Back</Link>
      </div>
      <Card className="w-full mt-5">
        <CardContent>
          <Form {...engineerReportForm}>
            <form
              onSubmit={engineerReportForm.handleSubmit(
                handleDataSubmit,
                (errors) => {
                  console.log("Validation Errors:", [
                    errors,
                    engineerReportForm.getValues(),
                  ]);
                  toast.error("Validation Errors");
                }
              )}
            >
              <div className="flex flex-col">
                {/* Report data */}
                <div className="text-foreground dark:text-foreground grow flex-1">
                  <FormBox field="Pump General Detail">
                    <div className="space-y-2">
                      <FormField
                        control={engineerReportForm.control}
                        name="pump_detail"
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
                                    className="w-[400px] sm:w-[540px] h-full"
                                    style={{ zIndex: 1000 }}
                                  >
                                    <SheetHeader>
                                      <SheetTitle>Select Pump</SheetTitle>
                                      <SheetDescription>
                                        Choose a pump from the list below
                                      </SheetDescription>
                                    </SheetHeader>
                                    <div className="py-6 h-full ">
                                      <Input
                                        placeholder="Search model..."
                                        className="mb-6"
                                        value={searchKey.pump_code_name}
                                        onChange={(e) => {
                                          const searchValue =
                                            e.target.value.toLowerCase(); // Ensure case insensitivity
                                          const filterData = pumpDetail?.filter(
                                            (data) =>
                                              data.pump_code_name
                                                ?.toLowerCase()
                                                .includes(searchValue)
                                          );
                                          setSearchKey({
                                            ...searchKey,
                                            pump_code_name: e.target.value,
                                          });

                                          setFilteredPump(filterData);
                                        }}
                                      />
                                      <div className="space-y- overflow-y-auto">
                                        {searchKey.pump_code_name === "" ? (
                                          pumpDetail?.map((data) => (
                                            <SheetClose
                                              key={data.pump_id}
                                              className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                              onClick={() => {
                                                console.log(data)
                                                engineerReportForm.reset({
                                                  ...engineerReportCurrentValue,
                                                  pump_detail: data.pump_id,
                                                });
                                                setSelectedPump(data);
                                              }}
                                            >
                                              <div className="font-medium">
                                                {data.pump_code_name}
                                              </div>
                                              <div className="text-sm text-muted-foreground flex flex-col items-start">
                                                <p>
                                                  Company Code :{" "}
                                                  {data.company_code}
                                                </p>
                                                <p>
                                                  Location : {data.location}
                                                </p>
                                                <p>
                                                  Design : {data.pump_design}
                                                </p>
                                                <p>
                                                  Type : {data.pump_type_name}
                                                </p>
                                                <p>
                                                  Status : {data.pump_status}
                                                </p>
                                              </div>
                                            </SheetClose>
                                          ))
                                        ) : filteredPump &&
                                          filteredPump?.length > 0 ? (
                                          filteredPump.map((data) => (
                                            <SheetClose
                                              key={data.pump_id}
                                              className="p-3 border rounded-md cursor-pointer hover:bg-muted flex flex-col w-full"
                                              onClick={() => {
                                                engineerReportForm.reset({
                                                  ...engineerReportCurrentValue,
                                                  pump_detail: data.pump_id,
                                                });
                                                setSelectedPump(data);
                                              }}
                                            >
                                              <div className="font-medium">
                                                {data.pump_code_name}
                                              </div>
                                              <div className="text-sm text-muted-foreground flex flex-col items-start">
                                                <p>
                                                  Company Code :{" "}
                                                  {data.company_code}
                                                </p>
                                                <p>
                                                  Location : {data.location}
                                                </p>
                                                <p>
                                                  Design : {data.pump_design}
                                                </p>
                                                <p>
                                                  Type : {data.pump_type_name}
                                                </p>
                                                <p>
                                                  Status : {data.pump_status}
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
                    </div>
                  </FormBox>
                </div>
                <div className="w-full flex align-center justify-between">
                  <Button size="sm" className="w-32 gap-2" type="submit">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Submit</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/analytic/report_edit")({
  component: ReportEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
