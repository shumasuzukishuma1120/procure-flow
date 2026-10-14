import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function FormFieldSkeleton({ multiline = false }: { multiline?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-28" />
      <Skeleton className={multiline ? "h-20 w-full" : "h-8 w-full"} />
      <Skeleton className="h-4 w-56 max-w-full" />
    </div>
  );
}

export default function CreateRequestFormSkeleton() {
  return (
    <div
      role="status"
      aria-label="新規申請フォームを読み込んでいます"
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      <span className="sr-only">新規申請フォームを読み込んでいます</span>

      <div aria-hidden="true" className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-5">
        <Skeleton className="h-7 w-24" />

        <div className="space-y-6">
          <FormFieldSkeleton />
          <FormFieldSkeleton multiline />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton multiline />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-8 w-28" />
            </div>
          </CardHeader>
          <CardContent>
            <Card className="min-w-0 shadow">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <FormFieldSkeleton />
                <FormFieldSkeleton />
                <FormFieldSkeleton />
                <FormFieldSkeleton />
                <FormFieldSkeleton />
                <FormFieldSkeleton />
                <FormFieldSkeleton />
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-36" />
        </div>
      </div>

      <div aria-hidden="true" className="flex shrink-0 items-center justify-end gap-3 border-t bg-background px-4 pt-4 shadow-[0_-4px_12px_rgb(0_0_0/0.06)]">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
