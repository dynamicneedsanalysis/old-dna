"use client";

import { useServerAction } from "zsa-react";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { deleteClientAction } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/actions";
import { SidebarMenuButton } from "../ui/sidebar";

// Takes: A Client Id.
export function DeleteClientDialog({ clientId }: { clientId: number }) {
  const { isPending, execute, isError } = useServerAction(deleteClientAction);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <SidebarMenuButton>
          <Trash2Icon />
          <span>Delete Client</span>
        </SidebarMenuButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isError ? (
              "Something went wrong with deleting the client."
            ) : (
              <span>
                This action cannot be undone. This will permanently delete this
                client and remove its data from our servers.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className={buttonVariants({ variant: "destructive" })}
            onClick={async () => {
              const [, err] = await execute({ clientId });
              if (err) {
                console.error(err.message);
                return;
              }
            }}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
