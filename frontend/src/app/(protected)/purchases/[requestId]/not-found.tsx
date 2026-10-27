import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PurchaseNotFound() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-1"><h2 className="text-xl font-bold">購買対象の申請が見つかりません</h2><p className="text-sm text-muted-foreground">対象が削除されたか、閲覧する権限がありません。</p></div>
      <Button nativeButton={false} render={<Link href="/purchases" />}>購買処理一覧へ戻る</Button>
    </div>
  );
}
