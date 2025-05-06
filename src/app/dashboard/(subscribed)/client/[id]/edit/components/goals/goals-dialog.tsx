"use client";

import { useState } from "react";
import { PenSquareIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createGoal,
  editGoal,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/actions";
import type { Goal } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";
import { GoalForm } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/goals-form";

type GoalDialogProps = { mode: "add" } | { mode: "edit"; goal: Goal };

// Takes: A mode (add or edit) and a Goal object on edit mode.
export function GoalDialog(props: GoalDialogProps) {
  // Determine mode, track open state, and define close dialog handler.
  const isAddMode = props.mode === "add";
  const [open, setOpen] = useState(false);
  function handleCloseDialog() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isAddMode ? (
          <Button
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground my-4 space-x-1 rounded-full bg-transparent"
            variant="outline"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Goal</span>
          </Button>
        ) : (
          <PenSquareIcon className="h-6 w-6 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{isAddMode ? "Add Goal" : "Edit Goal"}</DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <GoalForm
            onCloseDialog={handleCloseDialog}
            serverAction={createGoal}
            submitButtonText="Add Goal"
            submitLoadingText="Adding..."
            successMessage="Goal added successfully."
          />
        ) : (
          <GoalForm
            initialValues={{
              id: props.goal.id,
              name: props.goal.name,
              amount: parseFloat(props.goal.amount),
              isPhilanthropic: props.goal.isPhilanthropic,
            }}
            onCloseDialog={handleCloseDialog}
            serverAction={editGoal}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Goal updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
