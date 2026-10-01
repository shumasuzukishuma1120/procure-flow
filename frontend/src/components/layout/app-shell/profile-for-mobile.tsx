import { type CurrentUser } from "@/features/auth/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import RoleBadge from "@/components/layout/app-shell/role-badge";

export default function ProfileForMobile({ user }: { user: CurrentUser }) {
  return (
    <div className="flex w-full items-center gap-3 p-3 md:hidden">
      <Avatar size="lg" className={"size-12! shrink-0"}>
        {/* FIXME */}
        {/* <AvatarImage src="" /> */}
        <AvatarFallback>
          <User className="object-cover" />
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col flex-1 gap-1">
        <p className="font-bold text-base">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.department.name}</p>
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>
      </div>
    </div>
  );
}
