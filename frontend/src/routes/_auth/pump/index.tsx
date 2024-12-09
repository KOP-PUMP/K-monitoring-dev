import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// import PumpDetail from "@/components/PumpDetail";
// import { EngineeringDetail } from "@/components/EngineeringDetail";

import { useNavigate } from "@tanstack/react-router";

function PumpIndex() {
  const navigate = useNavigate({ from: "/pump" });
  const handleButtonClick = (link: string) => {
    navigate({ to: link });
  };

  return (
    <div className="flex space-x-2">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Pump Detail</CardTitle>
          <CardDescription className="text-balance max-w-lg leading-relaxed">Pump Detail description.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => handleButtonClick("detail")}>Go to Pump Detail</Button>
        </CardFooter>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Pump Engineering</CardTitle>
          <CardDescription className="text-balance max-w-lg leading-relaxed">
            Pump Engineering description.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => handleButtonClick("engineering")}>Go to Pump Engineering</Button>
        </CardFooter>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Update list data</CardTitle>
          <CardDescription className="text-balance max-w-lg leading-relaxed">
            Update list data of unit and pump data
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => handleButtonClick("list_edit")}>Go to list data edit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/pump/")({
  component: PumpIndex,
});
