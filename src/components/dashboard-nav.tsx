import Link from "next/link";
import { Logo } from "@/components/logo";
import { UserProfile } from "@/components/user-profile";

export async function DashboardNav() {
  return (
    <header className="bg-navbar text-secondary-foreground border-b p-4">
      <div className="mx-auto flex items-center justify-between md:max-w-(--breakpoint-xl) lg:max-w-(--breakpoint-2xl)">
        <Link href="/dashboard/clients">
          <Logo />
        </Link>
        <UserProfile />
      </div>
    </header>
  );
}
