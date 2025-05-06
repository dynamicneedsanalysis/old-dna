"use client";

import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { MoreVertical, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDocumentAction } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/documents/lib/actions";
import type { Document } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/documents/lib/types";

// Takes: A Document object.
export function DocumentDropdown({ document }: { document: Document }) {
  // Define a server action to delete the Document file and database reference.
  const { isPending, execute, error } = useServerAction(deleteDocumentAction);

  // On upload, open the file in a new tab.
  const handleDownload = () => {
    window.open(document.file.url, "_blank");
  };

  // Handle delete action by executing the server action.
  const handleDelete = async () => {
    toast.promise(
      execute({ clientId: document.clientId, documentId: document.id }),
      // Display toast messages based on the state of the action.
      {
        loading: "Deleting...",
        success: () => "Successfully Deleted File",
        error: () => error?.message,
        position: "top-right",
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isPending}
          onClick={handleDelete}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
