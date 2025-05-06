"use client";
import * as React from "react";
import { ChevronDown, Plus, Users2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { usePathname } from "next/navigation";

export function DashboardTeamSwitcher({
  teams,
  activeTeam,
}: {
  teams: {
    code: string | null;
    name?: string;
  }[];
  activeTeam: {
    orgCode: string | null;
    orgName?: string | null;
  };
}) {
  const pathName = usePathname();
  if (!activeTeam) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between gap-4">
        <div className="flex-1 justify-between text-left text-sm leading-tight">
          <span className="truncate font-semibold">{activeTeam.orgName}</span>
        </div>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Teams
        </DropdownMenuLabel>
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.code ?? ""}
            disabled={team.code === activeTeam.orgCode}
            className={cn(
              "gap-2 p-2",
              team.code === activeTeam.orgCode &&
                "bg-secondary text-white data-disabled:opacity-90"
            )}
            asChild
          >
            <LoginLink
              postLoginRedirectURL={pathName}
              orgCode={team.code ?? undefined}
            >
              {team.name}
            </LoginLink>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {activeTeam.orgName !== "Default Organization" && (
          <DropdownMenuItem asChild className="gap-2 p-2">
            <Link href={`/dashboard/teams/${activeTeam.orgCode}`}>
              <div className="flex size-6 items-center justify-center rounded-md">
                <Users2Icon className="size-4" />
              </div>
              <div>Manage Team</div>
            </Link>
          </DropdownMenuItem>
        )}
        {teams.length === 1 && (
          <DropdownMenuItem asChild className="gap-2 p-2">
            <Link href="/dashboard/teams/create">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div>Add team</div>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
