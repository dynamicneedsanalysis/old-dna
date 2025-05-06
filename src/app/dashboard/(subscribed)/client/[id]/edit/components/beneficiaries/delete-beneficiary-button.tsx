"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteBeneficiaryAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/actions";

// Takes: An Client Id number.
export function DeleteBeneficiaryButton({ id }: { id: number }) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to delete a Beneficiary.
  const { isPending, execute } = useServerAction(deleteBeneficiaryAction);

  return (
    <DeleteButton
      size="icon"
      isPending={isPending}
      onClick={async () => {
        // Execute the server action to delete the Beneficiary.
        toast.promise(execute({ clientId, beneficiaryId: id }), {
          // Return a toast message based on the result.
          loading: "Deleting...",
          success: "Beneficiary deleted successfully.",
          error: (error) => {
            if (error instanceof Error) return error.message;
          },
        });
      }}
    />
  );
}
