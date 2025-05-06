"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { resendInvitationEmail } from "../actions";

export default function ResendInvitation({
  email,
  id,
  role,
}: {
  email: string;
  id: number;
  role: string;
}) {
  return (
    <DropdownMenuItem
      onClick={async () => {
        toast.promise(
          resendInvitationEmail({
            email,
            id,
            role,
          }),
          {
            loading: "Sending invitation email...",
            success: "Invitation email sent successfully!",
            error: "Failed to send invitation email.",
          }
        );
      }}
    >
      <span>Resend</span>
    </DropdownMenuItem>
  );
}
