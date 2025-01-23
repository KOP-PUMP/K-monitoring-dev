import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PumpCardProps {
  title: string;
  image: string;
  description: string;
}

const PumpDetailedCard = ({ title, image, description }: PumpCardProps) => {
  return (
    <div className="m-2">
      <Card className="h-full min-w-[230px]">
        <div className="h-full flex flex-col justify-between">
          <CardHeader className="h-full flex flex-col justify-between p-4">
            <img src={image} alt={image} className="max-h-[200px] object-contain"/>
            <div className="flex flex-col">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </CardHeader>
          <div className="flex flex-col">
            <CardContent className="px-4 pb-4">
              <div>
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
                        <TableCell className="font-medium">
                          Application
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Fluid Name
                        </TableCell>
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
                        <TableCell className="font-medium">
                          Efficiency
                        </TableCell>
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-between px-4">
              <Button className="h-7 font-bold">See more</Button>
              <Button className="h-7 font-bold bg-destructive hover:bg-red-500">
                Compare
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const PumpCardsList = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
