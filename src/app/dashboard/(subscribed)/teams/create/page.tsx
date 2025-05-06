"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createTeam } from "./actions";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Team name cannot be empty");
      return;
    }

    setIsLoading(true);
    toast.promise(createTeam(teamName), {
      success: (orgId) => {
        router.push(`/api/auth/login?org_code=${orgId}`);
        return `Team "${teamName}" has been created.`;
      },
      error: "Failed to create team. Please try again.",
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-4 flex justify-center">
            <div className="bg-secondary/10 rounded-full p-3">
              <Users className="text-secondary h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Create a Team</CardTitle>
          <CardDescription className="text-center">
            Teams allow you to collaborate with members on projects
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Team"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
