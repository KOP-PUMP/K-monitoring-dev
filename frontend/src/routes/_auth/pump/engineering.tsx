import { createFileRoute } from "@tanstack/react-router";
import { EngineeringDetail } from "@/components/EngineeringDetail";

export const Route = createFileRoute("/_auth/pump/engineering")({
  component: EngineeringDetail,
});
