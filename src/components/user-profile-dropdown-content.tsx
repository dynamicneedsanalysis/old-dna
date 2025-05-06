import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import type { KindeUserBase } from "@kinde-oss/kinde-auth-nextjs/types";
import { GlobeLockIcon, LogOut, ScrollText, Settings } from "lucide-react";
import Link from "next/link";

export default function UserProfileDropdownContent({
  user,
}: {
  user: KindeUserBase;
}) {
  return (
    <>
      <DropdownMenuLabel>
        <div className="truncate font-semibold">
          {user?.given_name} {user?.family_name}
        </div>
        <div className="truncate text-xs font-normal">{user?.email}</div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/dashboard/settings">
            <span>
              <Settings />
            </span>
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/privacy-notice">
            <span>
              <GlobeLockIcon />
            </span>
            <span>Privacy Notice</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/terms-of-service">
            <span>
              <ScrollText />
            </span>
            <span>Terms of Service</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer gap-2" asChild>
        <LogoutLink className="w-full">
          <LogOut />
          Log out
        </LogoutLink>
      </DropdownMenuItem>
    </>
  );
}
