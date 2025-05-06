"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteAssetAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/actions";

// Takes: An Client Id number.
export function DeleteAssetButton({ id }: { id: number }) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to delete an Asset.
  const { isPending, execute } = useServerAction(deleteAssetAction);

  return (
    <DeleteButton
      size="icon"
      isPending={isPending}
      onClick={async () => {
        // Execute the server action to delete the Asset.
        toast.promise(execute({ clientId, assetId: id }), {
          // Return a toast message based on the result.
          loading: "Deleting...",
          success: "Asset deleted successfully.",
          error: (error) => {
            if (error instanceof Error) return error.message;
          },
        });
      }}
    />
  );
}
