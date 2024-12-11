import { CloudCog, MoreHorizontal } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
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

import { useGetAllUnitLOVData } from "@/hook/pump/pump";

export function UnitTable() {
  const { data: units, isLoading, isError } = useGetAllUnitLOVData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Units</CardTitle>
        <CardDescription>Manage units here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data type</TableHead>
              <TableHead>Unit name</TableHead>
              <TableHead>Unit value</TableHead>
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
            {units &&
              units.map((unit, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {unit.type_name}
                  </TableCell>
                  <TableCell>{unit.product_name}</TableCell>
                  <TableCell>{unit.data_value}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {unit.updated_at}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {unit.updated_by}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Update</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-4</strong> of <strong>{units?.length}</strong> data
        </div>
        <Link to="/pump/unit_edit">
          <Button size="sm" className="sm:w-28 gap-1 ">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:whitespace-nowrap">Add new</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
