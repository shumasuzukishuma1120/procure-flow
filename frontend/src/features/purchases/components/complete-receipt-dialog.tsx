"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCompleteReceipt } from "@/features/purchases/hooks/use-complete-receipt";
import { receiptFormSchema, type ReceiptFormValues } from "@/features/purchases/schemas/purchase-action-schema";
import type { PurchaseDetailResponse } from "@/features/purchases/types";

function todayInJapan() {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export default function CompleteReceiptDialog({ request }: { request: PurchaseDetailResponse }) {
  const router = useRouter();
  const mutation = useCompleteReceipt();
  const [open, setOpen] = useState(false);
  const attemptRef = useRef<{ fingerprint: string; idempotencyKey: string } | null>(null);
  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: { receivedDate: todayInJapan(), receiptNote: "", allItemsReceived: false },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending && !nextOpen) return;
    setOpen(nextOpen);
    if (!nextOpen) { mutation.reset(); attemptRef.current = null; }
  }

  const submitValues: SubmitHandler<ReceiptFormValues> = async (values) => {
    const apiRequest = {
      version: request.version,
      receivedDate: values.receivedDate,
      receiptNote: values.receiptNote.trim() || null,
      allItemsReceived: values.allItemsReceived,
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
      <DialogTrigger render={<Button />}><PackageCheck aria-hidden="true" />受領登録</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>受領内容を登録</DialogTitle><DialogDescription>「{request.title}」の納品完了を記録します。</DialogDescription></DialogHeader>
        <form id="receipt-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Field data-invalid={!!form.formState.errors.receivedDate}>
            <FieldLabel htmlFor="receivedDate">受領日</FieldLabel>
            <Input id="receivedDate" type="date" max={todayInJapan()} {...form.register("receivedDate")} aria-invalid={!!form.formState.errors.receivedDate} />
            <FieldError errors={[form.formState.errors.receivedDate]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.receiptNote}>
            <FieldLabel htmlFor="receiptNote">受領メモ（任意）</FieldLabel>
            <Textarea id="receiptNote" {...form.register("receiptNote")} aria-invalid={!!form.formState.errors.receiptNote} />
            <FieldError errors={[form.formState.errors.receiptNote]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.allItemsReceived}>
            <label className="flex items-center gap-2 text-sm font-medium" htmlFor="allItemsReceived">
              <input id="allItemsReceived" type="checkbox" className="size-4" {...form.register("allItemsReceived")} />
              全商品を受領したことを確認しました
            </label>
            <FieldError errors={[form.formState.errors.allItemsReceived]} />
          </Field>
          {mutation.isError && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{mutation.error.message}</p>}
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => setOpen(false)}>戻る</Button>
          <Button form="receipt-form" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "登録中..." : "受領登録"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
