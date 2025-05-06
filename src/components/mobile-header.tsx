"use client";

import Image from "next/image";
import Link from "next/link";
import { MobileSidebarTrigger } from "@/components/ui/sidebar";

export function MobileHeader() {
  return (
    <header className="bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 md:hidden print:hidden">
      <Link href="/dashboard/clients">
        <div className="text-sidebar-foreground h-[73px] p-6 py-4 md:w-24 lg:w-72">
          <Image
            src="/logo.svg"
            alt="Dynamic Needs Analysis"
            width={40}
            height={40}
          />
        </div>
      </Link>
      <MobileSidebarTrigger />
    </header>
  );
}
