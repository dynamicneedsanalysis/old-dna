"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteOrganizationUser } from "../actions";

export default function DeleteOrgUser({
  orgCode,
  memberId,
}: {
  orgCode: string;
  memberId: string;
}) {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await deleteOrganizationUser({
          orgId: orgCode,
          userId: memberId,
        });
      }}
      className="text-destructive focus:text-destructive"
    >
      <span>Remove</span>
    </DropdownMenuItem>
  );
}
