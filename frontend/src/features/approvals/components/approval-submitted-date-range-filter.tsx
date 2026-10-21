import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dateOnlyStringToDate, dateToDateOnlyString } from "@/features/requests/forms/date-only-value";
import { isDateOnlyValue } from "@/features/requests/utils/is-date-only-value";

export default function ApprovalSubmittedDateRangeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromParam = searchParams.get("submittedFrom");
  const toParam = searchParams.get("submittedTo");
  const applied: DateRange | undefined = isDateOnlyValue(fromParam) || isDateOnlyValue(toParam)
    ? {
        from: isDateOnlyValue(fromParam) ? dateOnlyStringToDate(fromParam) : undefined,
        to: isDateOnlyValue(toParam) ? dateOnlyStringToDate(toParam) : undefined,
      }
    : undefined;
  const [draft, setDraft] = useState<DateRange | undefined>(applied);
  const [open, setOpen] = useState(false);

  function update(from?: Date, to?: Date) {
    const next = new URLSearchParams(searchParams.toString());
    if (from) next.set("submittedFrom", dateToDateOnlyString(from));
    else next.delete("submittedFrom");
    if (to) next.set("submittedTo", dateToDateOnlyString(to));
    else next.delete("submittedTo");
    next.set("page", "0");
    router.replace(`/approvals?${next.toString()}`);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={(value) => { if (value) setDraft(applied); setOpen(value); }}>
      <PopoverTrigger type="button" render={
        <Button type="button" variant="outline" className="w-full justify-center md:w-auto">
          <CalendarIcon />
          {applied?.from && applied.to
            ? `${format(applied.from, "PPP", { locale: ja })} - ${format(applied.to, "PPP", { locale: ja })}`
            : "提出日を選択"}
        </Button>
      } />
      <PopoverContent className="w-auto p-4" align="start">
        <Calendar mode="range" defaultMonth={draft?.from} selected={draft} onSelect={setDraft} numberOfMonths={2} locale={ja} />
        <div className="flex gap-3">
          <Button className="flex-1" type="button" variant="outline" onClick={() => { setDraft(undefined); update(); }}>クリア</Button>
          <Button className="flex-1" type="button" disabled={!draft?.from || !draft.to} onClick={() => update(draft?.from, draft?.to)}>適用</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
