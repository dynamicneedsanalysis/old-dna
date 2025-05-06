"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { updateTotalInsurableNeeds } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/actions/total-insurable-needs";

// Takes: An Id value and a priority value.
export function PrioritySlider({
  id,
  priority,
}: {
  id: number;
  priority: number;
}) {
  const [controlledPriority, setControlledPriority] = useState(priority);
  return (
    <>
      <Slider
        onValueChange={async ([newPriority]) => {
          setControlledPriority(newPriority);
        }}
        onValueCommit={async ([newPriority]) => {
          await updateTotalInsurableNeeds(id, newPriority);
        }}
        value={[controlledPriority]}
        max={100}
        step={1}
      />
      <span className="flex">{controlledPriority}%</span>
    </>
  );
}
