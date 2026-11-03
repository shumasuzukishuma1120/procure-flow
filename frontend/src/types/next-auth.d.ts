import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Session {
    user: User;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    cognitoSub?: string;
    error?: "RefreshAccessTokenError";
  }
}
