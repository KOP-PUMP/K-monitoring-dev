import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { PumpShaftSealLOVResponse } from "@/types";
import { useGetShaftSealDetailLOV, useDeleteShaftSealLOVById } from "@/hook/pump/pump";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

const ShaftSealTable = () => {
  const { data : shaftSealData} = useGetShaftSealDetailLOV("");
  const deleteMutation = useDeleteShaftSealLOVById();
  const handleDeleteData = (id : string) => {
    deleteMutation.mutate(id);
  }; 

  /* Set column */
  const columns: ExtendedColumnDef<PumpShaftSealLOVResponse>[] = [
    {
      accessorKey: "shaft_seal_code_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Shaft/Seal Code Name
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Shaft/Seal Code Name",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("shaft_seal_code_name")}</div>;
      },
    },
    {
      accessorKey: "shaft_seal_design",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Shaft/Seal Design
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Shaft/Seal Design",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("shaft_seal_design")}</div>;
      },
    },
    {
      accessorKey: "shaft_seal_brand",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Shaft/Seal Brand
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Shaft/Seal Brand",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("shaft_seal_brand")}</div>;
      },
    },
    {
      accessorKey: "shaft_seal_model",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Shaft/Seal Model
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Shaft/Seal Model",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("shaft_seal_model")}</div>;
      },
    },
    {
      accessorKey: "shaft_seal_material",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Shaft/Seal Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Shaft/Seal Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("shaft_seal_material")}</div>;
      },
    },
    {
      accessorKey: "mechanical_seal_api_plan",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Shaft/Seal API Plan
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Shaft/Seal API Plan",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("mechanical_seal_api_plan")}</div>;
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
        const data = row.original;
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
              <Link to={`/pump/shaft_seal_lov_edit?id=${data.shaft_seal_id}`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() =>handleDeleteData(data.shaft_seal_id)}
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
        <h2 className="text-3xl font-bold tracking-tight">Shaft/Seal Data</h2>
        <div className="flex items-center space-x-2">
          <Link to="/pump/shaft_seal_lov_edit" search={{ id: null }}>
            <Button>Add Shaft/Seal</Button>
          </Link>
        </div>
      </div>
      <Card className="px-6 w-full max-w-full overflow-x-hidden">
        {shaftSealData ? (
          <DataTable data={shaftSealData} columns={columns} search={"shaft_seal_code_name"} />
        ) : (
          <div>Error</div>
        )}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_auth/pump/shaft_seal_lov_list")({
  component: ShaftSealTable,
});
