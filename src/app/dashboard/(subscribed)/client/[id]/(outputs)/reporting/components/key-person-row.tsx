"use client";

import { useState } from "react";
import { cn, moneyFormatter } from "@/lib/utils";
import { calculateWant } from "@/lib/total-needs/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { updateKeyPersonPriority } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/actions/total-insurable-needs";

interface KeyPersonTableData {
  id: number;
  name: string;
  need: number;
  priority: number;
  businessName: string;
  rowIndex: number;
  isLastRowOfBusiness: boolean;
}

// Takes: An Id, name, need and priority values, Business name,
//        Row index, and a boolean to track if it is the last row of a Business.
export function KeyPersonTableRow({ item }: { item: KeyPersonTableData }) {
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
            await updateKeyPersonPriority(item.id, priority);
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
