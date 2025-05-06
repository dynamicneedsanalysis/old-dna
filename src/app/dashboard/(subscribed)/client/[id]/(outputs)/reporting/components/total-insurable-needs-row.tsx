"use client";

import { useState } from "react";
import { moneyFormatter } from "@/lib/utils";
import { calculateWant } from "@/lib/total-needs/utils";
import { Slider } from "@/components/ui/slider";
import { TableCell, TableRow } from "@/components/ui/table";
import { updateTotalInsurableNeeds } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/actions/total-insurable-needs";
import type { TotalInsurableNeeds } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/queries/total-insurable-needs";

// Takes: A TotalInsurableNeeds object and a need value.
export function TotalInsurableNeedsRow({
  item,
  need,
}: {
  item: TotalInsurableNeeds;
  need: number;
}) {
  const [priority, setPriority] = useState(item.priority);
  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.purpose}</TableCell>
      <TableCell>{moneyFormatter.format(need)}</TableCell>
      <TableCell className="flex w-[200px] flex-col gap-2">
        <Slider
          onValueChange={async ([newPriority]) => {
            setPriority(newPriority);
          }}
          onValueCommit={async ([newPriority]) => {
            await updateTotalInsurableNeeds(item.id, newPriority);
          }}
          value={[priority]}
          max={100}
          step={1}
        />
        <span className="flex">{priority}%</span>
      </TableCell>
      <TableCell>
        {moneyFormatter.format(calculateWant(need, priority))}
      </TableCell>
    </TableRow>
  );
}
