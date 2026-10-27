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

export function resolveRouteDefinition(pathname: string): RouteDefinition | undefined {
  const exactMatch = routeDefinitions.find((route) => route.href === pathname);
  if (exactMatch) {
    return exactMatch;
  }

  const requestEditMatch = pathname.match(/^\/requests\/([^/]+)\/edit$/);
  if (requestEditMatch) {
    return {
      label: "下書き編集",
      href: pathname,
      breadcrumbParentHref: `/requests/${requestEditMatch[1]}`,
    };
  }

  if (/^\/requests\/[^/]+$/.test(pathname)) {
    return {
      label: "申請詳細",
      href: pathname,
      breadcrumbParentHref: "/requests",
    };
  }

  if (/^\/purchases\/[^/]+$/.test(pathname)) {
    return {
      label: "購買詳細",
      href: pathname,
      breadcrumbParentHref: "/purchases",
    };
  }

  return undefined;
}
