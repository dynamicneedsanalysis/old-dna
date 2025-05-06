import Link from "next/link";
import { notFound, redirect, unauthorized } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal, Settings, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getOrganizationUsers } from "@/lib/kinde/organizations";
import { db } from "@/db";
import DeleteOrgUser from "./components/delete-organization-user";
import UpdateSeatsButton from "./components/update-seats-button";
import ResendInvitation from "./components/resend-invitation";
import RemoveInvitation from "./components/remove-invitation";

export default async function TeamPage({
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

  const totalSeats = existingSub?.seats ?? 1;

  const invitations = await db.query.invitations.findMany({
    where: (invitations, { eq }) => eq(invitations.orgCode, id),
  });

  const currentMembersAndInvitations =
    teamMembers.orgUsers.length + invitations.length;
  const remainingSeats = totalSeats - currentMembersAndInvitations;

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Home</h1>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex gap-2">
            {remainingSeats > 0 && (
              <Button variant="outline" asChild>
                <Link href={`/dashboard/teams/${team.orgCode}/invite`}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Member
                </Link>
              </Button>
            )}
            <UpdateSeatsButton
              totalSeats={totalSeats}
              currentMembersAndInvitations={currentMembersAndInvitations}
            />
            <Button variant="outline" asChild>
              <Link href={`/dashboard/teams/${team.orgCode}/settings`}>
                <Settings className="mr-2 h-4 w-4" /> Team Settings
              </Link>
            </Button>
          </div>
        </div>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold tracking-tight">{team.orgName}</h1>
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                Members ({teamMembers.orgUsers.length}/{totalSeats})
              </h2>
              <p className="text-muted-foreground text-sm">
                Manage members of the {team.orgName} team
              </p>
            </div>
            <div className="space-y-6">
              {teamMembers.orgUsers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border bg-white text-black">
                      {member.first_name?.[0]}
                      {member.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-muted-foreground text-sm">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {member.id !== user.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DeleteOrgUser memberId={member.id} orgCode={id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </div>
          {invitations.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="my-4 text-xl font-semibold">
                  Pending Invitations
                </h2>
                <p className="text-muted-foreground text-sm">
                  Manage invitations you have sent out.
                </p>
              </div>
              <div className="space-y-6">
                {invitations.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{invite.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ResendInvitation
                          id={invite.id}
                          email={invite.email}
                          role={invite.role}
                        />
                        <RemoveInvitation id={invite.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
