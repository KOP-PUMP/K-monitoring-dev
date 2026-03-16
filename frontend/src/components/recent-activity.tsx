import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest 30 days ago</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">Footer</div>
      </CardFooter>
    </Card>
  );
}
