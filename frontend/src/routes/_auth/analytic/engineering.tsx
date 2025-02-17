import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

const EngineeringDetail = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Engineering Analysis
        </h2>
        <Link to="/analytic/dashboard">Back</Link>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/analytic/engineering")({
  component: EngineeringDetail,
});
