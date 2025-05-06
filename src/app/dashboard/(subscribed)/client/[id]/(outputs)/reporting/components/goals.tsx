"use client";

import { moneyFormatter } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Goal } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";

// Takes: An array of Goals.
export function Goals({ goals }: { goals: Goal[] }) {
  return (
    <section className="mb-8">
      <Heading variant="h2">Overview</Heading>
      <div className="mx-auto max-w-4xl">
        <GoalsTable goals={goals} />
      </div>
    </section>
  );
}

// Takes: An array of Goals.
function GoalsTable({ goals }: { goals: Goal[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Amount ($)</TableHead>
          <TableHead className="text-center">Philanthropic</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {goals.map((goal) => (
          <TableRow key={goal.name}>
            <TableCell className="text-center font-medium">
              {goal.name}
            </TableCell>
            <TableCell className="text-center">
              {moneyFormatter.format(parseFloat(goal.amount))}
            </TableCell>
            <TableCell className="text-center">
              {goal.isPhilanthropic && (
                <CheckCircle2Icon className="mx-auto stroke-green-600" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
