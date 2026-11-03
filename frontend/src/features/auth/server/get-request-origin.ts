import "server-only";

import { headers } from "next/headers";

export async function getRequestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost ?? requestHeaders.get("host");

  if (!host) {
    throw new Error("リクエストのHostを取得できませんでした。");
  }

  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";

  return new URL(`${protocol}://${host}`).origin;
}
