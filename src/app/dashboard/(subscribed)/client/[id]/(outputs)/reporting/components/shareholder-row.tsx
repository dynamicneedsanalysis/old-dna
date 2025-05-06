"use client";

import { useState } from "react";
import { cn, moneyFormatter } from "@/lib/utils";
import { calculateWant } from "@/lib/total-needs/utils";
import { Slider } from "@/components/ui/slider";
import { TableRow, TableCell } from "@/components/ui/table";
import { updateShareholderPriority } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/actions/total-insurable-needs";

interface ShareholderTableData {
  id: number;
  name: string;
  need: number;
  priority: number;
  businessName: string;
  rowIndex: number;
  isLastRowOfBusiness: boolean;
}

// Takes: An Id, a name, a need value, a priority value, a Business name,
//        A row index, and a boolean to track if it is the last row of a Business.
export function ShareholderTableRow({ item }: { item: ShareholderTableData }) {
  const [priority, setPriority] = useState(item.priority);
  return (
    <TableRow
      key={item.id}
      className={cn({
        "border-b-muted-foreground border-b": item.isLastRowOfBusiness,
      })}
    >
      {item.rowIndex === 0 ? (
        <TableCell className="font-semibold">{item.businessName}</TableCell>
      ) : (
        <TableCell></TableCell>
      )}
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>{moneyFormatter.format(item.need)}</TableCell>
      <TableCell className="flex w-[200px] flex-col gap-2">
        <Slider
          onValueChange={([priority]) => setPriority(priority)}
          onValueCommit={async ([priority]) => {
            await updateShareholderPriority(item.id, priority);
          }}
          defaultValue={[priority]}
          max={100}
          step={1}
        />
        <span className="flex">{priority}%</span>
      </TableCell>
      <TableCell>
        {moneyFormatter.format(calculateWant(item.need, priority))}
      </TableCell>
    </TableRow>
  );
}
