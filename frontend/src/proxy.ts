export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/requests/:path*",
    "/approvals/:path*",
    "/purchases/:path*",
  ],
};
