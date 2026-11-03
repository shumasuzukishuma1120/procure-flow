import { auth } from "@/auth";
import AppShell from "@/components/layout/app-shell/app-shell";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.error === "RefreshAccessTokenError") {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return <AppShell>{children}</AppShell>;
}
