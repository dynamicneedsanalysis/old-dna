"use client";

import { useQueryStates } from "nuqs";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchParamsParser } from "@/app/dashboard/(subscribed)/clients/lib/searchParams";

export function SearchBar() {
  const [{ name }, setName] = useQueryStates(searchParamsParser);
  return (
    <div className="relative">
      <Input
        placeholder="Search for client"
        className="pl-8"
        value={name ?? ""}
        onChange={(e) =>
          setName(
            { name: e.target.value },
            { shallow: false, throttleMs: 1000 }
          )
        }
      />
      <SearchIcon className="text-muted-foreground absolute top-3 left-2 h-4 w-4" />
    </div>
  );
}
