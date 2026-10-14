import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ja } from "date-fns/locale";
import { useSearchParams, useRouter } from "next/navigation";
import { isDateOnlyValue } from "@/features/requests/utils/is-date-only-value";
import {
  dateOnlyStringToDate,
  dateToDateOnlyString,
} from "@/features/requests/forms/date-only-value";

export function MyRequestCreatedDateRangeFilter() {
  const searchParams = useSearchParams();
  const createdFromParam = searchParams.get("createdFrom");
  const createdToParam = searchParams.get("createdTo");
  const parsedCreatedFrom = isDateOnlyValue(createdFromParam)
    ? dateOnlyStringToDate(createdFromParam)
    : undefined;
  const parsedCreatedTo = isDateOnlyValue(createdToParam)
    ? dateOnlyStringToDate(createdToParam)
    : undefined;

  const appliedDateRange: DateRange | undefined =
    parsedCreatedFrom || parsedCreatedTo
      ? {
          from: parsedCreatedFrom,
          to: parsedCreatedTo,
        }
      : undefined;

  const [draftDateRange, setDraftDateRange] = React.useState<DateRange | undefined>(
    appliedDateRange,
  );
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if(isOpen){
      setDraftDateRange(appliedDateRange);
    }
    setOpen(isOpen);
  };

  const router = useRouter();

  const handleApply = () => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    const createdFrom = draftDateRange?.from;
    const createdTo = draftDateRange?.to;

    if (!createdFrom || !createdTo) return;

    nextSearchParams.set("createdFrom", dateToDateOnlyString(createdFrom));
    nextSearchParams.set("createdTo", dateToDateOnlyString(createdTo));
    nextSearchParams.set("page", "0");

    router.replace(`/requests?${nextSearchParams.toString()}`);
    setOpen(false);
  };

  const handleClear = () => {
    setDraftDateRange(undefined);
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("createdFrom");
    nextSearchParams.delete("createdTo");
    nextSearchParams.set("page", "0");

    router.replace(`/requests?${nextSearchParams.toString()}`);
    setOpen(false);
  };

  return (
    <Field className="mx-auto w-fit">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          type="button"
          render={
            <Button
              type="button"
              variant="outline"
              id="date-picker-range"
              className="justify-center px-3 font-medium"
            >
              <CalendarIcon />
              {appliedDateRange?.from ? (
                appliedDateRange.to ? (
                  <>
                    {format(appliedDateRange.from, "PPP", { locale: ja })} -{" "}
                    {format(appliedDateRange.to, "PPP", { locale: ja })}
                  </>
                ) : (
                  format(appliedDateRange.from, "PPP", { locale: ja })
                )
              ) : (
                <span>作成日を選択</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-4" align="start">
          <Calendar
            mode="range"
            defaultMonth={draftDateRange?.from}
            selected={draftDateRange}
            onSelect={setDraftDateRange}
            numberOfMonths={2}
            locale={ja}
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="flex-1 min-w-0"
              variant="outline"
              onClick={handleClear}
            >
              クリア
            </Button>
            <Button
              type="button"
              className="flex-1 min-w-0"
              variant="default"
              onClick={handleApply}
              disabled={!draftDateRange?.from || !draftDateRange?.to}
            >
              適用
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
