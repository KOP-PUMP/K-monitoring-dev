import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import {
  GearIcon,
  PersonIcon,
  ClockIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogDescription,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  useCreateEngineerReportCheck,
  useGetEngineerReportCheck,
  useCreateEngineerReportFile,
  useGetEngineerReportFile,
  useDeleteEngineerReportFile,
  useDownloadEngineerReportFile,
} from "@/hook/engineer/engineer";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EngineerReportFileCreateSchema } from "@/validators/engineer";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

const ReportFileList = ({
  reports,
  onClose,
}: {
  reports: any;
  onClose: () => void;
}) => {
  const deleteFileMutation = useDeleteEngineerReportFile();
  const downloadFileMutation = useDownloadEngineerReportFile();

  const handleDeleteReportFile = (id: string) => {
    deleteFileMutation.mutate(id);
  };

  const handleDownloadReportFile = (id: string) => {
    downloadFileMutation.mutate(id);
  };

  return (
    <>
      <DialogHeader className="flex flex-row justify-between ">
        <div className="flex flex-col gap-2">
          <DialogTitle>Report File Create</DialogTitle>
          <DialogDescription>
            Create new report file for this report check or download existing
            report file.
          </DialogDescription>
        </div>
        <DialogClose onClick={onClose} className="hover:text-red-500">
          Close
        </DialogClose>
      </DialogHeader>
      {reports.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead className="w-[150px]">Detail</TableHead>
              <TableHead className="w-[150px]">Remark</TableHead>
              <TableHead className="w-[100px]">Updated At</TableHead>
              <TableHead className="w-[100px]">Updated By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report: any) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium flex flex-col justify-center align-middle gap-1 pt-2">
                  <Button
                    onClick={() => handleDownloadReportFile(report.report_id)}
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() => handleDeleteReportFile(report.report_id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell className="font-medium overflow-x-auto max-w-[50px]">
                  {report.report_detail || "-"}
                </TableCell>
                <TableCell className="font-medium overflow-x-auto max-w-[50px]">
                  {report.remark || "-"}
                </TableCell>
                <TableCell className="font-medium">
                  {new Date(report.updated_at).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">
                  {report.updated_by}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10">No Report Found</div>
      )}
    </>
  );
};

