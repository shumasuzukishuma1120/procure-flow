import { getCurrentUser } from "@/features/auth/server/get-current-user";
import HeaderProfile from "@/components/layout/app-shell/header-profile";
import AppSidebarLayout from "@/components/layout/app-shell/app-sidebar-layout";
import { SidebarTriggerHamburger } from "@/components/ui/sidebar";
import RouteTitle from "@/components/layout/app-shell/route-title";
import AppBreadcrumb from "@/components/layout/app-shell/app-breadcrumb";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <AppSidebarLayout user={user}>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <header className="h-20 shrink-0 shadow-sm">
          <div className="border h-full flex items-center justify-between px-5 gap-3">
            <div className="flex items-center gap-5">
              <SidebarTriggerHamburger
                size={"icon-lg"}
                className="md:hidden border-border rounded-lg p-4 bg-background text-foreground"
              />
              <RouteTitle />
            </div>
            <HeaderProfile user={user} />
          </div>
        </header>
        <div className="p-2">
          <AppBreadcrumb />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </AppSidebarLayout>
  );
}
