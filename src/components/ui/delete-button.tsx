"use client";

import { useFormStatus } from "react-dom";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface DeleteItemButtonProps extends ButtonProps {
  isPending?: boolean;
}

export function DeleteButton({ isPending, ...props }: DeleteItemButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      size="icon"
      disabled={pending || isPending}
      variant={pending || isPending ? "default" : "destructive"}
      {...props}
    >
      {pending || isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <Trash2Icon />
      )}
    </Button>
  );
}
