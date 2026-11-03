import "server-only";

import type { JWT } from "next-auth/jwt";

type CognitoTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
};

export async function refreshCognitoAccessToken(token: JWT): Promise<JWT> {
  const domain = process.env.AUTH_COGNITO_DOMAIN;
  const clientId = process.env.AUTH_COGNITO_ID;
  const clientSecret = process.env.AUTH_COGNITO_SECRET;

  if (!domain || !clientId || !clientSecret || !token.refreshToken) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  try {
    const basicCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: token.refreshToken,
    });

    const response = await fetch(new URL("/oauth2/token", domain), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicCredentials}`,
      },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const refreshedTokens = (await response.json()) as CognitoTokenResponse;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
