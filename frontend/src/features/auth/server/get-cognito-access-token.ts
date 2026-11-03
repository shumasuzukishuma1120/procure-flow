import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getToken, type JWT } from "next-auth/jwt";

import { refreshCognitoAccessToken } from "@/features/auth/server/refresh-cognito-access-token";

const REFRESH_MARGIN_MILLISECONDS = 60_000;

type CachedAccessToken = {
  accessToken: string;
  expiresAt: number;
};

const refreshedAccessTokenCache = new Map<string, CachedAccessToken>();
const refreshRequests = new Map<string, Promise<CachedAccessToken>>();

export class AuthenticationRequiredError extends Error {
  constructor(message = "認証情報を取得できませんでした。再度ログインしてください。") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

function isUsable(expiresAt: number): boolean {
  return Date.now() < expiresAt - REFRESH_MARGIN_MILLISECONDS;
}

function getRefreshCacheKey(refreshToken: string): string {
  return createHash("sha256").update(refreshToken).digest("hex");
}

async function refreshAccessToken(token: JWT): Promise<CachedAccessToken> {
  if (!token.refreshToken) {
    throw new AuthenticationRequiredError();
  }

  const cacheKey = getRefreshCacheKey(token.refreshToken);
  const cached = refreshedAccessTokenCache.get(cacheKey);
  if (cached && isUsable(cached.expiresAt)) {
    return cached;
  }

  const inFlight = refreshRequests.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const refreshRequest = refreshCognitoAccessToken(token)
    .then((refreshedToken) => {
      if (
        refreshedToken.error ||
        !refreshedToken.accessToken ||
        !refreshedToken.accessTokenExpiresAt
      ) {
        throw new AuthenticationRequiredError();
      }

      const result = {
        accessToken: refreshedToken.accessToken,
        expiresAt: refreshedToken.accessTokenExpiresAt,
      };
      refreshedAccessTokenCache.set(cacheKey, result);
      return result;
    })
    .finally(() => {
      refreshRequests.delete(cacheKey);
    });

  refreshRequests.set(cacheKey, refreshRequest);
  return refreshRequest;
}

export async function getCognitoAccessToken(): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRETが設定されていません。");
  }

  const requestHeaders = await headers();
  const token = await getToken({
    req: { headers: requestHeaders },
    secret,
    secureCookie:
      process.env.AUTH_URL?.startsWith("https://") ?? process.env.NODE_ENV === "production",
  });

  if (!token) {
    throw new AuthenticationRequiredError();
  }

  if (
    token.accessToken &&
    token.accessTokenExpiresAt &&
    isUsable(token.accessTokenExpiresAt)
  ) {
    return token.accessToken;
  }

  return (await refreshAccessToken(token)).accessToken;
}
