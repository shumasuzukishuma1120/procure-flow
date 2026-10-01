import AppShell from "@/components/layout/app-shell/app-shell";
import React from "react";

export default function ProtectedLayout({ children }: {children:React.ReactNode}) {

  return (
<AppShell>
  {children}
</AppShell>
  );
}
