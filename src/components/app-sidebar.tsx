import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { User2Icon, ArrowLeft } from "lucide-react";
import { ChatbotDialog } from "@/components/chatbot-dialog";
import { AppSidebarMenu } from "@/components/ui/app-sidebar-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { selectSingleClient } from "@/db/queries/index";
import { TeamSwitcher } from "./team-switcher";
import UserProfileDropdownContent from "./user-profile-dropdown-content";
// Takes: A Client Id.
export async function AppSidebar({ clientId }: { clientId: number }) {
  const { getUser, getUserOrganizations, getOrganization } =
    getKindeServerSession();
  const user = await getUser();
  const orgs = await getUserOrganizations();
  const org = await getOrganization();

  if (!user) {
    redirect("/api/auth/login");
  }

  // Use Client Id and Kinde User Id to get the Client.
  const { client, error } = await selectSingleClient({
    id: clientId,
    kindeId: user.id,
  });
  if (error) {
    throw error;
  }
  if (!client) {
    return notFound();
  }

  // Redirect to the Client edit page if the Client has not onboarded.
  if (!client.hasOnboarded) {
    redirect(`/dashboard/client/${clientId}/edit`);
  }
  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="h-[73px] py-4 pl-4">
              <Link href="/dashboard/clients">
                <Logo />
              </Link>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="mb-4">
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/clients`}>
                <ArrowLeft />
                <span>Back to All Clients</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-4 pl-4">
            <div className="flex size-6 items-center justify-center overflow-hidden rounded-full bg-white text-black">
              <User2Icon className="size-4" />
            </div>
            <div className="truncate font-semibold">{client.name}</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <AppSidebarMenu clientId={clientId} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarMenu>
          <SidebarMenuItem className="my-2 px-2">
            <ChatbotDialog />
          </SidebarMenuItem>
          {org && orgs && <TeamSwitcher teams={orgs.orgs} activeTeam={org} />}
          <SidebarMenuItem className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-4 py-6"
                >
                  <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-white text-black">
                    {user?.given_name?.[0]}
                    {user?.family_name?.[0]}
                  </div>
                  <div>
                    <div className="truncate font-semibold">
                      {user?.given_name} {user?.family_name}
                    </div>
                  </div>
                </SidebarMenuButton>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
