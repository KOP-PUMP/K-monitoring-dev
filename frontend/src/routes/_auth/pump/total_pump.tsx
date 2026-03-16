import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { PumpDataType } from "@/data/pump_models";
import { useGetPumpDetail } from "@/hook/pump/pump";
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
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDeletePump } from "@/hook/pump/pump";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

function TotalPump() {
  const { data: pumpDetailData } = useGetPumpDetail("");
  const deleteMutation = useDeletePump()
  const handlePumpDelete = (id: string) => {
    console.log(id);
    deleteMutation.mutate(id)
  }

  const columns: ExtendedColumnDef<PumpDataType>[] = [
    {
      id: "action",
      enableHiding: false,
      label: "Action",
      cell: ({ row }) => {
        const row_data = row.original;
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
              <Link
                to={`/pump/pump_detail?id=${row_data.pump_id}`}
              >
                <DropdownMenuItem>View</DropdownMenuItem>
              </Link>
              <Link
                to={`/analytic/report?id=${row_data.pump_id}`}
              >
                <DropdownMenuItem>Report</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => handlePumpDelete(row_data.pump_id.toString())}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "pump_code_name",
      label: "Pump",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("pump_code_name")}</div>
      ),
    },
    {
      accessorKey: "pump_speed",
      label: "Speed",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Speed (RPM)
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{`${row.getValue("pump_speed")}`}</div>
      ),
    },
    {
      accessorKey: "design_impeller_dia",
      label: "Impeller Diameter",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Impeller Diameter
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{`${row.getValue("design_impeller_dia")}`}</div>
      ),
    },
    {
      accessorKey: "pump_type_name",
      label: "Pump Type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump Type
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("pump_type_name")}</div>
      ),
    },
    {
      accessorKey: "pump_design",
      label: "Pump Design",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump Design
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("pump_design")}</div>
      ),
    },
    {
      accessorKey: "pump_status",
      label: "Pump Status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump Status
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("pump_status")}</div>
      ),
    },
    {
      accessorKey: "company_code",
      label: "Company Code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company Code
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("company_code")}</div>
      ),
    },
    {
      accessorKey: "doc_customer",
      label: "Customer Note",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer Note
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("doc_customer")}</div>
      ),
    },
    {
      accessorKey: "company_name_en",
      label: "Company Name (Eng)",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company Name (Eng)
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("company_name_en")}</div>
      ),
    },
    {
      accessorKey: "company_name_th",
      label: "Company Name (TH)",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company Name (Eng)
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("company_name_th")}</div>
      ),
    },
    {
      accessorKey: "location",
      label: "Location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="pl-4">{row.getValue("location")}</div>,
    },
    {
      accessorKey: "province",
      label: "Province",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Province
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("province")}</div>
      ),
    },
    {
      accessorKey: "sales_area",
      label: "Sale Area",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sale Area
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("sales_area")}</div>
      ),
    },
  ];
  return (
    <div className="w-full space-y-4 p-0 md:p-8 md:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Total Pumps</h2>
        <div className="flex items-center space-x-2">
          <Link to="/pump/detail">
            <Button>Add Pump</Button>
          </Link>
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
          {pumpDetailData ? (
            <DataTable
              data={pumpDetailData}
              columns={columns}
              search={["pump_code_name", "pump_status"]}
            />
          ) : (
            <div>Error</div>
          )}
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/pump/total_pump")({
  component: TotalPump,
});
