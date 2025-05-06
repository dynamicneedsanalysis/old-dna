"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteUser } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Trash2Icon, Loader2Icon } from "lucide-react";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isPending, execute } = useServerAction(deleteUser);

  // On deletion redirect to the home page.
  const handleDelete = async () => {
    await execute();
    router.replace("/");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon className="mr-2 size-4" />
          <span>Delete Account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            All your data will be permanently deleted. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <LogoutLink>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin" />
                  <span>Deleting</span>
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </LogoutLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
