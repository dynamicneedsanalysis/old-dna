import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardTeamSwitcher } from "./dashboard-team-switcher";
import { redirect } from "next/navigation";
import UserProfileDropdownContent from "./user-profile-dropdown-content";

export async function UserProfile() {
  const { getUserOrganizations, getOrganization, getUser } =
    getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }
  const orgs = await getUserOrganizations();
  const org = await getOrganization();

  if (!org) {
    redirect(
      "/api/auth/login?org_code=org_15fd5c1df81&post_login_redirect_url=/dashboard/clients"
    );
  }
  return (
    <div className="flex items-center gap-8">
      {orgs && <DashboardTeamSwitcher teams={orgs.orgs} activeTeam={org} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center gap-4">
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-white text-black">
              {user?.given_name?.[0]}
              {user?.family_name?.[0]}
            </div>
            <div className="truncate font-semibold">
              {user?.given_name} {user?.family_name}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <UserProfileDropdownContent user={user} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
