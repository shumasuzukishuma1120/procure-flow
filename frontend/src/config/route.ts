export type RouteDefinition = {
  label: string;
  href: string;
  breadcrumbParentHref?: string;
};

export const routeDefinitions = [
  {
    label: "ダッシュボード",
    href: "/dashboard",
  },
  {
    label: "自分の申請",
    href: "/requests",
    breadcrumbParentHref: "/dashboard",
  },
  { label: "新規申請", href: "/requests/new", breadcrumbParentHref: "/requests" },
  {
    label: "承認待ち",
    href: "/approvals",
    breadcrumbParentHref: "/dashboard",
  },
  {
    label: "購買処理",
    href: "/purchases",
    breadcrumbParentHref: "/dashboard",
  },
  {
    label: "設定",
    href: "/settings",
    breadcrumbParentHref: "/dashboard",
  },
] as const satisfies RouteDefinition[];
