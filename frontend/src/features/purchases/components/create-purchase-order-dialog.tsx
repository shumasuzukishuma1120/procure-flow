"use client";

import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePurchaseOrder } from "@/features/purchases/hooks/use-create-purchase-order";
import {
  purchaseOrderFormSchema,
  type PurchaseOrderFormValues,
} from "@/features/purchases/schemas/purchase-action-schema";
import type { PurchaseDetailResponse } from "@/features/purchases/types";
import type { SupplierOption } from "@/features/suppliers/types";

export default function CreatePurchaseOrderDialog({
  request,
  supplierOptions,
}: {
  request: PurchaseDetailResponse;
  supplierOptions: SupplierOption[];
}) {
  const router = useRouter();
  const mutation = useCreatePurchaseOrder();
  const [open, setOpen] = useState(false);
  const attemptRef = useRef<{ fingerprint: string; idempotencyKey: string } | null>(null);
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      actualSupplierId: request.requestedSupplierId,
      purchaseOrderNumber: "",
      promisedDeliveryDate: request.desiredDeliveryDate,
      purchaserNote: "",
      items: request.items.map((item) => ({
        requestItemId: item.requestItemId,
        actualUnitPrice: item.plannedUnitPrice,
      })),
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending && !nextOpen) return;
    setOpen(nextOpen);
    if (!nextOpen) { mutation.reset(); attemptRef.current = null; }
  }

  const submitValues: SubmitHandler<PurchaseOrderFormValues> = async (values) => {
    const apiRequest = {
      version: request.version,
      actualSupplierId: values.actualSupplierId,
      purchaseOrderNumber: values.purchaseOrderNumber.trim(),
      promisedDeliveryDate: values.promisedDeliveryDate,
      purchaserNote: values.purchaserNote.trim() || null,
      items: values.items,
    };
    const fingerprint = JSON.stringify(apiRequest);
    if (attemptRef.current?.fingerprint !== fingerprint) {
      attemptRef.current = { fingerprint, idempotencyKey: crypto.randomUUID() };
    }
    try {
      await mutation.mutateAsync({
        requestId: request.requestId,
        request: apiRequest,
        idempotencyKey: attemptRef.current.idempotencyKey,
      });
      attemptRef.current = null;
      setOpen(false);
      router.refresh();
    } catch {
      // エラーはmutation.errorを通じてDialog内に表示する。
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    void form.handleSubmit(submitValues)(event);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}><ShoppingCart aria-hidden="true" />発注登録</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>発注内容を登録</DialogTitle>
          <DialogDescription>「{request.title}」の実際の仕入先・単価・納期を入力します。</DialogDescription>
        </DialogHeader>
        <form id="purchase-order-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Controller
            name="actualSupplierId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="actualSupplierId">仕入先</FieldLabel>
                <Select
                  items={supplierOptions.map((supplier) => ({ value: supplier.id, label: supplier.name }))}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger id="actualSupplierId" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="仕入先を選択" />
                  </SelectTrigger>
                  <SelectContent><SelectGroup>
                    {supplierOptions.map((supplier) => <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>)}
                  </SelectGroup></SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.purchaseOrderNumber}>
              <FieldLabel htmlFor="purchaseOrderNumber">発注番号</FieldLabel>
              <Input id="purchaseOrderNumber" {...form.register("purchaseOrderNumber")} aria-invalid={!!form.formState.errors.purchaseOrderNumber} />
              <FieldError errors={[form.formState.errors.purchaseOrderNumber]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.promisedDeliveryDate}>
              <FieldLabel htmlFor="promisedDeliveryDate">納品予定日</FieldLabel>
              <Input id="promisedDeliveryDate" type="date" {...form.register("promisedDeliveryDate")} aria-invalid={!!form.formState.errors.promisedDeliveryDate} />
              <FieldError errors={[form.formState.errors.promisedDeliveryDate]} />
            </Field>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">実発注単価</h3>
            {request.items.map((item, index) => (
              <div key={item.requestItemId} className="grid items-end gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_12rem]">
                <div><p className="font-medium">{item.productName}</p><p className="text-xs text-muted-foreground">数量 {item.quantity} / 予定単価 ¥{item.plannedUnitPrice.toLocaleString("ja-JP")}</p></div>
                <Field data-invalid={!!form.formState.errors.items?.[index]?.actualUnitPrice}>
                  <FieldLabel htmlFor={`actualUnitPrice-${index}`}>実単価</FieldLabel>
                  <Input id={`actualUnitPrice-${index}`} type="number" min={1} max={99999999} {...form.register(`items.${index}.actualUnitPrice`, { valueAsNumber: true })} aria-invalid={!!form.formState.errors.items?.[index]?.actualUnitPrice} />
                  <FieldError errors={[form.formState.errors.items?.[index]?.actualUnitPrice]} />
                </Field>
              </div>
            ))}
          </div>
          <Field data-invalid={!!form.formState.errors.purchaserNote}>
            <FieldLabel htmlFor="purchaserNote">購買担当者メモ（任意）</FieldLabel>
            <Textarea id="purchaserNote" {...form.register("purchaserNote")} aria-invalid={!!form.formState.errors.purchaserNote} />
            <FieldError errors={[form.formState.errors.purchaserNote]} />
          </Field>
          {mutation.isError && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{mutation.error.message}</p>}
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => setOpen(false)}>戻る</Button>
          <Button form="purchase-order-form" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "登録中..." : "発注登録"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
