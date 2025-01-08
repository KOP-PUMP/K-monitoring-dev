import { createFileRoute } from "@tanstack/react-router";
import { PumpCardsList } from "@/components/PumpCardsList";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

function PumpIndex() {
  const [filter, setFilter] = useState({
    search: "",
    status: "",
    framework: "",
  });

  const frameworks: ComboboxItemProps[] = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Total Pumps</h2>
        <div className="flex items-center space-x-2">
          <Link to="/pump/detail">
            <Button>Add Pump</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full text-center gap-4">
        <Card className="sm:basis-1/4">
          <CardHeader>
            <CardTitle>Total Pumps</CardTitle>
          </CardHeader>
        </Card>
        <Card className="sm:basis-1/4">
          <CardHeader>
            <CardTitle>Total Pumps</CardTitle>
          </CardHeader>
        </Card>
        <Card className="sm:basis-1/2">
          <CardHeader>
            <CardTitle>Total Pumps</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4 p-4 ">
          <div className="flex flex-col gap-4 px-2">
            <CardHeader className="px-2 py-0 font-bold">Filters</CardHeader>
            <div className="flex flex-wrap gap-4 pb-2">
              <Input
                className="w-full sm:w-[200px]"
                placeholder="Search"
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
              />
              <Combobox
                className="w-full sm:w-[120px]"
                items={frameworks}
                label="Pump Type"
                onChange={(value) => {
                  console.log(typeof value);
                  setFilter({ ...filter, framework: value as string }); // Update form state
                }}
              />
              <Combobox
                className="w-full sm:w-[120px]"
                items={frameworks}
                label="Status"
                onChange={(value) => {
                  console.log(typeof value);
                  setFilter({ ...filter, framework: value as string }); // Update form state
                }}
              />
              <Combobox
                className="w-full sm:w-[120px]"
                items={frameworks}
                label="Location"
                onChange={(value) => {
                  console.log(typeof value);
                  setFilter({ ...filter, framework: value as string }); // Update form state
                }}
              />
            </div>
            <hr />
          </div>
          <PumpCardsList />
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/pump/total_pump")({
  component: PumpIndex,
});
