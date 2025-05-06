"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Takes: A href string and an optional exact boolean with a default value of false.
export function SettingsNavItem({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If exact, check path is same as href, otherwise only check if path starts with href.
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn("font-semibold", { "text-primary": isActive })}
    >
      {children}
    </Link>
  );
}
