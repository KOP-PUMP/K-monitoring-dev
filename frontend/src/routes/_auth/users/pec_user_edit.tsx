import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/lib/settings";
import { FormBox } from "@/components/common/FormBox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Car, CircleX, Key, PlusCircle, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useGetAllPECPersonByCode } from "@/hook/users/users";
import { useState, useEffect } from "react";

/* const PECPersonCreate = () => {
    const [PECPersonCode, setPECPersonCode] = useState(null);
    const { data: PECPerson } = useGetAllPECPersonByCode(PECPersonCode || "");

    useEffect(() => {
        
    })

    console.log(PECPerson);
    return <div>Hello /_auth/users/pec_user_edit</div>;
}; */

export const Route = createFileRoute("/_auth/users/pec_user_edit")({
  component: () => <>Hello /_auth/users/pec_user_edit</>,
});
