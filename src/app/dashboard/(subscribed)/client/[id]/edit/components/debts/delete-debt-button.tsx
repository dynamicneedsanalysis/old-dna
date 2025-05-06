"use client";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteDebtAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/actions";

// Takes: A Client Id.
export function DeleteDebtButton({ id }: { id: number }) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to delete a Debt.
  const { isPending, execute } = useServerAction(deleteDebtAction);

  return (
    <DeleteButton
      size="icon"
      isPending={isPending}
      onClick={async () => {
        // Execute the server action to delete the Debt.
        toast.promise(execute({ clientId, debtId: id }), {
          // Return a toast message based on the result.
          loading: "Deleting...",
          success: "Debt deleted successfully.",
          error: (error) => {
            if (error instanceof Error) return error.message;
          },
        });
      }}
    />
  );
}
