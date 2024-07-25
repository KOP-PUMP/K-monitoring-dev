import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/lib/settings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const SettingsPage = () => {
  const { showDescriptions, setShowDescriptions } = useSettings();

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
          <a href="#" className="font-semibold text-primary">
            General
          </a>
          <a href="#">Placeholder</a>
          <a href="#">Placeholder</a>
          <a href="#">Placeholder</a>
          <a href="#">Placeholder</a>
          <a href="#">Placeholder</a>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="settings-chunk-1">
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Set property of your forms.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include"
                    checked={showDescriptions}
                    onCheckedChange={(checked: boolean) => setShowDescriptions(checked)}
                  />
                  <label
                    htmlFor="include"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Show fields description.
                  </label>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">{/* <Button>Save</Button> */}</CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/settings")({
  component: SettingsPage,
});
