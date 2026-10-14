type CancelRequestRouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function POST(request: Request, { params }: CancelRequestRouteContext) {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const { requestId } = await params;
  const springBootUrl = new URL(
    `/api/requests/${encodeURIComponent(requestId)}/cancel`,
    backendApiUrl,
  );

  const response = await fetch(springBootUrl, {
    method: "POST",
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
    },
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
