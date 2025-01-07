import { createFileRoute } from "@tanstack/react-router";
import { UserTable } from "@/components/UsersTable";

export const Route = createFileRoute("/_auth/customers/")({
  component: UserTable,
});
