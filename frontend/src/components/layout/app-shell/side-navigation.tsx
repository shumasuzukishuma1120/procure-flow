"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { CurrentUser } from "@/features/auth/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { mainNavigationItems, utilityNavigationItems } from "@/config/navigation";

export default function SidebarNavigation({ user }: { user: CurrentUser }) {
  const pathname = usePathname();

  const { setOpenMobile } = useSidebar();

  return (
    <SidebarContent className="justify-between">
      <SidebarGroup>
        <SidebarMenu className="gap-1">
          {mainNavigationItems
            .filter(
              (item) =>
                !("allowedRoles" in item) ||
                item.allowedRoles.some((role) => user.roles.includes(role)),
            )
            .map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              const ariaCurrent =
                pathname === item.href ? "page" : isActive ? "location" : undefined;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    render={
                      <Link
                        href={item.href}
                        onNavigate={() => setOpenMobile(false)}
                        aria-current={ariaCurrent}
                      />
                    }
                    tooltip={item.label}
                    className="h-10"
                  >
                    <Icon aria-hidden="true" />
                    <span className="text-lg">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="mb-3">
        <Separator className={"mb-4"} />
        <SidebarMenu>
          {utilityNavigationItems.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            const ariaCurrent = pathname === item.href ? "page" : isActive ? "location" : undefined;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={
                    <Link
                      href={item.href}
                      onNavigate={() => setOpenMobile(false)}
                      aria-current={ariaCurrent}
                    />
                  }
                  tooltip={item.label}
                  className="h-10"
                >
                  <Icon aria-hidden="true"/>
                  <span className="text-lg">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
