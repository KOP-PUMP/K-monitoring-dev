import * as React from "react";
import { CaretSortIcon, CheckCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// import { useFormContext } from "react-hook-form";

// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export interface ComboboxItemProps {
  id: number;
  label: string;
  group: string;
}

export interface ComboboxProps {
  items: ComboboxItemProps[];
  name: string;
  groupName: string;
}

export function CascadeCombobox({ items, name, groupName }: ComboboxProps) {
  //   const { register } = useFormContext();

  const [open, setOpen] = React.useState(false);
  const [id, setid] = React.useState(0);

  // Group items by their group property
  const groupedItems = items.reduce(
    (groups, item) => {
      (groups[item.group] = groups[item.group] || []).push(item);
      return groups;
    },
    {} as Record<string, ComboboxItemProps[]>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[400px] justify-between">
          {id
            ? items.find((item) => item.id === id)?.group + " - " + items.find((item) => item.id === id)?.label
            : `Select ${name}...`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="border-2">
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            {Object.entries(groupedItems).map(([group, items]) => (
              <CommandGroup key={group}>
                <h1 className="px-4 py-2 bg-gray-100">
                  {groupName} - {group}
                </h1>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    id={item.id.toString()}
                    onSelect={() => {
                      setid(item.id);
                      setOpen(false);
                    }}>
                    <CheckCircledIcon className={cn("mr-2 h-4 w-4", id === item.id ? "opacity-100" : "opacity-0")} />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
