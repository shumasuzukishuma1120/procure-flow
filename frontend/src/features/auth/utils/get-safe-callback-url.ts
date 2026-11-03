const DEFAULT_CALLBACK_URL = "/dashboard";

export function getSafeCallbackUrl(
  value: string | string[] | undefined,
  requestOrigin: string,
): string {
  const callbackUrl = Array.isArray(value) ? value[0] : value;

  if (!callbackUrl) {
    return DEFAULT_CALLBACK_URL;
  }

  try {
    const parsedUrl = new URL(callbackUrl, requestOrigin);

    if (parsedUrl.origin !== requestOrigin) {
      return DEFAULT_CALLBACK_URL;
    }

    if (parsedUrl.pathname === "/login" || parsedUrl.pathname.startsWith("/api/auth/")) {
      return DEFAULT_CALLBACK_URL;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return DEFAULT_CALLBACK_URL;
  }
}
