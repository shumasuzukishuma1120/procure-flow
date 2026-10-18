type SubmitDraftRequestRouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function POST(request: Request, { params }: SubmitDraftRequestRouteContext) {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const { requestId } = await params;

  const requestUrl = new URL(
    `/api/requests/${encodeURIComponent(requestId)}/submit`,
    backendApiUrl,
  );

  const headers = new Headers({
    "content-type": request.headers.get("content-type") ?? "application/json",
  });

  const idempotencyKey = request.headers.get("Idempotency-Key");

  if (idempotencyKey !== null) {
    headers.set("Idempotency-Key", idempotencyKey);
  }

  const response = await fetch(requestUrl, {
    method: "POST",
    headers,
    body: await request.text(),
    signal: request.signal,
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
