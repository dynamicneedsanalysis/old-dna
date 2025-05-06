"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { removeInvitation } from "../actions";

export default function RemoveInvitation({ id }: { id: number }) {
  return (
    <DropdownMenuItem
      onClick={async () => {
        toast.promise(removeInvitation({ id }), {
          loading: "Removing invitation...",
          success: "Invitation removed successfully!",
          error: "Failed to remove invitation.",
        });
      }}
      className="text-destructive focus:text-destructive"
    >
      <span>Remove</span>
    </DropdownMenuItem>
  );
}
