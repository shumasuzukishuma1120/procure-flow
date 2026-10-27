type PurchaseOrderRouteContext = { params: Promise<{ requestId: string }> };

export async function POST(request: Request, { params }: PurchaseOrderRouteContext) {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) throw new Error("BACKEND_API_URLが設定されていません。");
  const { requestId } = await params;
  const headers = new Headers({ "content-type": "application/json" });
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (idempotencyKey !== null) headers.set("Idempotency-Key", idempotencyKey);
  const response = await fetch(
    new URL(`/api/purchases/${encodeURIComponent(requestId)}/order`, backendApiUrl),
    {
      method: "POST",
      headers,
      body: await request.text(),
      cache: "no-store",
      signal: request.signal,
    },
  );
  return new Response(response.body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
}
