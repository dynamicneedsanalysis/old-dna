"use client";

import { SettingsNavItem } from "@/app/dashboard/settings/components/settings-nav-item";

export function SettingsNav() {
  return (
    <nav className="text-muted-foreground grid gap-4 text-sm">
      <SettingsNavItem href="#profile">Profile</SettingsNavItem>
      <SettingsNavItem href="#billing">Plan & Billing</SettingsNavItem>
      <SettingsNavItem href="#data">Data & Privacy</SettingsNavItem>
      <SettingsNavItem href="#support">Contact Support</SettingsNavItem>
    </nav>
  );
}
