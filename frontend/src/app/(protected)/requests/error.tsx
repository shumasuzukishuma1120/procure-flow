"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, LayoutDashboard, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type RequestsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RequestsError({ error, reset }: RequestsErrorProps) {
  useEffect(() => {
    console.error("Failed to render requests page", error);
  }, [error]);

  return (
    <div className="flex min-h-80 items-center justify-center px-4">
      <div className="max-w-md space-y-4 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">申請画面を表示できませんでした</h2>
          <p className="text-sm text-muted-foreground">
            通信状況を確認して、もう一度お試しください。
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={reset}>
            <RotateCcw aria-hidden="true" />
            再試行
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard" />}>
            <LayoutDashboard aria-hidden="true" />
            ダッシュボードへ
          </Button>
        </div>
      </div>
    </div>
  );
}
