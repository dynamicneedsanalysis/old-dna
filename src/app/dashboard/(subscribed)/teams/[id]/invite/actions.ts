"use server";

import UserInvitationEmail from "@/components/emails/user-invitation";
import { db } from "@/db";
import { invitations } from "@/db/schema/invitations";
import { getOrganizationUsers } from "@/lib/kinde/organizations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { forbidden, notFound, redirect } from "next/navigation";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail({
  email,
  role,
}: {
  role: string;
  email: string;
}) {
  const { getUser, getOrganization } = getKindeServerSession();
  const user = await getUser();
  const team = await getOrganization();

  if (!user) {
    redirect("/api/auth/login");
  }

  if (!team) {
    forbidden();
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

  const currInvitations = await db.query.invitations.findMany({
    where: (invitations, { eq }) => eq(invitations.orgCode, team.orgCode),
  });

  if (currInvitations.find((inv) => inv.email === email)) {
    throw new Error("You've already invited this member.");
  }
  const remainingSeats =
    seats - teamMembers.orgUsers.length - currInvitations.length;

  if (remainingSeats === 0) {
    throw new Error("You don't have enough seats");
  }

  // Create the invitation.
  const invitation = await db
    .insert(invitations)
    .values({
      role,
      email,
      orgCode: team.orgCode ?? "",
    })
    .returning()
    .then((res) => res[0]);

  const { data, error } = await resend.emails.send({
    from: "Dynamic Needs Analysis <no-reply@dynamicneedsanalysis.com>",
    to: email,
    subject: `Accept your invitation to ${team.orgName}`,
    react: UserInvitationEmail({
      invitationId: invitation.id,
      orgName: team.orgName ?? "",
      owner: `${user.given_name} ${user.family_name}`,
      role,
    }),
  });

  if (error instanceof Error) {
    console.log(error.message);
    throw new Error("Failed to send email");
  }

  return data;
}
