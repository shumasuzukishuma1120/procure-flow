import "server-only";

import {
  AuthenticationRequiredError,
  getCognitoAccessToken,
} from "@/features/auth/server/get-cognito-access-token";

function createAuthenticationRequiredResponse(detail: string): Response {
  return Response.json(
    {
      type: "https://procure-flow.example/problems/authentication-required",
      title: "Unauthorized",
      status: 401,
      detail,
      code: "AUTHENTICATION_REQUIRED",
      traceId: crypto.randomUUID(),
      fieldErrors: [],
    },
    { status: 401 },
  );
}

export async function fetchSpringBoot(
  input: string | URL | Request,
  init: RequestInit = {},
): Promise<Response> {
  let accessToken: string;

  try {
    accessToken = await getCognitoAccessToken();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return createAuthenticationRequiredResponse(error.message);
    }
    throw error;
  }

  const requestHeaders = new Headers(init.headers);
  requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  return fetch(input, {
    cache: "no-store",
    ...init,
    headers: requestHeaders,
  });
}
