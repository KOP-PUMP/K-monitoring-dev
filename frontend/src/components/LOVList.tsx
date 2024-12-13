import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LOVOut } from "@/types";
import { useDeleteLOVById, useGetAllPumpLOVData } from "@/hook/pump/pump";
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


export function LOVTable() {
  const { data , isLoading, isError } = useGetAllPumpLOVData();
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
        <DropdownMenuItem><Link to={`/pump/lov_edit?id=${id}`}>Update</Link></DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDeleteData(id, false) } className="hover:cursor-pointer">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderRows = (units: LOVOut[]) =>
    units.map((data) => (
      <TableRow key={data.id}>
        <TableCell className="text-sm text-muted-foreground">{data.type_name}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{data.product_name}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{data.data_value}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{data.data_value2 || "-"}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{data.data_value3 || "-"}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{data.data_value4 || "-"}</TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{dateFormat(data.updated_at)}</TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{data.updated_by}</TableCell>
        <TableCell>{renderActions(data.id)}</TableCell>
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
          <div className="text-center text-sm text-red-500">Error loading data.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PUMP LIST OF VALUES</CardTitle>
        <CardDescription>Manage pump list of values here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Add. 1</TableHead>
              <TableHead>Add. 2</TableHead>
              <TableHead>Add. 3</TableHead>
              <TableHead className="hidden md:table-cell">Last update</TableHead>
              <TableHead className="hidden md:table-cell">Update by</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              renderRows(data)
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Showing <strong>{data?.length || 0}</strong> units
        </div>
        <Link to="/pump/lov_edit" search={{ id: null }}>
          <Button size="sm" className="sm:w-28 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:whitespace-nowrap">Add new</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
