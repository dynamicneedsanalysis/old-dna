"use client";

import { toast } from "sonner";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTeam } from "../actions";

export default function TeamBasicInfoForm({
  teamName,
  teamId,
}: {
  teamName: string;
  teamId: string;
}) {
  const [orgName, setOrgName] = useState(teamName);

  const handleSave = async () => {
    if (!orgName) {
      toast.error("Team name cannot be empty");
      return;
    }

    toast.promise(updateTeam(orgName, teamId), {
      loading: "Updating team...",
      success: () => "Team updated successfully.",
      error: () => "Failed to update team.",
      position: "top-right",
    });
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
      <div className="space-y-4">
        <Label>Team Name</Label>
        <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
