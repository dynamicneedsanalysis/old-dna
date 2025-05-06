"use client";

import type { Dispatch, SetStateAction } from "react";
import { Switch } from "@/components/ui/switch";

// Takes: Boolean value and a setIsAnnual handler function.
export function PricingToggle({
  isAnnual,
  setIsAnnual,
}: {
  isAnnual: boolean;
  setIsAnnual: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Switch
      className="data-[state=checked]:bg-secondary data-[state=unchecked]:bg-secondary"
      checked={isAnnual}
      onCheckedChange={(value) => setIsAnnual(value)}
    />
  );
}