const ReportCreate = ({
  form,
  id,
  email,
  onClose,
}: {
  form: any;
  id: string;
  email: string;
  onClose: () => void;
}) => {
  const createFileMutation = useCreateEngineerReportFile();

  const handleCreateReportFile = (
    values: z.infer<typeof EngineerReportFileCreateSchema>,
  ) => {
    const data = {
      report_detail: values.report_detail || "",
      remark: values.remark || "",
    };
    console.log({ id, email: email, data });
    createFileMutation.mutate(
      {
        id,
        email,
        data,
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
        },
        onError: (error) => {
          console.error("Create failed:", error);
          onClose();
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <DialogHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <DialogTitle>Report File Create</DialogTitle>
          <DialogDescription>
            Please add detail and remark for this report file.
          </DialogDescription>
        </div>

        <DialogClose onClick={onClose} className="hover:text-red-500">
          Close
        </DialogClose>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateReportFile)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="report_detail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detail</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remark</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Generate new report file
          </Button>
        </form>
      </Form>
    </div>
  );
};

function TotalReport() {
  const localstorage = window.localStorage.getItem("user");
  const userData = localstorage !== null ? JSON.parse(localstorage) : null;
  const createMutation = useCreateEngineerReportCheck();
  const { id } = useSearch({ from: "/_auth/analytic/report" });
  const [openFileAction, setOpenFileAction] = useState(false);
  const [reportFileID, setReportFileID] = useState<string | null>(null);
  const [isCreateReportFile, setIsCreateReportFile] = useState(false);
  const { data: reportFileData } = useGetEngineerReportFile(reportFileID);
  const [reportDetail, setReportDetail] = useState<any>({
    doc_customer: "",
    doc_no: "",
    doc_number_engineer: "",
    status: "",
    created_at: "",
    created_by: "",
    updated_at: "",
    updated_by: "",
  });

  const { data: reportCheckData } = useGetEngineerReportCheck(id);

  /* const handleOpenReport = (id: string) => {
    setReportID(id);
  }; */

  /* const handleDeleteReport = (id: string) => {
    deleteMutation.mutate(id);
  }; */

  const handleCreateReportCheck = (e: any) => {
    e.preventDefault();
    const newReport = {
      ...reportDetail,
      pump_id: id,
      status: "New",
      created_at: new Date().toISOString(),
      created_by: userData?.user.user_email,
      updated_at: new Date().toISOString(),
      updated_by: userData?.user.user_email,
    };
    setReportDetail(newReport);
    createMutation.mutate(newReport);
    /* console.log(reportDetail); */
  };

  const reportFileCreateForm = useForm<
    z.infer<typeof EngineerReportFileCreateSchema>
  >({
    resolver: zodResolver(EngineerReportFileCreateSchema),
  });

  /* useEffect(() => {
    if (reportData) {
      const reportDataOut = {
        ...reportData,
        user_data: userData.user.user_email,
      };
      createNewEngineerReport.mutate(reportDataOut);
    }
  }, [reportData]); */

  const columns: ExtendedColumnDef<any>[] = [
    {
      id: "action",
      enableHiding: false,
      label: "Action",
      header: "Action",
      cell: ({ row }) => {
        const company = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link to={`/analytic/report_edit?id=${company.check_id}`}>
                <DropdownMenuItem>Check</DropdownMenuItem>
              </Link>
              {company.status !== "New" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setReportFileID(company.check_id);
                      setOpenFileAction(true);
                      setIsCreateReportFile(true);
                    }}
                  >
                    Create Report
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setReportFileID(company.check_id);
                      setIsCreateReportFile(false);
                      setOpenFileAction(true);
                    }}
                  >
                    All Report (Dialog)
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                  onClick={() => handleDeleteReportFile(company.check_id)}
                  >
                    Delete Report
                  </DropdownMenuItem> */}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "status",
      label: "Engineer Document Number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="pl-4">{row.getValue("status")}</div>,
    },
    {
      accessorKey: "doc_customer",
      label: "Document Customer",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Document Customer
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("doc_customer")}</div>
      ),
    },
    {
      accessorKey: "doc_no",
      label: "Document Number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Document Number
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="pl-4">{row.getValue("doc_no")}</div>,
    },
    {
      accessorKey: "doc_number_engineer",
      label: "Engineer Document Number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Engineer Document Number
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("doc_number_engineer")}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created at
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Created at",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        const dateFormatted = date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return <div className="pl-4">{dateFormatted}</div>;
      },
    },
    {
      accessorKey: "created_by",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created by
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Created by",
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("created_by")}</div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Updated at
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Updated at",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"));
        const dateFormatted = date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return <div className="pl-4">{dateFormatted}</div>;
      },
    },
    {
      accessorKey: "updated_by",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Updated by
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Updated by",
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("updated_by")}</div>
      ),
    },
  ];

  const handleClose = () => {
    setOpenFileAction(false);
    setReportFileID("");
    reportFileCreateForm.reset();
  };

  return (
    <div className="w-full space-y-4 p-0 md:p-8 md:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Total Report</h2>
        <div className="flex items-center space-x-2">
          {/* <Link to="/analytic/report_edit" search={{ id: id }}>
            <Button>Create Report</Button>
          </Link> */}
          <Sheet>
            <SheetTrigger>
              <Button>Maintenance Start</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Maintenance Report Create</SheetTitle>
                <SheetDescription>
                  Please add detail in order to start maintenance report
                </SheetDescription>
                <div className="gap-4 pt-8">
                  <form
                    className="flex flex-col items-start gap-4"
                    onSubmit={(events) => handleCreateReportCheck(events)}
                  >
                    <Label htmlFor="doc_customer" className="text-right">
                      Document Customer
                    </Label>
                    <Input
                      id="doc_customer"
                      className="w-full"
                      onChange={(e) =>
                        setReportDetail({
                          ...reportDetail,
                          doc_customer: e.target.value,
                        })
                      }
                    />
                    <Label htmlFor="doc_no" className="text-right">
                      Document No.
                    </Label>
                    <Input
                      id="doc_no"
                      className="w-full"
                      onChange={(e) =>
                        setReportDetail({
                          ...reportDetail,
                          doc_no: e.target.value,
                        })
                      }
                    />
                    <Label htmlFor="doc_number_engineer" className="text-right">
                      Document Engineer
                    </Label>
                    <Input
                      id="doc_number_engineer"
                      className="w-full"
                      onChange={(e) =>
                        setReportDetail({
                          ...reportDetail,
                          doc_number_engineer: e.target.value,
                        })
                      }
                    />
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          className="bg-green-500 hover:bg-green-600 w-full"
                          type="submit"
                        >
                          <PlusCircle className="mr-2 h-3.5 w-3.5" />
                          Create
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </form>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <GearIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Count
            </CardTitle>
            <PersonIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requiring Maintenance
            </CardTitle>
            <ClockIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pumps Needing Recheck
            </CardTitle>
            <FileTextIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 max-w-full w-full">
        <Card className="w-full flex flex-col gap-4 p-4 overflow-x-hidden">
          {reportCheckData ? (
            <DataTable
              data={reportCheckData}
              columns={columns}
              search={["status", "doc_customer"]}
              visible=""
            />
          ) : (
            <div>Error</div>
          )}
        </Card>
        <Dialog open={openFileAction} onOpenChange={setOpenFileAction}>
          <DialogContent
            className="p-6 max-w-4xl"
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            {/* Your report list or logic goes here */}
            {isCreateReportFile === false && reportFileData ? (
              <ReportFileList reports={reportFileData} onClose={handleClose} />
            ) : (
              <ReportCreate
                form={reportFileCreateForm}
                id={reportFileID as string}
                email={userData?.user.user_email as string}
                onClose={handleClose}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/analytic/report")({
  component: TotalReport,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || null };
  },
});
