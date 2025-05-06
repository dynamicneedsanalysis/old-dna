"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";

// Takes: A Client Id.
export function EditDetailsButton({ clientId }: { clientId: number }) {
  return (
    <Link
      href={`/dashboard/client/${clientId}/edit`}
      className={cn("flex items-center gap-2")}
    >
      <PencilIcon className="size-4" />
      <span>Edit Details</span>
    </Link>
  );
}
