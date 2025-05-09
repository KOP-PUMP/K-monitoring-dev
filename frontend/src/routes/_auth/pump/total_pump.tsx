import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { PumpDataType } from "@/data/pump_models";
import {
  GearIcon,
  PersonIcon,
  ClockIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { pumpData } from "@/data/pump_models";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
    TData,
    TValue
  > & {
    label?: string; // Add the label property
  };

/**
 * TotalPump
 *
 * This component renders a dashboard showing the total pumps, customer count, pumps requiring maintenance, and pumps needing recheck.
 *
 * It also renders a table showing the list of pumps with their respective details like image, name, brand, company code, province, sales area, status, created at, and created by.
 *
 * The table is searchable and sortable.
 *
 * @returns A React component
 */
function TotalPump() {
  const columns: ExtendedColumnDef<PumpDataType>[] = [
    {
      accessorKey: "image",
      header: ({ column }) => {
        return (
          ""
        );
      },
      label: "image",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("image")}</div>;
      },
    },
    {
      accessorKey: "name",
      label: "Pump name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump name
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "brand",
      label: "Brand",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Brand
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("brand")}</div>
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
      cell: ({ row }) => <div className="pl-4">{row.getValue("company_code")}</div>,
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
            {"Province"}
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
      label: "Sales Area",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"Sales Area"}
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("sales_area")}</div>
      ),
    },
    {
      accessorKey: "status",
      label: "Status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {"Status"}
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("status")}</div>
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
    {
      id: "action",
      enableHiding: false,
      label: "Action",
      cell: ({ row }) => {
        const company = row.original;
        return (
          <>
          </>
        );
      },
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
        {pumpData ? (
              <DataTable data={pumpData} columns={columns} search={["name","status"]}/>
        ) : (
          <div>Error</div>
        )}
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/pump/total_pump")({
  component: TotalPump
});
