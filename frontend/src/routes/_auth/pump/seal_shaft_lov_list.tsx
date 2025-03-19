import { createFileRoute } from "@tanstack/react-router";
import { useGetShaftSealDetailLOV } from "@/hook/pump/pump";

const ShaftSealTable = () => {
  const { data: shaftSealData } = useGetShaftSealDetailLOV("");
  console.log(shaftSealData);
  return <div>Hello /_auth/pump/seal_shaft_lov_list!</div>;
};

export const Route = createFileRoute("/_auth/pump/seal_shaft_lov_list")({
  component: ShaftSealTable,
});
