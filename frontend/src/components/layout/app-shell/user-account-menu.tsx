import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import ThemeToggleMenuItem from "@/components/theme-toggle-menu-item";

export default function UserAccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" aria-label="ユーザーメニューを開く"/>}><ChevronDown /></DropdownMenuTrigger>
      <DropdownMenuContent>
          <DropdownMenuItem>
            {/* FIXME 認証実装時に合わせて修正 */}
            <Link href={"/login"}>ログアウト</Link>
          </DropdownMenuItem>
          <ThemeToggleMenuItem/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
