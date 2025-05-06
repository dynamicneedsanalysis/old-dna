"use server";

import { getAccessToken, getUser } from "@/lib/kinde";
import {
  addOrganizationUsers,
  createOrganization,
} from "@/lib/kinde/organizations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function createTeam(name: string) {
  const { refreshTokens } = getKindeServerSession();
  const user = await getUser();
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Failed to fetch user profile");
  }

  const newOrg = await createOrganization({
    name,
    email: user.email ?? "",
    accessToken,
  });

  if (newOrg.status === "error") {
    throw new Error("Failed to create organization");
  }
  await addOrganizationUsers({
    orgId: newOrg.orgId,
    users: [
      {
        id: user.id,
        roles: ["owner"],
      },
    ],
  });

  await refreshTokens();

  return newOrg.orgId;
}
