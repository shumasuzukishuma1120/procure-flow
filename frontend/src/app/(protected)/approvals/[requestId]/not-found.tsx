import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ApprovalNotFound() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-1"><h2 className="text-xl font-bold">承認対象の申請が見つかりません</h2><p className="text-sm text-muted-foreground">申請が取り消されたか、閲覧する権限がありません。</p></div>
      <Button nativeButton={false} render={<Link href="/approvals" />}>承認待ち一覧へ戻る</Button>
    </div>
  );
}
