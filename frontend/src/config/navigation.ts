import type { UserRole } from "@/features/auth/types";
import {
  Clock3,
  FileSpreadsheet,
  House,
  Settings,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles?: readonly UserRole[];
};

export const mainNavigationItems = [
  {
    label: "ダッシュボード",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "自分の申請",
    href: "/requests",
    icon: FileSpreadsheet,
    allowedRoles: ["USER"],
  },
  {
    label: "承認待ち",
    href: "/approvals",
    icon: Clock3,
    allowedRoles: ["APPROVER"],
  },
  {
    label: "購買処理",
    href: "/purchases",
    icon: ShoppingCart,
    allowedRoles: ["PURCHASER"],
  },
] as const satisfies readonly NavigationItem[];

export const utilityNavigationItems = [
  {
    label: "設定",
    href: "/settings",
    icon: Settings,
  },
] as const satisfies readonly NavigationItem[];