import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LOVOut } from "@/types";
import { useDeleteLOVById, useGetAllUnitLOVData } from "@/hook/pump/pump";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export function UnitTable() {
  const { data: units, isLoading, isError } = useGetAllUnitLOVData();

  const deleteMutation = useDeleteLOVById();
  const handleDeleteData = (id: string, isUnit: boolean) => {
    deleteMutation.mutate({ id, isUnit });
  };

  const dateFormat = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderActions = (id: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {/* <DropdownMenuItem>View</DropdownMenuItem> */}
        <Link to={`/pump/unit_edit?id=${id}`}>
          <DropdownMenuItem className="hover:cursor-pointer">
            Update
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => handleDeleteData(id, true)}
          className="hover:cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderRows = (units: LOVOut[]) =>
    units.map((unit) => (
      <TableRow key={unit.id}>
        <TableCell className="text-sm text-muted-foreground">
          {unit.product_name}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {unit.data_value}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {unit.data_value2 || "-"}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {unit.data_value3 || "-"}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {unit.data_value4 || "-"}
        </TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
          {dateFormat(unit.updated_at)}
        </TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
          {unit.updated_by}
        </TableCell>
        <TableCell>{renderActions(unit.id)}</TableCell>
      </TableRow>
    ));

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="text-center text-sm">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent>
          <div className="text-center text-sm text-red-500">
            Error loading data.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UNITS</CardTitle>
        <CardDescription>Manage units here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Add. 1</TableHead>
              <TableHead>Add. 2</TableHead>
              <TableHead>Add. 3</TableHead>
              <TableHead className="hidden md:table-cell">
                Last update
              </TableHead>
              <TableHead className="hidden md:table-cell">Update by</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units && units.length > 0 ? (
              renderRows(units)
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Showing <strong>{units?.length || 0}</strong> units
        </div>
        <Link to="/pump/unit_edit" search={{ id: null }}>
          <Button size="sm" className="sm:w-28 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:whitespace-nowrap">Add new</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
