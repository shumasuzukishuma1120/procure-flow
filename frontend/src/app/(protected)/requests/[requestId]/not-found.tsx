import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RequestNotFound() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">申請が見つかりません</h2>
        <p className="text-sm text-muted-foreground">
          申請が削除されたか、この申請を閲覧する権限がありません。
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/requests" />}>
        自分の申請一覧へ戻る
      </Button>
    </div>
  );
}
