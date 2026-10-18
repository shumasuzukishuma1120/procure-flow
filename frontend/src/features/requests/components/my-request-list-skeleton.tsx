import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SKELETON_ROW_COUNT = 5;

export default function MyRequestListSkeleton() {
  return (
    <div role="status" aria-label="申請一覧を読み込んでいます" className="space-y-4">
      <span className="sr-only">申請一覧を読み込んでいます</span>

      <div aria-hidden="true" className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap">
        <Skeleton className="h-8 w-full flex-1 md:min-w-72" />
        <Skeleton className="h-8 w-full md:w-64" />
        <Skeleton className="h-8 w-full md:w-44" />
        <Skeleton className="h-8 w-full md:w-52" />
        <Skeleton className="h-8 w-full md:w-36" />
        <Skeleton className="h-8 w-full md:w-28" />
      </div>

      <div aria-hidden="true">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>申請番号</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>明細概要</TableHead>
              <TableHead>希望仕入先</TableHead>
              <TableHead>合計金額</TableHead>
              <TableHead>最終更新日時</TableHead>
              <TableHead className="sr-only">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-8 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div aria-hidden="true" className="flex items-center justify-center gap-10 border-t pt-4">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
