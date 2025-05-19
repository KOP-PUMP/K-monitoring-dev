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
import { MediaLOVResponse } from "@/types";
import { useGetMediaLOVData, useDeleteMediaLOVById } from "@/hook/pump/pump";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

const MediaTable = () => {
  const { data, isLoading, isError } = useGetMediaLOVData("");

  const deleteMutation = useDeleteMediaLOVById();
  const handleDeleteData = (id : string) => {
    deleteMutation.mutate(id);
  }; 

  /* Set column */
  const columns: ExtendedColumnDef<MediaLOVResponse>[] = [
    {
      accessorKey: "media_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Name",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("media_name")}</div>;
      },
    },
    {
      accessorKey: "media_density",
      header: "Density",
      label: "Density",
      cell: ({ row }) => (
        <div className="min-w-[50px]">{row.getValue("media_density")}</div>
      ),
    },
    {
      accessorKey: "media_viscosity",
      header: "Viscosity",
      label: "Viscosity",
      cell: ({ row }) => (
        <div className="min-w-[50px]">{row.getValue("media_viscosity")}</div>
      ),
    },
    {
      accessorKey: "media_concentration_percentage",
      header: "Concentration percentage",
      label: "Concentration percentage",
      cell: ({ row }) => (
        <div className="min-w-[50px]">
          {row.getValue("media_concentration_percentage")}
        </div>
      ),
    },
    {
        accessorKey: "operating_temperature",
        header: "Operating temp. (°C)",
        label: "Operating temp. (°C)",
        cell: ({ row }) => (
          <div className="min-w-[50px]">
            {row.getValue("operating_temperature")}
          </div>
        ),
      },
    {
      accessorKey: "vapor_pressure",
      header: "Vapor Pressure",
      label: "Vapor Pressure",
      cell: ({ row }) => (
        <div className="min-w-[70px]">{row.getValue("vapor_pressure")}</div>
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
              <Link to={`/pump/media_lov_edit?id=${data.media_id}`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() =>handleDeleteData(data.media_id)}
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
        <h2 className="text-3xl font-bold tracking-tight">Media Data</h2>
        <div className="flex items-center space-x-2">
          <Link to="/pump/media_lov_edit" search={{ id: null }}>
            <Button>Add Media</Button>
          </Link>
        </div>
      </div>
      <Card className="px-6 w-full max-w-full overflow-x-hidden">
        {data ? (
          <DataTable data={data} columns={columns} search={"media_name"} />
        ) : (
          <div>Error</div>
        )}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_auth/pump/media_lov_list")({
  component: MediaTable,
});
