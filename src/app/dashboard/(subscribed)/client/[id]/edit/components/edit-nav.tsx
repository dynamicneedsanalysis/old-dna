import Link from "next/link";
import { Logo } from "@/components/logo";
import { UserProfile } from "@/components/user-profile";

export function EditNavBar() {
  return (
    <header className="bg-navbar text-navbar-foreground p-4">
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/clients/`}>
            <Logo />
          </Link>
        </div>
        <UserProfile />
      </div>
    </header>
  );
}
