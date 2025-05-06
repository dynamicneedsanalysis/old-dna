"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import the insurers data
import { INSURERS } from "@/constants/insurers";

interface InsurerSelectProps {
  onSelect: (companyCode: string) => void;
  value?: string;
  placeholder?: string;
}

// Takes: A selection handler, a value, and an optional placeholder.
export function InsurerSelect({
  onSelect,
  value,
  placeholder = "Choose an insurance carrier",
}: InsurerSelectProps) {
  const [open, setOpen] = useState(false);

  // Find the selected insurer based on the value. (CompCode)
  const selectedInsurer = value
    ? INSURERS.find((insurer) => insurer.CompCode === value)
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedInsurer ? (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedInsurer.Logos.Small || ""}
                alt={selectedInsurer.Name}
                width={24}
                height={24}
                className="h-6 w-auto object-contain"
              />
              <span className="truncate">{selectedInsurer.Name}</span>
            </div>
          ) : (
            <span className="text-secondary/40">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search insurers..." />
          <CommandList>
            <CommandEmpty>No insurer found.</CommandEmpty>
            <CommandGroup>
              {INSURERS.map((insurer) => (
                <CommandItem
                  key={insurer.CompCode}
                  value={insurer.CompCode}
                  onSelect={(currentValue) => {
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={insurer.Logos.Small || ""}
                    alt={insurer.Name}
                    width={24}
                    height={24}
                    className="h-6 w-auto object-contain"
                  />
                  <span>{insurer.Name}</span>
                  <Check
                    className={`ml-auto h-4 w-4 ${value === insurer.CompCode ? "opacity-100" : "opacity-0"}`}
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
