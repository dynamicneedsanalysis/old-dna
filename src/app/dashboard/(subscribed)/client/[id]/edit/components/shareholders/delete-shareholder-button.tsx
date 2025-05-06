"use client";

import { useParams } from "next/navigation";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteShareholderAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/shareholders/actions";

// Takes: A Client Id and a Business Id.
export function DeleteShareholderButton({
  id,
  businessId,
}: {
  id: number;
  businessId: number;
}) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to delete a Shareholder.
  const { isPending, execute } = useServerAction(deleteShareholderAction);

  return (
    <DeleteButton
      size="icon"
      isPending={isPending}
      onClick={async () => {
        toast.promise(
          // Execute the server action to delete the Shareholder.
          // Return a toast message based on the result.
          execute({
            clientId: clientId,
            shareholderId: id,
            businessId: businessId,
          }),
          {
            loading: "Deleting...",
            success: "Shareholder deleted successfully.",
            error: (error) => {
              if (error instanceof Error) return error.message;
            },
          }
        );
      }}
    />
  );
}
