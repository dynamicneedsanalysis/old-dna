"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Building2Icon,
  CalculatorIcon,
  ChartLineIcon,
  CircleDollarSignIcon,
  CreditCardIcon,
  FileTextIcon,
  HandHeartIcon,
  LandmarkIcon,
  ListTodoIcon,
  PencilIcon,
  PiggyBankIcon,
  ScrollIcon,
  ShieldCheckIcon,
  Users2Icon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DeleteClientDialog } from "../client/delete-client-dialog";

// Takes: A Client Id.
export function AppSidebarMenu({ clientId }: { clientId: number }) {
  const pathname = usePathname();
  const clientMenuItems = [
    {
      title: "Edit details",
      url: `/dashboard/client/${clientId}/edit`,
      icon: PencilIcon,
    },
  ];

  // Define menu items - Report, Miscellaneous, Letters, and Check Lists.
  // Menu Item: Title and Url strings, and an Icon component.
  const reportMenuItems = [
    {
      title: "Income Replacement",
      url: `/dashboard/client/${clientId}/reporting#income-replacement`,
      icon: CreditCardIcon,
    },
    {
      title: "Beneficiaries",
      url: `/dashboard/client/${clientId}/reporting#beneficiaries`,
      icon: Users2Icon,
    },
    {
      title: "Businesses",
      url: `/dashboard/client/${clientId}/reporting#businesses`,
      icon: Building2Icon,
    },
    {
      title: "Assets",
      url: `/dashboard/client/${clientId}/reporting#assets`,
      icon: LandmarkIcon,
    },
    {
      title: "Debts",
      url: `/dashboard/client/${clientId}/reporting#debts`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Goals & Philanthropy",
      url: `/dashboard/client/${clientId}/reporting#goals`,
      icon: HandHeartIcon,
    },
    {
      title: "Tax Burden",
      url: `/dashboard/client/${clientId}/reporting#tax-burden`,
      icon: PiggyBankIcon,
    },
    {
      title: "Total Insurable Needs",
      url: `/dashboard/client/${clientId}/reporting#total-insurable-needs`,
      icon: ShieldCheckIcon,
    },
    {
      title: "Budget",
      url: `/dashboard/client/${clientId}/reporting#budget`,
      icon: CalculatorIcon,
    },
  ];

  const miscellaneousMenuItems = [
    {
      title: "Documents",
      url: `/dashboard/client/${clientId}/documents`,
      icon: FileTextIcon,
    },
    {
      title: "Illustrations",
      url: `/dashboard/client/${clientId}/illustrations`,
      icon: ChartLineIcon,
    },
  ];

  const letterMenuItems = [
    {
      title: "Reasons Why",
      url: `/dashboard/client/${clientId}/reasons-why`,
      icon: ScrollIcon,
    },
    {
      title: "Cover Letter",
      url: `/dashboard/client/${clientId}/cover-letter`,
      icon: ScrollIcon,
    },
    {
      title: "Advisor Disclosure",
      url: `/dashboard/client/${clientId}/advisor-disclosure`,
      icon: ScrollIcon,
    },
  ];

  const checkListMenuItems = [
    {
      title: "New Business",
      url: `/dashboard/client/${clientId}/new-business`,
      icon: ListTodoIcon,
    },
    {
      title: "Settling Requirements",
      url: `/dashboard/client/${clientId}/settling-requirements`,
      icon: ListTodoIcon,
    },
  ];

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Client</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {clientMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="data-[active=true]:bg-sidebar data-[active=true]:text-primary data-[active=true]:font-medium"
                  asChild
                  isActive={pathname.includes(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <DeleteClientDialog clientId={clientId} />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Report</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {reportMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="data-[active=true]:bg-sidebar data-[active=true]:text-primary data-[active=true]:font-medium"
                  asChild
                  isActive={pathname.includes(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Miscellaneous</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {miscellaneousMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="data-[active=true]:bg-sidebar data-[active=true]:text-primary data-[active=true]:font-medium"
                  asChild
                  isActive={pathname.includes(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Letters</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {letterMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="data-[active=true]:bg-sidebar data-[active=true]:text-primary data-[active=true]:font-medium"
                  asChild
                  isActive={pathname.includes(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Check Lists</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {checkListMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="data-[active=true]:bg-sidebar data-[active=true]:text-primary data-[active=true]:font-medium"
                  asChild
                  isActive={pathname.includes(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
