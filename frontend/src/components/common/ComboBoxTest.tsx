import { useEffect, useRef, useState } from "react";
import { CaretSortIcon, CheckCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxItemProps {
  id: string;
  label: string;
}

interface ComboboxProps {
  name?: string;
  items: ComboboxItemProps[];
  className?: string;
  searchable?: boolean;
  onChange: (id: string) => void;
  default_id?: string | null;
}

export function Combobox({
  name = "items",
  items,
  className,
  searchable = true,
  onChange,
  default_id = null,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current && default_id) {
      setId(default_id);
      onChange(default_id);
      calledOnce.current = true;
    }
  }, [default_id, onChange]);

  return (
    <div className={cn("block", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            {id ? items.find((item) => item.id === id)?.label : `Select ${name}...`}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command className="border-2">
            {searchable ? <CommandInput placeholder={`Search ${name}...`} /> : null}
            <CommandList>
              <CommandEmpty>No department found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={(currentid) => {
                      onChange(item.id);
                      setId(currentid === id ? "" : currentid);
                      setOpen(false);
                    }}>
                    <CheckCircledIcon className={cn("mr-2 h-4 w-4", id === item.id ? "opacity-100" : "opacity-0")} />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
