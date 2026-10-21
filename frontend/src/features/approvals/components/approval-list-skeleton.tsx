import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ApprovalListSkeleton() {
  return (
    <div role="status" aria-label="承認待ち一覧を読み込んでいます" className="space-y-4">
      <span className="sr-only">承認待ち一覧を読み込んでいます</span>
      <div aria-hidden="true" className="flex flex-col gap-3 md:flex-row">
        <Skeleton className="h-8 flex-1" /><Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-40" /><Skeleton className="h-8 w-52" />
        <Skeleton className="h-8 w-48" /><Skeleton className="h-8 w-28" />
      </div>
      <Table aria-hidden="true">
        <TableHeader><TableRow>
          {['申請','申請者','希望仕入先','合計金額','提出日時','希望納期'].map((label) => <TableHead key={label}>{label}</TableHead>)}
        </TableRow></TableHeader>
        <TableBody>{Array.from({ length: 5 }, (_, index) => (
          <TableRow key={index}>{Array.from({ length: 6 }, (_, cell) => <TableCell key={cell}><Skeleton className="h-5 w-28" /></TableCell>)}</TableRow>
        ))}</TableBody>
      </Table>
      <Skeleton aria-hidden="true" className="mx-auto h-8 w-80" />
    </div>
  );
}
