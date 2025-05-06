"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { sendInvitationEmail } from "../actions";

export default function InviteTeamMember({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim().length) {
      toast.error("Please enter an email");
      return;
    }
    setIsLoading(true);
    toast.promise(sendInvitationEmail({ email, role: "member" }), {
      loading: "Adding team member...",
      success: () => {
        router.push(`/dashboard/teams/${id}`);
        return `${email} has been added to the team`;
      },
      error: (err) => err.message,
      finally: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="mb-4 flex justify-center">
          <div className="bg-secondary/10 rounded-full p-3">
            <UserPlus className="text-secondary h-10 w-10" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">
          Invite New Member
        </CardTitle>
        <CardDescription className="text-center">
          Add a user to this team. Users can only belong to one team.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Email</Label>
            <Input
              value={email}
              type="email"
              autoComplete="email"
              placeholder="jeremy@domain.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild disabled={isLoading}>
            <Link href={`/dashboard/teams/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add to Team"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
