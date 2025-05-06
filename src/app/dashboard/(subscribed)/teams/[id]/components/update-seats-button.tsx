"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users2Icon } from "lucide-react";
import { useState } from "react";
import { updateTotalSeats } from "../actions";
import { toast } from "sonner";

export default function UpdateSeatsButton({
  totalSeats,
  currentMembersAndInvitations,
}: {
  totalSeats: number;
  currentMembersAndInvitations: number;
}) {
  const [open, setOpen] = useState(false);
  const [seats, setSeats] = useState(totalSeats.toString());
  const [error, setError] = useState("");

  const handleUpdateSeats = async () => {
    if (!seats) {
      console.error("Please specify the number of seats.");
      toast.error("Please specify the number of seats.", {
        position: "top-right",
      });
      setError("Please specify the number of seats.");
      return;
    }

    if (+seats === totalSeats) {
      const sameSeatError = `Your seat amount is already ${seats}.`;
      toast.error(sameSeatError, {
        position: "top-right",
      });
      setError(sameSeatError);
      return;
    }

    if (+seats < currentMembersAndInvitations) {
      console.error(
        "You must remove some members or invitations before decreasing the number of seats."
      );
      toast.error(
        "You must remove some members or invitations before decreasing the number of seats.",
        {
          position: "top-right",
        }
      );
      setError(
        "You must remove some members or invitations before decreasing the number of seats."
      );
      return;
    }

    toast.promise(updateTotalSeats(+seats), {
      loading: "Updating seats...",
      success: () => "Successfully updated seats.",
      error: () => "Failed to update seats.",
      position: "top-right",
    });
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users2Icon className="mr-2 h-4 w-4" /> Update Seats
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={() => {
          setError("");
          setOpen(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Update Total Seats</DialogTitle>
          <DialogDescription>
            Enter the total number of seats your team needs.
          </DialogDescription>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <Label htmlFor="seats">Total Number of Seats</Label>
            <div className="space-y-2">
              <Input
                id="seats"
                type="number"
                min="1"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="col-span-3"
              />
              <p className="text-muted-foreground text-sm">
                Your current number of seats is {totalSeats}.
              </p>
              {error && (
                <p className="text-destructive text-sm font-medium">{error}</p>
              )}
            </div>
          </div>
        </div>
        <DialogDescription className="text-secondary space-y-4 font-semibold">
          Note: You will see the updated charges on your invoice starting from
          your next billing date.
        </DialogDescription>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdateSeats}>
            Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
