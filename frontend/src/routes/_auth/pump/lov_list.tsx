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
import { LOVData } from "@/types/table";
import { useGetAllPumpLOVData, useDeleteLOVById } from "@/hook/pump/pump";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

const LOVTable = () => {
  const { data, isLoading, isError } = useGetAllPumpLOVData();

  const deleteMutation = useDeleteLOVById();
  const handleDeleteData = (id: string, isUnit: boolean) => {
    deleteMutation.mutate({ id, isUnit });
  };

  /* Set column */
  const columns: ExtendedColumnDef<LOVData>[] = [
    {
      accessorKey: "type_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type Name
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Type Name",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("type_name")}</div>;
      },
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Group Name
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      label: "Group Name",
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("product_name")}</div>;
      },
    },
    {
      accessorKey: "data_value",
      label: "Unit name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("data_value")}</div>
      ),
    },
    {
      accessorKey: "data_value2",
      header: "Add. 1",
      label: "Add. 1",
      cell: ({ row }) => (
        <div className="min-w-[50px]">{row.getValue("data_value2")}</div>
      ),
    },
    {
      accessorKey: "data_value3",
      header: "Add. 2",
      label: "Add. 2",
      cell: ({ row }) => (
        <div className="min-w-[50px]">{row.getValue("data_value3")}</div>
      ),
    },
    {
      accessorKey: "data_value4",
      header: "Add. 3",
      label: "Add. 3",
      cell: ({ row }) => (
        <div className="min-w-[70px]">{row.getValue("data_value4")}</div>
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
              <Link to={`/pump/lov_edit?id=${payment.id}`}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => handleDeleteData(payment.id, false)}
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
        <h2 className="text-3xl font-bold tracking-tight">
          List of Value Data
        </h2>
        <div className="flex items-center space-x-2">
          <Link to="/pump/lov_edit" search={{ id: null }}>
            <Button>Add LoV</Button>
          </Link>
        </div>
      </div>
      <Card className="px-6 w-full max-w-full overflow-x-hidden">
        {data ? (
          <DataTable data={data} columns={columns} search={"product_name"} />
        ) : (
          <div>Error</div>
        )}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_auth/pump/lov_list")({
  component: LOVTable,
});
