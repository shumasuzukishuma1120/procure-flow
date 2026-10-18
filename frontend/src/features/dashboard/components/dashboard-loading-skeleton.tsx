import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSectionSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid grid-cols-2 gap-3 md:grid-cols-4"}>
          {Array.from({ length: compact ? 2 : 8 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="ダッシュボードを読み込んでいます">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="space-y-6">
        <DashboardSectionSkeleton />
        <DashboardSectionSkeleton compact />
        <DashboardSectionSkeleton compact />
      </div>
      <span className="sr-only">ダッシュボードを読み込んでいます</span>
    </div>
  );
}
