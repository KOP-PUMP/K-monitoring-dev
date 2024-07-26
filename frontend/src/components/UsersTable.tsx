import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UserTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>Manage customer here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Need Inspection?</TableHead>
              <TableHead>Owned Pumps</TableHead>
              <TableHead className="hidden md:table-cell">Last Pump Inspection</TableHead>
              <TableHead className="hidden md:table-cell">Membership Start Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="hidden sm:table-cell">
                <img
                  alt="Customer image"
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpzRnDxETyn-dEnzii-DxRG7QZDmhORAqrKg&s"
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">Mr. One</TableCell>
              <TableCell>
                <Badge variant="outline">Yes</Badge>
              </TableCell>
              <TableCell>1</TableCell>
              <TableCell className="hidden md:table-cell">25 days ago</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-12 10:42 AM</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="hidden sm:table-cell">
                <img
                  alt="Customer image"
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjKabtSBuNPXurAwgUBgrc2gbxjbWhAOwvtQ&s"
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">Mr. Two</TableCell>
              <TableCell>
                <Badge variant="outline">Yes</Badge>
              </TableCell>
              <TableCell>3</TableCell>
              <TableCell className="hidden md:table-cell">100 days ago</TableCell>
              <TableCell className="hidden md:table-cell">2023-10-18 03:21 PM</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="hidden sm:table-cell">
                <img
                  alt="Customer image"
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src="https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg"
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">Mr. Three</TableCell>
              <TableCell>
                <Badge variant="outline">Yes</Badge>
              </TableCell>
              <TableCell>2</TableCell>
              <TableCell className="hidden md:table-cell">50 days ago</TableCell>
              <TableCell className="hidden md:table-cell">2023-11-29 08:15 AM</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="hidden sm:table-cell">
                <img
                  alt="Customer image"
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src="https://media.istockphoto.com/id/685132245/photo/mature-businessman-smiling-over-white-background.jpg?s=612x612&w=0&k=20&c=OJk6U-oCZ31F3TGmarAAg2jVli8ZWTagAcF4P-kNIqA="
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">Mr. Four</TableCell>
              <TableCell>
                <Badge variant="secondary">No</Badge>
              </TableCell>
              <TableCell>4</TableCell>
              <TableCell className="hidden md:table-cell">1 day ago</TableCell>
              <TableCell className="hidden md:table-cell">2023-12-25 11:59 PM</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-4</strong> of <strong>4</strong> customers
        </div>
      </CardFooter>
    </Card>
  );
}
