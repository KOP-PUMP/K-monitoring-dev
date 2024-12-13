import { createFileRoute } from "@tanstack/react-router";
import { LOVEdit } from "@/components/LOVEdit";

export const Route = createFileRoute("/_auth/pump/lov_edit")({
  component: LOVEdit,
  validateSearch: (search : { id : string}) => {
    return { id: search.id || null};
  },
});
