import { createFileRoute } from "@tanstack/react-router";
import PumpDetail from "@/components/PumpDetail";

export const Route = createFileRoute("/_auth/pump/detail")({
  component: PumpDetail,
});
