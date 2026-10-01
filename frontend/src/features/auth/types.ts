export const USER_ROLES = ["USER", "APPROVER", "PURCHASER", "ADMIN"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type CurrentUser = {
  id: string;
  employeeNumber: string;
  name: string;
  department: {
    id: string;
    name: string;
  };
  roles: UserRole[];
};
