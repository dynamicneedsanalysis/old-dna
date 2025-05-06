"use client";

import { SquarePen } from "lucide-react";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { updateIllustrationAction } from "../lib/actions";

export default function PolicyNameEditDialog({
  id,
  clientId,
  initialValue,
}: {
  id: number;
  clientId: number;
  initialValue: string;
}) {
  const [open, setOpen] = useState(false);
  const [policyName, setPolicyName] = useState(initialValue);
  const { isPending, execute, error } = useServerAction(
    updateIllustrationAction
  );

  const handleEdit = async () => {
    toast.promise(
      execute({
        clientId,
        illustrationId: id,
        policyName,
      }),
      // Display toast messages based on the state of the action.
      {
        loading: "Updating...",
        success: () => "Successfully Updated File",
        error: () => error?.message,
        position: "top-right",
      }
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={isPending}
          onSelect={(e) => e.preventDefault()}
        >
          <SquarePen className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit illustration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="policyName" className="text-right">
              Policy Name
            </Label>
            <Input
              id="policyName"
              className="col-span-3"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEdit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
