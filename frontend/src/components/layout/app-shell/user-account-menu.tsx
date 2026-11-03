import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import ThemeToggleMenuItem from "@/components/theme-toggle-menu-item";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getRequestOrigin } from "@/features/auth/server/get-request-origin";

async function handleSignOut() {
  "use server";

  const cognitoDomain = process.env.AUTH_COGNITO_DOMAIN;
  const clientId = process.env.AUTH_COGNITO_ID;

  if (!cognitoDomain || !clientId) {
    throw new Error("Cognitoのログアウト設定が不足しています。");
  }

  const requestOrigin = await getRequestOrigin();
  const logoutUri = new URL("/api/auth/signin", requestOrigin).toString();

  const logoutUrl = new URL("/logout", cognitoDomain);

  logoutUrl.searchParams.set("client_id", clientId);
  logoutUrl.searchParams.set("logout_uri", logoutUri);

  await signOut({ redirect: false });

  redirect(logoutUrl.toString());
}

export default function UserAccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" aria-label="ユーザーメニューを開く" />}>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <form action={handleSignOut}>
          <DropdownMenuItem nativeButton render={<button type="submit" className="w-full" />}>
            <LogOut aria-hidden="true" />
            ログアウト
          </DropdownMenuItem>
        </form>
        <ThemeToggleMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
