"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type RouteDefinition, routeDefinitions } from "@/config/route";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function AppBreadcrumb() {
  const pathname = usePathname();

  let currentPathname = pathname;
  const breadcrumbs: RouteDefinition[] = [];
  const used = new Set<string>();

  while (true) {
    if (used.has(currentPathname)) break;
    used.add(currentPathname);
    const item = routeDefinitions.find((route) => route.href === currentPathname);
    if (!item) break;
    breadcrumbs.unshift(item);
    if (!("breadcrumbParentHref" in item)) break;
    currentPathname = item.breadcrumbParentHref;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isCurrentPage = index + 1 === breadcrumbs.length
          return (
            <Fragment key={breadcrumb.href}>
              {index !== 0 && <BreadcrumbSeparator />}
              {!isCurrentPage ? (
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href={breadcrumb.href} />}>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
