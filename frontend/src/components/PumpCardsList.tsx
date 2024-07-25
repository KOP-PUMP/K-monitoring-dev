import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PumpCardProps {
  title: string;
  image: string;
  description: string;
}

const PumpDetailedCard = ({ title, image, description }: PumpCardProps) => {
  return (
    <div className="m-2">
      <Card>
        <div className="flex">
          <CardHeader className="w-2/5 h-4/5">
            <img src={image} alt={image} />
            <CardTitle>{title}</CardTitle>
            <CardDescription className="w-5/6">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-x-2 py-4">
              <div>
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Speed</TableCell>
                      <TableCell>1450</TableCell>
                      <TableCell>m/s</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Application</TableCell>
                      <TableCell></TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fluid Name</TableCell>
                      <TableCell></TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Flow</TableCell>
                      <TableCell>140</TableCell>
                      <TableCell>m³/h</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Head</TableCell>
                      <TableCell>42</TableCell>
                      <TableCell>m</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Efficiency</TableCell>
                      <TableCell>90.7</TableCell>
                      <TableCell>%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Power</TableCell>
                      <TableCell>30</TableCell>
                      <TableCell>kW</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="pt-2 space-x-3">
                <Button className="h-7 font-bold">See more</Button>
                <Button className="h-7 font-bold bg-destructive hover:bg-red-500">Compare</Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export const PumpCardsList = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PumpDetailedCard
          title="KOP KDIN 336"
          image="https://koppump.com/wp-content/uploads/2020/05/KOP-KDIN.jpg"
          description="KDIN 336 125x1200-400 C36 XXD45903-1007-013"
        />
        <PumpDetailedCard
          title="KOP KDIN 336"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI8cfQ90yLBKTv4sDnTewZmCILsB4VvSRNJw&s"
          description="KDIN 336 125x100-400 C36 XXD45903-1007-0123"
        />
        <PumpDetailedCard
          title="KOP KDIN 336"
          image="https://koppump.com/wp-content/uploads/2020/06/KT.jpg"
          description="KDIN 336 125x100-400 C36 XXD45903-1007-0123"
        />
        <PumpDetailedCard
          title="KOP KDIN 336"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMvo6u_ElcyPtsU_R7CsrPwygza8wQUEEWFA&s"
          description="KDIN 336 125x100-400 C36 XXD45903-1007-0123"
        />
        <PumpDetailedCard
          title="KOP KDIN 336"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMvo6u_ElcyPtsU_R7CsrPwygza8wQUEEWFA&s"
          description="KDIN 336 125x100-400 C36 XXD45903-1007-0123"
        />
      </div>
    </div>
  );
};
