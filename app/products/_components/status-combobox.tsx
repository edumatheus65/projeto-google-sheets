"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/app/_lib/utils";

const statusOptions = [
  { label: "Cancelado", value: "Cancelled" },
  { label: "Em processo", value: "In Process" },
  { label: "Enviado", value: "Shipped" },
  { label: "Resolvido", value: "Resolved" },
];

export function StatusCombobox({
  currentStatus,
  onSelect,
}: {
  currentStatus: string;
  onSelect: (newValue: string) => void;
}) {
  const [value, setValue] = React.useState<string>(currentStatus);
  const [open, setOpen] = React.useState<boolean>(false);

  async function handleSelect(newValue: string) {
    setValue(newValue);
    setOpen(false);
    onSelect(newValue);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {statusOptions.find((s) => s.value === value)?.label ||
            "Selecione um status"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum status encontrado.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => handleSelect(status.value)}
                >
                  {status.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === status.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
