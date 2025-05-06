import { notFound } from "next/navigation";
import { formatPercentage, mightFail } from "@/lib/utils";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { clients } from "@/db/schema/index";
import { StatCard } from "@/components/stat-card";
import { EditLiquidityAllocatedTowardsGoalsDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/edit-liquidity-allocated-towards-goal-dialog";

const selectLiquidityAllocatedTowardsGoalsQuery = db
  .select({
    id: clients.id,
    liquidityAllocatedTowardsGoals: clients.liquidityAllocatedTowardsGoals,
  })
  .from(clients)
  .where(eq(clients.id, sql.placeholder("clientId")))
  .prepare("get_liquidity_allocated_towards_goals");

// Define and export a type based on the success result of the Liquidity Allocated Towards Goals query.
export type LiquidityAllocatedTowardsGoalsClient = Awaited<
  ReturnType<typeof selectLiquidityAllocatedTowardsGoalsQuery.execute>
>[0];

// Takes: A Client Id.
export async function LiquidityAllocatedTowardsGoalsEdit({
  clientId,
}: {
  clientId: number;
}) {
  // Execute the Liquidity Allocated Towards Goals query to get Client data.
  const { data: client, error } = await mightFail(() =>
    selectLiquidityAllocatedTowardsGoalsQuery
      .execute({ clientId })
      .then((res) => res[0])
  );
  if (error) {
    throw error;
  }

  if (!client) {
    return notFound();
  }
  return (
    <div className="flex w-[300px] flex-col gap-2">
      <StatCard
        description="Liquidity Allocated towards Goals"
        value={formatPercentage(
          parseFloat(client.liquidityAllocatedTowardsGoals)
        )}
      />
      <EditLiquidityAllocatedTowardsGoalsDialog client={client} />
    </div>
  );
}
