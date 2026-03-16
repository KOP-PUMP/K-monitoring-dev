import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { MotorDetailLOVResponse } from "@/types";
import { useGetMotorDetailLOV, useDeleteMotorLOVById } from "@/hook/pump/pump";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

const MotorLOV = () => {
  const { data: motorData } = useGetMotorDetailLOV("");
  const deleteMutation = useDeleteMotorLOVById();
  const handleDeleteData = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  const columns: ExtendedColumnDef<MotorDetailLOVResponse>[] = [
    {
      accessorKey: "motor_code_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Motor Code Name
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Motor Code Name",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("motor_code_name")}</div>;
      },
    },
    {
      accessorKey: "motor_serial_no",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Serial Number
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Serial Number",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("motor_serial_no")}</div>;
      },
    },
    {
      accessorKey: "motor_brand",
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
         <div className="pl-4">{row.getValue("motor_brand")}</div>
      ),
    },
    {
      accessorKey: "motor_standard",
      label: "Motor Standard",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Motor Standard
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("motor_standard")}</div>
      ),
    },
    {
      accessorKey: "motor_speed",
      label: "Motor Speed",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Motor Speed
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("motor_speed")}</div>
      ),
    },
    {
      accessorKey: "motor_rated",
      label: "Motor Rated",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Motor Rated
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("motor_rated")}</div>
      ),
    },
    {
      accessorKey: "motor_factor",
      label: "Motor Factor",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Motor Factor
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("motor_factor")}</div>
      ),
    },
    {
      accessorKey: "motor_connection",
      label: "Motor Connection",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Motor Connection
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("motor_connection")}</div>
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
        const payment = row.original;
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
              <Link to={`/pump/motor_lov_edit?id=${payment.motor_lov_id}`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => handleDeleteData(payment.motor_lov_id as string)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">List of Motor Data</h2>
        <div className="flex items-center space-x-2">
          <Link to="/pump/motor_lov_edit" search={{ id: null }}>
            <Button>Add Motor Data</Button>
          </Link>
        </div>
      </div>
      <Card className="px-6 w-full max-w-full overflow-x-hidden">
        {motorData ? (
          <DataTable
            data={motorData}
            columns={columns}
            search={"motor_code_name"}
          />
        ) : (
          <div>Error</div>
        )}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_auth/pump/motor_lov_list")({
  component: MotorLOV,
});
