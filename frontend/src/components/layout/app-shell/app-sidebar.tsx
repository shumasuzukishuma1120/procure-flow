import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ProfileForMobile from "@/components/layout/app-shell/profile-for-mobile";
import type { CurrentUser } from "@/features/auth/types";
import SidebarNavigation from "@/components/layout/app-shell/side-navigation";

export function AppSidebar({ user }: { user: CurrentUser }) {

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-20 flex items-center justify-between flex-row px-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
        <strong className="text-2xl group-data-[collapsible=icon]:hidden whitespace-nowrap ">
          Procure Flow
        </strong>
        <SidebarTrigger
          variant="ghost"
          className="rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        />
      </SidebarHeader>
      <ProfileForMobile user={user} />
      <Separator />
      <SidebarNavigation user={user} />
    </Sidebar>
  );
}
