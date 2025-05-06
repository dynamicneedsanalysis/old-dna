import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { invitations } from "@/db/schema/invitations";
import { addOrganizationUsers } from "@/lib/kinde/organizations";
import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { CheckCircle } from "lucide-react";
import { redirect, forbidden, unauthorized } from "next/navigation";

export default async function AcceptInvitation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    redirect(
      `/api/auth/login?post_login_redirect_url=/dashboard/accept-invitation/${id}`
    );
  }

  const existingInvitation = await db.query.invitations.findFirst({
    where: (invitations, { eq }) => eq(invitations.id, Number(id)),
  });

  if (!existingInvitation) {
    forbidden();
  }

  if (existingInvitation.email !== user.email) {
    console.log({
      invitationEmail: existingInvitation.email,
      email: user.email,
    });
    unauthorized();
  }

  await addOrganizationUsers({
    orgId: existingInvitation.orgCode,
    users: [
      {
        id: user.id,
        roles: [existingInvitation.role],
      },
    ],
  });

  await db.delete(invitations).where(eq(invitations.id, Number(id)));

  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">
          You&apos;ve accepted your invitation!
        </h1>
        <Button variant="secondary">
          <LoginLink orgCode={existingInvitation.orgCode}>
            Go to Dashboard
          </LoginLink>
        </Button>
      </div>
    </div>
  );
}
