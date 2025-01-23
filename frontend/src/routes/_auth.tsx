import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import AuthService from "@/lib/auth";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { CollapsibleState } from "@/types";

import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  BookUser,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ThemeToggler } from "@/components/theme/ThemeToggler";

const activeProps = {
  style: {
    color: "#e11d48",
    fontWeight: "bold",
    backgroundColor: "#fde8e8",
  },
};

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location }) => {
    const isAuthenticated = await AuthService.isAuthenticated();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const naviagte = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    naviagte({ to: "/login" });
  };

  const [isOpen, setIsOpen] = useState<CollapsibleState>({
    pumps: false,
    pump_data: false,
    user_manage: false,
  });

  const toggleClick = (tab: keyof CollapsibleState) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [tab]: !prevState[tab],
    }));
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-primary">
      <div className="hidden border-r border-border bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-border px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <Package2 className="h-6 w-6" />
              <span className="">K-Monitoring</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                activeProps={activeProps}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Collapsible>
                <CollapsibleTrigger
                  className="flex w-full justify-between items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  onClick={() => toggleClick("pumps")}
                >
                  <div className="flex gap-3 items-center">
                    <Package className="h-4 w-4" />
                    Pumps
                  </div>
                  {isOpen.pumps ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Link
                    to="/pump/total_pump"
                    className="flex items-center gap-3 rounded-lg px-10 py-2 text-muted-foreground transition-all hover:text-primary"
                    activeProps={activeProps}
                  >
                    Total Pumps
                    {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                  </Link>
                  <Collapsible>
                    <CollapsibleTrigger
                      className="flex w-full justify-between items-center rounded-lg pr-3 pl-10 py-2 text-muted-foreground transition-all hover:text-primary"
                      onClick={() => toggleClick("pump_data")}
                    >
                      <div className="flex gap-3 items-center">Pump Data</div>
                      {isOpen.pump_data ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Link
                        to="/pump/pump_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Pumps
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                      <Link
                        to="/pump/mech_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Mechanical Seals
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                      <Link
                        to="/pump/bearing_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Bearings
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                      <Link
                        to="/pump/motor_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Motors
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                      <Link
                        to="/pump/unit_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Units
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                      <Link
                        to="/pump/lov_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        List of Values
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                    </CollapsibleContent>
                  </Collapsible>
                </CollapsibleContent>
              </Collapsible>
              <Link
                to="/customers"
                className="flex  items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                activeProps={activeProps}
              >
                <Users className="h-4 w-4" />
                Customers
              </Link>
              <Link
                to="/analytic/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                activeProps={activeProps}
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
              <Collapsible>
                <CollapsibleTrigger
                  className="flex w-full justify-between items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  onClick={() => toggleClick("pumps")}
                >
                  <div className="flex gap-3 items-center">
                    <BookUser className="h-4 w-4" />
                    Users Manage
                  </div>
                  {isOpen.pumps ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Link
                    to="/users/company_list"
                    className="flex items-center gap-3 rounded-lg px-10 py-2 text-muted-foreground transition-all hover:text-primary"
                    activeProps={activeProps}
                  >
                    Companies
                    {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                  </Link>
                  <Collapsible>
                    <CollapsibleTrigger
                      className="flex w-full justify-between items-center rounded-lg pr-3 pl-10 py-2 text-muted-foreground transition-all hover:text-primary"
                      onClick={() => toggleClick("user_manage")}
                    >
                      <div className="flex gap-3 items-center">Users</div>
                      {isOpen.pump_data ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Link
                        to="/users/user_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Service Member
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                      <Link
                        to="/users/customer_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Customer
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                      <Link
                        to="/users/contact_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        Contact person
                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge> */}
                      </Link>
                    </CollapsibleContent>
                  </Collapsible>
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </div>
          {/* <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  to="/customers"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <div className="flex space-x-2">
            <ThemeToggler />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    naviagte({ to: "/settings" });
                  }}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-white dark:bg-zinc-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
