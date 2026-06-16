import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import AuthService from "@/lib/auth";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { CollapsibleState } from "@/types";
import { canAccess, getCurrentUserRole } from "@/lib/permissions";

import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Search,
  Users,
  BookUser,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ThemeToggler } from "@/components/theme/ThemeToggler";

const activeProps = {
  style: {
    color: "#4D7CDB",
    fontWeight: "bold",
    backgroundColor: "#E3E8F3",
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
    analytics: false,
    companies: false,
  });

  const toggleClick = (tab: keyof CollapsibleState) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [tab]: !prevState[tab],
    }));
  };

  const userRole = getCurrentUserRole();

  return (
    <div className="flex min-h-screen w-full bg-background text-primary">
      <div className="hidden w-[300px] border-r border-border bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-border px-4 lg:h-[60px] lg:px-6">
            <div className="h-full w-full flex justify-center items-center">
              <Link to="/" className="flex items-center gap-2 font-bold">
                <img
                  src="/K-MONITORING-LOGO-WEB.png"
                  alt="logo"
                  className="w-6 h-6"
                />
                <span>K-Monitoring</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-6 w-6">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
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
                    Total Pump
                  </Link>
                  {canAccess("data_table", userRole) && (
                    <Collapsible>
                      <CollapsibleTrigger
                        className="flex w-full justify-between items-center rounded-lg pr-3 pl-10 py-2 text-muted-foreground transition-all hover:text-primary"
                        onClick={() => toggleClick("pump_data")}
                      >
                        <div className="flex gap-3 items-center">
                          Data Table
                        </div>
                        {isOpen.pump_data ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Link
                          to="/pump/unit_list"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          Units
                        </Link>
                        {/* <Link
                        to="/pump/lov_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        List of Values
                      </Link> */}
                        <Collapsible>
                          <CollapsibleTrigger
                            className="flex w-full justify-between items-center rounded-lg pr-3 pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                            onClick={() => toggleClick("pump_data")}
                          >
                            <div className="flex gap-3 items-center">
                              Pump Data
                            </div>
                            {isOpen.pump_data ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <Link
                              to="/pump/lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              List of Values
                            </Link>
                            <Link
                              to="/pump/pump_detail_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Pump Data
                            </Link>
                            <Link
                              to="/pump/motor_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Motor Data
                            </Link>
                            <Link
                              to="/pump/material_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Material Data
                            </Link>
                            <Link
                              to="/pump/shaft_seal_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Shaft/Seal Data
                            </Link>
                            <Link
                              to="/pump/media_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Media Data
                            </Link>
                          </CollapsibleContent>
                        </Collapsible>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CollapsibleContent>
              </Collapsible>
              {canAccess("customer", userRole) && (
                <Link
                  to="/customers"
                  className="flex  items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  activeProps={activeProps}
                >
                  <Users className="h-4 w-4" />
                  Customers
                </Link>
              )}

              <Collapsible>
                <CollapsibleTrigger
                  className="flex w-full justify-between items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  onClick={() => toggleClick("analytics")}
                >
                  <div className="flex gap-3 items-center">
                    <LineChart className="h-4 w-4" />
                    Analytics
                  </div>
                  {isOpen.analytics ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Link
                    to="/analytic/factory_curve"
                    className="flex items-center gap-3 rounded-lg px-10 py-2 text-muted-foreground transition-all hover:text-primary"
                    activeProps={activeProps}
                  >
                    Factory Curve
                  </Link>
                </CollapsibleContent>
              </Collapsible>
              {canAccess("user_manage", userRole) && (
                <Collapsible>
                  <CollapsibleTrigger
                    className="flex w-full justify-between items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => toggleClick("user_manage")}
                  >
                    <div className="flex gap-3 items-center">
                      <BookUser className="h-4 w-4" />
                      Users Manage
                    </div>
                    {isOpen.user_manage ? (
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
                    </Link>
                    <Collapsible>
                      <CollapsibleTrigger
                        className="flex w-full justify-between items-center rounded-lg pr-3 pl-10 py-2 text-muted-foreground transition-all hover:text-primary"
                        onClick={() => toggleClick("companies")}
                      >
                        <div className="flex gap-3 items-center">Users</div>
                        {isOpen.companies ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Link
                          to="/users/pec_user_list"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          PEC Members
                        </Link>
                        <Link
                          to="/users/customer_list"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          Customer
                        </Link>
                        <Link
                          to="/users/create_user"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          Create User
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full max-w-full flex flex-col overflow-hidden">
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
              <SheetHeader>
                <div className="flex gap-2 justify-start align-middle">
                  <img
                    src="/K-MONITORING-LOGO-WEB.png"
                    alt="logo"
                    className="w-8 h-8"
                  />
                  <span className="content-center font-bold text-2xl text-primary">
                    K-MONITORING
                  </span>
                </div>
              </SheetHeader>
              <nav className="grid items-start text-sm font-medium">
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
                      Total Pump
                    </Link>
                    <Collapsible>
                      {canAccess("data_table", userRole) && (
                        <CollapsibleTrigger
                          className="flex w-full justify-between items-center rounded-lg pr-3 pl-10 py-2 text-muted-foreground transition-all hover:text-primary"
                          onClick={() => toggleClick("pump_data")}
                        >
                          <div className="flex gap-3 items-center">
                            Data Table
                          </div>
                          {isOpen.pump_data ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                      )}

                      <CollapsibleContent>
                        <Link
                          to="/pump/unit_list"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          Units
                        </Link>
                        {/* <Link
                        to="/pump/lov_list"
                        className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                        activeProps={activeProps}
                      >
                        List of Values
                      </Link> */}
                        <Collapsible>
                          <CollapsibleTrigger
                            className="flex w-full justify-between items-center rounded-lg pr-3 pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                            onClick={() => toggleClick("pump_data")}
                          >
                            <div className="flex gap-3 items-center">
                              Pump Data
                            </div>
                            {isOpen.pump_data ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <Link
                              to="/pump/lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              List of Values
                            </Link>
                            <Link
                              to="/pump/pump_detail_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Pump Data
                            </Link>
                            <Link
                              to="/pump/motor_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Motor Data
                            </Link>
                            <Link
                              to="/pump/material_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Material Data
                            </Link>
                            <Link
                              to="/pump/shaft_seal_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Shaft/Seal Data
                            </Link>
                            <Link
                              to="/pump/media_lov_list"
                              className="flex  items-center gap-3 rounded-lg pl-20 py-2 text-muted-foreground transition-all hover:text-primary"
                              activeProps={activeProps}
                            >
                              Media Data
                            </Link>
                          </CollapsibleContent>
                        </Collapsible>
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
                <Collapsible>
                  <CollapsibleTrigger
                    className="flex w-full justify-between items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => toggleClick("analytics")}
                  >
                    <div className="flex gap-3 items-center">
                      <LineChart className="h-4 w-4" />
                      Analytics
                    </div>
                    {isOpen.analytics ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Link
                      to="/analytic/factory_curve"
                      className="flex items-center gap-3 rounded-lg px-10 py-2 text-muted-foreground transition-all hover:text-primary"
                      activeProps={activeProps}
                    >
                      Factory Curve
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
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
                          to="/users/pec_user_list"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          PEC Members
                        </Link>
                        <Link
                          to="/users/customer_list"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          Customer
                        </Link>
                        <Link
                          to="/users/create_user"
                          className="flex  items-center gap-3 rounded-lg pl-16 py-2 text-muted-foreground transition-all hover:text-primary"
                          activeProps={activeProps}
                        >
                          Create User
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>
                  </CollapsibleContent>
                </Collapsible>
              </nav>
              {/* <div className="mt-auto">
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
              </div> */}
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
        <main className="w-full min-w-0 flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-white dark:bg-zinc-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
