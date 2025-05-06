import { Heading } from "@/components/ui/heading";
import { LiquidityAllocatedTowardsGoalsEdit } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/liquidity-allocated-towards-goals-edit";
import { GoalsTable } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/goals-table";
import { GoalDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/goals-dialog";

// Takes: A Client Id.
export function Goals({ clientId }: { clientId: number }) {
  return (
    <>
      <div>
        <Heading variant="h1">Goals & Philanthropy</Heading>
      </div>
      <div className="space-y-9">
        <LiquidityAllocatedTowardsGoalsEdit clientId={clientId} />
        <GoalDialog mode="add" />
        <GoalsTable clientId={clientId} />
      </div>
    </>
  );
}
