import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { refreshCognitoAccessToken } from "@/features/auth/server/refresh-cognito-access-token";

function readCognitoSubject(accessToken: string | undefined): string | undefined {
  if (!accessToken) {
    return undefined;
  }

  try {
    const encodedPayload = accessToken.split(".")[1];
    if (!encodedPayload) {
      return undefined;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      sub?: unknown;
    };
    return typeof payload.sub === "string" ? payload.sub : undefined;
  } catch {
    return undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_ID,
      clientSecret: process.env.AUTH_COGNITO_SECRET,
      issuer: process.env.AUTH_COGNITO_ISSUER,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    authorized({ auth }) {
      return auth !== null && auth.error !== "RefreshAccessTokenError";
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.cognitoSub = readCognitoSubject(account.access_token);
        token.accessTokenExpiresAt =
          account.expires_at === undefined ? undefined : account.expires_at * 1000;
        token.error = undefined;

        return token;
      }

      if (
        token.accessToken &&
        token.accessTokenExpiresAt &&
        Date.now() < token.accessTokenExpiresAt - 60_000
      ) {
        return token;
      }

      return refreshCognitoAccessToken(token);
    },
    async session({ session, token }) {
      session.user.id = token.cognitoSub ?? "";
      session.error = token.error;

      return session;
    },
  },
});
