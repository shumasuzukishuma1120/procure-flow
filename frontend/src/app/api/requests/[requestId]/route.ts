type RequestRouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function DELETE(request: Request, { params }: RequestRouteContext) {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const { requestId } = await params;
  const requestUrl = new URL(request.url);
  const springBootUrl = new URL(`/api/requests/${encodeURIComponent(requestId)}`, backendApiUrl);
  springBootUrl.search = requestUrl.search;

  const response = await fetch(springBootUrl, {
    method: "DELETE",
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

export async function PUT(request: Request, { params }: RequestRouteContext) {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const { requestId } = await params;

  const body = await request.text();

  const requestUrl = new URL(`/api/requests/${encodeURIComponent(requestId)}`, backendApiUrl);

  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    cache: "no-store",
    body,
    signal: request.signal,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
