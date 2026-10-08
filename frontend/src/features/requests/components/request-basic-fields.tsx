import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  dateOnlyStringToDate,
  dateToDateOnlyString,
} from "@/features/requests/forms/date-only-value";
import { ja } from "date-fns/locale";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SupplierOption } from "@/features/suppliers/types";
import { Controller, useFormContext } from "react-hook-form";
import { type DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";

type RequestBasicFieldsProps = {
  supplierOptions: SupplierOption[];
};

export default function RequestBasicFields({ supplierOptions }: RequestBasicFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<DraftRequestFormValues>();

  return (
    <FieldGroup>
      <Field data-invalid={!!errors.title}>
        <FieldLabel htmlFor="title">タイトル</FieldLabel>
        <Input
          id="title"
          type="text"
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-description title-error" : "title-description"}
        />
        <FieldDescription id="title-description">100文字以内で入力してください</FieldDescription>
        <FieldError id="title-error" errors={[errors.title]} />
      </Field>

      <Field data-invalid={!!errors.reason}>
        <FieldLabel htmlFor="reason">申請理由</FieldLabel>
        <Textarea
          id="reason"
          {...register("reason")}
          aria-invalid={!!errors.reason}
          aria-describedby={
            errors.reason ? "reason-description reason-error" : "reason-description"
          }
        />
        <FieldDescription id="reason-description">1,000文字以内で入力してください</FieldDescription>
        <FieldError id="reason-error" errors={[errors.reason]} />
      </Field>

      <Controller
        name="desiredDeliveryDate"
        control={control}
        render={({ field, fieldState }) => {
          const date = dateOnlyStringToDate(field.value);
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="desiredDeliveryDate">希望納期</FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      id="desiredDeliveryDate"
                      className="justify-start font-normal"
                      onBlur={field.onBlur}
                      ref={field.ref}
                      aria-invalid={fieldState.invalid}
                      type="button"
                      aria-describedby={
                        fieldState.error
                          ? "desiredDeliveryDate-description desiredDeliveryDate-error"
                          : "desiredDeliveryDate-description"
                      }
                    >
                      {date ? format(date, "PPP", { locale: ja }) : <span>日付を選択</span>}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    autoFocus
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => field.onChange(dateToDateOnlyString(selectedDate))}
                    defaultMonth={date}
                  />
                </PopoverContent>
              </Popover>
              <FieldDescription id="desiredDeliveryDate-description">
                購入を希望する日付を選択してください
              </FieldDescription>
              <FieldError id="desiredDeliveryDate-error" errors={[fieldState.error]} />
            </Field>
          );
        }}
      />

      <Controller
        name="requestedSupplierId"
        control={control}
        render={({ field, fieldState }) => {
          const selectedSupplier =
            supplierOptions.find((supplier) => supplier.id === field.value) ?? null;

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="requestedSupplierId">希望仕入先</FieldLabel>

              <Combobox
                items={supplierOptions}
                value={selectedSupplier}
                onValueChange={(supplier) => {
                  field.onChange(supplier?.id ?? "");
                }}
                itemToStringLabel={(supplier) => supplier.name}
                itemToStringValue={(supplier) => supplier.id}
                isItemEqualToValue={(supplier, value) => supplier.id === value.id}
                autoHighlight
              >
                <ComboboxInput
                  id="requestedSupplierId"
                  ref={field.ref}
                  onBlur={field.onBlur}
                  placeholder="検索"
                  showClear
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.error
                      ? "requestedSupplierId-description requestedSupplierId-error"
                      : "requestedSupplierId-description"
                  }
                />
                <ComboboxContent>
                  <ComboboxEmpty>仕入れ先が見つかりません</ComboboxEmpty>
                  <ComboboxList>
                    {(supplier) => (
                      <ComboboxItem key={supplier.id} value={supplier}>
                        {supplier.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <FieldDescription id="requestedSupplierId-description">
                希望する仕入れ先を選択してください
              </FieldDescription>
              <FieldError id="requestedSupplierId-error" errors={[fieldState.error]} />
            </Field>
          );
        }}
      />

      <Field data-invalid={!!errors.note}>
        <FieldLabel htmlFor="note">備考（任意）</FieldLabel>
        <Textarea
          id="note"
          {...register("note")}
          aria-invalid={!!errors.note}
          aria-describedby={errors.note ? "note-description note-error" : "note-description"}
        />
        <FieldDescription id="note-description">
          補足事項がある場合は1,000文字以内で入力してください
        </FieldDescription>
        <FieldError id="note-error" errors={[errors.note]} />
      </Field>
    </FieldGroup>
  );
}
