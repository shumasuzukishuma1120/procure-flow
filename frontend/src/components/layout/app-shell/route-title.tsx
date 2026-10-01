"use client";

import { routeDefinitions } from "@/config/route";
import { usePathname } from "next/navigation";

export default function RouteTitle() {
  const pathname = usePathname();

  const getTitle = () => {
    const matchedItem = routeDefinitions.find((item) => item.href === pathname);
    if(!matchedItem) return "不明なページ"

    return matchedItem.label
  };

  return <h1 className="text-xl md:text-2xl font-bold text-nowrap">{getTitle()}</h1>;
}
