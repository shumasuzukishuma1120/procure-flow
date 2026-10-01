import type { Metadata } from "next";
import { myRequestListResponse } from "@/features/requests/mocks/my-request-list-response";
import MyRequestListTable from "@/features/requests/components/my-request-list-table";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "自分の申請",
};

export default function RequestsPage() {
  return (
    <>
      <div className="flex justify-between mx-5">
<h2 className="text-lg font-bold">
  自分の申請一覧
</h2>
        <Button
        variant={"outline"}
        nativeButton={false}
        render={<Link href="/requests/new" />}>
          <Plus aria-hidden="true"/>新規申請を作成
        </Button>
      </div>
      <MyRequestListTable items={myRequestListResponse.items} />
    </>
  );
}
