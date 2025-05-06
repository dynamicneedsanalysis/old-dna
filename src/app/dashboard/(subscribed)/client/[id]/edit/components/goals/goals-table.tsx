import { moneyFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2Icon } from "lucide-react";
import { selectAllGoals } from "@/db/queries/index";
import type { Goal } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";
import { DeleteGoalsButton } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/delete-goals-button";
import { GoalDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/goals-dialog";

// Takes: A Client Id.
export async function GoalsTable({ clientId }: { clientId: number }) {
  // Fetch all Goals for the Client.
  const { goals, error } = await selectAllGoals(clientId);

  if (error) {
    throw error;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Goal name</TableHead>
          <TableHead className="text-center">Desired funding amount</TableHead>
          <TableHead className="text-center">Is philanthropic?</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {goals?.map((g) => <GoalsTableRow key={g.id} goal={g} />)}
      </TableBody>
    </Table>
  );
}

// Takes: A Goal object.
function GoalsTableRow({ goal }: { goal: Goal }) {
  return (
    <TableRow>
      <TableCell className="text-center font-semibold">{goal.name}</TableCell>
      <TableCell className="text-center">
        {moneyFormatter.format(parseFloat(goal.amount))}
      </TableCell>
      <TableCell className="p-0 text-center">
        {goal.isPhilanthropic && (
          <CheckCircle2Icon className="mx-auto stroke-green-600" />
        )}
      </TableCell>
      <TableCell className="text-right">
        <GoalDialog mode="edit" goal={goal} />
      </TableCell>
      <TableCell className="text-right">
        <DeleteGoalsButton id={goal.id} />
      </TableCell>
    </TableRow>
  );
}
