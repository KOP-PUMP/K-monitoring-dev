import { createFileRoute } from "@tanstack/react-router";
import PumpList from "@/components/PumpList";

export const Route = createFileRoute("/_auth/pump/detail")({
  component: PumpList,
});
