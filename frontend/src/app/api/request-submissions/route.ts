import { fetchSpringBoot } from "@/lib/api/server/fetch-spring-boot";

export async function POST(request: Request) {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const springBootUrl = new URL("/api/request-submissions", backendApiUrl);
  const headers = new Headers({
    "content-type": request.headers.get("content-type") ?? "application/json",
  });
  const idempotencyKey = request.headers.get("Idempotency-Key");

  if (idempotencyKey !== null) {
    headers.set("Idempotency-Key", idempotencyKey);
  }

  const response = await fetchSpringBoot(springBootUrl, {
    method: "POST",
    headers,
    body: await request.text(),
    cache: "no-store",
    signal: request.signal,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
