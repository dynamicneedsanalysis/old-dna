import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import InviteTeamMember from "./components/invite-team-member";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect, unauthorized } from "next/navigation";
import { getOrganizationUsers } from "@/lib/kinde/organizations";
import { db } from "@/db";

export default async function InviteTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { getOrganization, getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const team = await getOrganization();

  if (!team || !team.orgCode) {
    notFound();
  }

  if (team.orgCode !== id) {
    return unauthorized();
  }

  const teamMembers = await getOrganizationUsers({
    orgId: team.orgCode,
  });

  if (teamMembers.status === "error") {
    return notFound();
  }

  const teamId = team.orgCode;

  const existingSub = await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.referenceId, teamId),
  });

  const seats = existingSub?.seats ?? 1;

  const invitations = await db.query.invitations.findMany({
    where: (invitations, { eq }) => eq(invitations.orgCode, id),
  });

  const remainingSeats =
    seats - teamMembers.orgUsers.length - invitations.length;

  if (remainingSeats === 0) {
    redirect(`/dashboard/teams/${id}`);
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/teams/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight"></h1>
      </div>
      <InviteTeamMember id={id} />
    </div>
  );
}
