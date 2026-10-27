type PurchaseRouteContext = { params: Promise<{ requestId: string }> };

export async function GET(request: Request, { params }: PurchaseRouteContext) {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) throw new Error("BACKEND_API_URLが設定されていません。");
  const { requestId } = await params;
  const response = await fetch(
    new URL(`/api/purchases/${encodeURIComponent(requestId)}`, backendApiUrl),
    { cache: "no-store", signal: request.signal },
  );
  return new Response(response.body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
}
