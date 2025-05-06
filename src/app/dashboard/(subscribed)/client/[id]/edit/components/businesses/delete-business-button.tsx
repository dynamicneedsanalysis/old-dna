"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteBusinessAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/actions";

export function DeleteBusinessButton({ id }: { id: number }) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to delete a Business.
  const { isPending, execute } = useServerAction(deleteBusinessAction);

  return (
    <DeleteButton
      size="icon"
      isPending={isPending}
      onClick={async () => {
        // Execute the server action to delete the Business.
        toast.promise(execute({ clientId, businessId: id }), {
          // Return a toast message based on the result.
          loading: "Deleting...",
          success: "Business deleted successfully.",
          error: (error) => {
            if (error instanceof Error) return error.message;
          },
        });
      }}
    />
  );
}
