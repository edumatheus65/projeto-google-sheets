"use client";

import * as React from "react";
import { addDays, format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/app/_lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Input } from "@/app/_components/ui/input";

export function DatePickerWithRange({
  onDateChange,
  className,
}: {
  onDateChange: (dates: { from: Date; to: Date }) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "from" | "to",
  ) => {
    const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date());
    if (!isNaN(parsedDate.getTime())) {
      setDate((prev) => {
        const updated = {
          from: field === "from" ? parsedDate : (prev?.from ?? new Date()),
          to:
            field === "to" ? parsedDate : (prev?.to ?? addDays(new Date(), 7)),
        };

        return updated;
      });
    }
  };

  React.useEffect(() => {
    if (date?.from && date?.to) {
      onDateChange({ from: date.from, to: date.to });
    }
  }, [date, onDateChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
          onChange={(e) => handleInputChange(e, "from")}
        />
        <span>até</span>
        <Input
          type="date"
          value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
          onChange={(e) => handleInputChange(e, "to")}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="calendar"
              variant="outline"
              className="w-[42px] p-2"
              title="Abrir calendário"
            >
              <CalendarIcon size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
