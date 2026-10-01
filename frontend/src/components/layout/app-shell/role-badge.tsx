import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/features/auth/types";
import { cn } from "@/lib/utils";

const ROLE_BADGE_CLASS_NAMES: Record<UserRole, string> = {
  USER: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  APPROVER: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  PURCHASER: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

export default function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("p-2 font-bold", ROLE_BADGE_CLASS_NAMES[role], className)}
    >
      {role}
    </Badge>
  );
}
