"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteGoalAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/actions";

// Takes: A Client Id.
export function DeleteGoalsButton({ id }: { id: number }) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to delete a Goal.
  const { isPending, execute } = useServerAction(deleteGoalAction);

  return (
    <DeleteButton
      size="icon"
      isPending={isPending}
      onClick={async () => {
        toast.promise(
          // Execute the server action to delete the Goal.
          execute({
            clientId,
            goalId: id,
          }),
          // Return a toast message based on the result.
          {
            loading: "Deleting...",
            success: "Goal deleted successfully.",
            error: (error) => {
              if (error instanceof Error) return error.message;
            },
          }
        );
      }}
    />
  );
}
