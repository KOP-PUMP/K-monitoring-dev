import { createFileRoute, useSearch } from "@tanstack/react-router";
import PumpList from "@/components/PumpDetail";

const PumpDetailEdit = () => {
  const { id } = useSearch({ from: "/_auth/pump/pump_detail_edit" });
  return <PumpList editId={id} />;
};

export const Route = createFileRoute("/_auth/pump/pump_detail_edit")({
  component: PumpDetailEdit,
  validateSearch: (search: { id: string }) => {
    return { id: search.id || "" };
  },
});
