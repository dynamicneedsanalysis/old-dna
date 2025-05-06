"use client";

import { useFormStatus } from "react-dom";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Takes: The element classname, the button value, loading value,
//        And optional pending and disabled state values.
export function FormSubmitButton({
  className,
  value,
  loadingValue,
  isPending,
  disabled,
}: {
  className?: string;
  value: string;
  loadingValue: string;
  isPending?: boolean;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={className}
      disabled={isPending || pending || disabled}
      type="submit"
    >
      {isPending || pending ? (
        <div className="flex items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <span>{loadingValue}</span>
        </div>
      ) : (
        value
      )}
    </Button>
  );
}
