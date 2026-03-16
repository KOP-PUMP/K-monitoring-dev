import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { useGetAllCustomersDetail } from "@/hook/users/customers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { CustomerResponse } from "@/types/users/customer";
import { Card } from "@/components/ui/card";

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  label?: string; // Add the label property
};

const CustomerTable = () => {
  const {data: customers} = useGetAllCustomersDetail();

  console.log(customers);

  /* Set cloumn */
  const columns: ExtendedColumnDef<CustomerResponse>[] = [
    {
      accessorKey: "user_name",
      label: "Name",
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
      
      cell: ({ row }) => {
        return <div className="pl-4">{row.getValue("user_name")}</div>;
      },
    },
    {
      accessorKey: "email",
      label: "Email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "mobile",
      label: "Mobile Number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mobile Number
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("mobile") || row.getValue("mobile") !== "" ? row.getValue("mobile") : "-" }</div>
      ),
    },
    {
      accessorKey: "tel",
      label: "Telephone Number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Telephone Number
            <ArrowUpDown className="pl-2" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue("tel") || row.getValue("tel") !== "" ? row.getValue("tel") : "-" }</div>
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
      cell: (/* { row } */) => {
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

              {/* <Link to={`/users/company_edit?code=${company.customer_code}`}>
                <DropdownMenuItem>View</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => handleDeleteData(company.customer_code)}
              >
                Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer Data</h2>
      </div>
      <Card className="px-6 w-full max-w-full overflow-x-hidden">
        {customers ? (
          <DataTable data={customers} columns={columns} search={"user_name"} />
        ) : (
          <div>Error</div>
        )}
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/_auth/customers/")({
  component: CustomerTable,
});
