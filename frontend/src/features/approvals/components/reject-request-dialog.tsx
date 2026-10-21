"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useRejectRequest } from "@/features/approvals/hooks/use-reject-request";

const MAX_REASON_LENGTH = 500;
type RejectRequestDialogProps = { requestId: string; requestTitle: string; version: number };

export default function RejectRequestDialog({ requestId, requestTitle, version }: RejectRequestDialogProps) {
  const router = useRouter();
  const reasonId = useId();
  const mutation = useRejectRequest();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const idempotencyRef = useRef<{ reason: string; key: string } | null>(null);
  const normalizedReason = reason.trim();
  const canSubmit = normalizedReason.length > 0 && !mutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending && !nextOpen) return;
    setOpen(nextOpen);
    if (!nextOpen) { setReason(""); mutation.reset(); idempotencyRef.current = null; }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    if (idempotencyRef.current?.reason !== normalizedReason) {
      idempotencyRef.current = { reason: normalizedReason, key: crypto.randomUUID() };
    }
    try {
      await mutation.mutateAsync({
        requestId,
        version,
        reason: normalizedReason,
        idempotencyKey: idempotencyRef.current.key,
      });
      setOpen(false);
      setReason("");
      idempotencyRef.current = null;
      router.refresh();
    } catch {
      // エラーはmutation.errorを通じてDialog内に表示する。
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" />}><X aria-hidden="true" />却下する</DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={!mutation.isPending}>
        <form className="contents" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>この申請を却下しますか？</DialogTitle>
            <DialogDescription>「{requestTitle}」を却下します。理由は申請者へ共有されます。</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor={reasonId}>却下理由</FieldLabel>
            <Textarea id={reasonId} value={reason} required maxLength={MAX_REASON_LENGTH} disabled={mutation.isPending} aria-describedby={`${reasonId}-description`} onChange={(event) => setReason(event.target.value)} />
            <FieldDescription id={`${reasonId}-description`}>却下理由を{MAX_REASON_LENGTH}文字以内で入力してください（必須）</FieldDescription>
          </Field>
          {mutation.isError && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{mutation.error.message}</p>}
          <DialogFooter>
            <DialogClose disabled={mutation.isPending} render={<Button type="button" variant="outline" />}>戻る</DialogClose>
            <Button type="submit" variant="destructive" disabled={!canSubmit}><X aria-hidden="true" />{mutation.isPending ? "却下中..." : "却下する"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
