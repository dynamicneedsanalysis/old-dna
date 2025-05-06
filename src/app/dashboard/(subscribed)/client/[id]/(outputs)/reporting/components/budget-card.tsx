"use client";

import { useState } from "react";
import { moneyFormatter } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { updateBudgetIncome } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/actions/budget";
import { MIN_INCOME_PERCENTAGE } from "@/constants";

// Takes: An Id, a minimum Budget, an income Budget, a maximum Budget, a max Budget percentage,
//        And a boolean to track if the Budget is determined from max income.
export function BudgetCard({
  id,
  minimumBudget,
  incomeBudget,
  maximumBudget,
  maxBudgetPercentage,
  isFromMaxIncome,
}: {
  id: number;
  minimumBudget: number;
  incomeBudget: number;
  maximumBudget: number;
  maxBudgetPercentage: number;
  isFromMaxIncome: boolean;
}) {
  const [income, setIncome] = useState(incomeBudget);
  return (
    <div className="bg-muted mx-auto h-full max-w-4xl rounded-2xl p-2">
      <div className="w-full p-4">
        <div className="mb-4 text-center text-4xl font-bold">
          {moneyFormatter.format(income)}
        </div>
        <div className="text-secondary dark:text-secondary-foreground mx-auto grid grid-cols-[1fr_4fr_1fr] gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-semibold">
              {moneyFormatter.format(minimumBudget)}
            </span>
            <span className="text-sm whitespace-nowrap">
              {MIN_INCOME_PERCENTAGE}% of income
            </span>
          </div>
          <Slider
            defaultValue={[minimumBudget]}
            value={[income]}
            min={minimumBudget}
            max={maximumBudget}
            step={1}
            onValueChange={async ([newIncome]) => {
              setIncome(newIncome);
            }}
            onValueCommit={async ([newIncome]) => {
              await updateBudgetIncome(id, newIncome.toString());
            }}
          />
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-semibold">
              {moneyFormatter.format(maximumBudget)}
            </span>
            <span className="text-sm whitespace-nowrap">
              {maxBudgetPercentage}% of{" "}
              {isFromMaxIncome ? "income" : "net worth"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
