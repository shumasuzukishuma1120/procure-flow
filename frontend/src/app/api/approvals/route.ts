export async function GET(request: Request) {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) throw new Error("BACKEND_API_URLが設定されていません。");

  const requestUrl = new URL(request.url);
  const backendUrl = new URL("/api/approvals", backendApiUrl);
  backendUrl.search = requestUrl.search;

  const response = await fetch(backendUrl, { cache: "no-store", signal: request.signal });
  return new Response(response.body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
}
