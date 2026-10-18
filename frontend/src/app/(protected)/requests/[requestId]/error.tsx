"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function RequestDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);

  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">申請情報を読み込めませんでした</h2>
        <p className="text-sm text-muted-foreground">
          時間をおいて再度お試しください。解消しない場合は管理者へお問い合わせください。
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" nativeButton={false} render={<Link href="/requests" />}>
          一覧へ戻る
        </Button>
        <Button onClick={reset}>再試行</Button>
      </div>
    </div>
  );
}
