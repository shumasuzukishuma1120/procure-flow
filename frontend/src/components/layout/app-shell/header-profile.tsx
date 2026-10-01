import { type CurrentUser } from "@/features/auth/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import UserAccountMenu from "@/components/layout/app-shell/user-account-menu";
import RoleBadge from "@/components/layout/app-shell/role-badge";

export default function HeaderProfile({ user }: { user: CurrentUser }) {
  return (
    <>
      <div className="hidden md:flex items-center gap-2">
        <Avatar>
          {/* FIXME: AbaterImage取得できそうであれば修正 それまでは通信削減のためコメントアウト */}
          {/* <AvatarImage src="" /> */}
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-nowrap">
          <p className="font-bold text-nowrap">{user.name}</p>
          <p className="text-sm text-muted-foreground text-nowrap">{user.department.name}</p>
        </div>
        {user.roles.length <= 2 ? (
          <div className="flex gap-1.5">
            {user.roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {user.roles.map((role) => (
              <RoleBadge key={role} role={role} className="w-22 justify-center" />
            ))}
          </div>
        )}

        <UserAccountMenu />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <Avatar>
          {/* FIXME: AbaterImage取得できそうであれば修正 それまでは通信削減のためコメントアウト */}
          {/* <AvatarImage src="" /> */}
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <UserAccountMenu />
      </div>
    </>
  );
}
