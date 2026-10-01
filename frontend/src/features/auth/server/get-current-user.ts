import "server-only";
import { type CurrentUser } from "@/features/auth/types";

export async function getCurrentUser(): Promise<CurrentUser> {
  const user: CurrentUser = {
    id: "00000000-0000-4000-8000-000000000001",
    employeeNumber: "EMP-0001",
    name: "田中 啓太郎",
    department: {
      id: "00000000-0000-4000-8000-000000000101",
      name: "開発部",
    },
    roles: ["USER", "APPROVER","PURCHASER","ADMIN"],
  };

  return user;
}
