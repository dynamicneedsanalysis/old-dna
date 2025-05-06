"use client";

import { useParams } from "next/navigation";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteKeyPersonAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/actions";

export function DeleteKeyPersonButton({
  id,
  businessId,
}: {
  id: number;
  businessId: number;
}) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to delete a Key Person.
  const { isPending, execute } = useServerAction(deleteKeyPersonAction);

  return (
    <DeleteButton
      size="icon"
      isPending={isPending}
      onClick={async () => {
        toast.promise(
          // Execute the server action to delete the Key Person.
          execute({
            clientId,
            keyPersonId: id,
            businessId,
          }),
          // Return a toast message based on the result.
          {
            loading: "Deleting...",
            success: "Key person deleted successfully.",
            error: (error) => {
              if (error instanceof Error) return error.message;
            },
          }
        );
      }}
    />
  );
}
