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
import { PumpMatLOVResponse } from "@/types";
import { useGetMaterialDetailLOV, useDeleteMaterialLOVById } from "@/hook/pump/pump";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

const MaterialTable = () => {
  const { data : materialData} = useGetMaterialDetailLOV("");
  const deleteMutation = useDeleteMaterialLOVById();
  const handleDeleteData = (id : string) => {
    deleteMutation.mutate(id);
  }; 

  /* Set column */
  const columns: ExtendedColumnDef<PumpMatLOVResponse>[] = [
    {
      accessorKey: "mat_code_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Material Code Name
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Material Code Name",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("mat_code_name")}</div>;
      },
    },
    {
      accessorKey: "pump_type_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump Material Type
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Pump Material Type",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("pump_type_mat")}</div>;
      },
    },
    {
      accessorKey: "pump_mat_code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump Material Code
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Pump Material Code",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("pump_mat_code")}</div>;
      },
    },
    {
      accessorKey: "casing_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Casing Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Casing Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("casing_mat")}</div>;
      },
    },
    {
      accessorKey: "casing_cover_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Casing Cover Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Casing Cover Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("casing_cover_mat")}</div>;
      },
    },
    {
      accessorKey: "impeller_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Impeller Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Impeller Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("impeller_mat")}</div>;
      },
    },
    {
      accessorKey: "liner_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Liner Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Liner Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("liner_mat")}</div>;
      },
    },
    {
      accessorKey: "base_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Base Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Base Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("base_mat")}</div>;
      },
    },
    {
      accessorKey: "pump_head_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump Head Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Pump Head Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("pump_head_mat")}</div>;
      },
    },
    {
      accessorKey: "pump_head_cover_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pump Head Cover Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Pump Head Cover Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("pump_head_cover_mat")}</div>;
      },
    },
    {
      accessorKey: "stage_casing_diffuser_mat",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stage Casing Diffuser Material
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Stage Casing Diffuser Material",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("stage_casing_diffuser_mat")}</div>;
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
              <Link to={`/pump/material_lov_edit?id=${data.material_id}`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() =>handleDeleteData(data.material_id)}
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
        <h2 className="text-3xl font-bold tracking-tight">Material Data</h2>
        <div className="flex items-center space-x-2">
          <Link to="/pump/media_lov_edit" search={{ id: null }}>
            <Button>Add Material</Button>
          </Link>
        </div>
      </div>
      <Card className="px-6 w-full max-w-full overflow-x-hidden">
        {materialData ? (
          <DataTable data={materialData} columns={columns} search={"mat_code_name"} />
        ) : (
          <div>Error</div>
        )}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_auth/pump/material_lov_list")({
  component: MaterialTable,
});
