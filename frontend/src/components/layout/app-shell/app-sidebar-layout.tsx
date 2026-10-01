import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-shell/app-sidebar";
import { type CurrentUser } from "@/features/auth/types";
import { cookies } from "next/headers";

export default async function AppSidebarLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: CurrentUser;
}) {

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
