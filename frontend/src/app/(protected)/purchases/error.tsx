"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PurchasesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-1"><h2 className="text-xl font-bold">購買処理一覧を読み込めませんでした</h2><p className="text-sm text-muted-foreground">時間をおいて再度お試しください。</p></div>
      <Button onClick={reset}>再試行</Button>
    </div>
  );
}
