import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type DashboardMetricTone = "blue" | "green" | "orange" | "violet";

type DashboardMetricProps = {
  label: string;
  count: number;
  icon: LucideIcon;
  tone: DashboardMetricTone;
};

const TONE_STYLES = {
  blue: {
    tile: "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/30",
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  orange: {
    tile:
      "border-orange-200 bg-orange-50/70 dark:border-orange-900 dark:bg-orange-950/30",
    icon: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  green: {
    tile:
      "border-green-200 bg-green-50/70 dark:border-green-900 dark:bg-green-950/30",
    icon: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  violet: {
    tile:
      "border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/30",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
} satisfies Record<DashboardMetricTone, { tile: string; icon: string }>;

export default function DashboardMetric({
  label,
  count,
  icon: Icon,
  tone,
}: DashboardMetricProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border p-4", styles.tile)}>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-md",
          styles.icon,
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="truncate text-sm text-muted-foreground">{label}</dt>
        <dd className="mt-1 text-2xl font-semibold tabular-nums">
          {count}
          <span className="ml-1 text-sm font-normal text-muted-foreground">件</span>
        </dd>
      </div>
    </div>
  );
}
