"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useApproveRequest } from "@/features/approvals/hooks/use-approve-request";

type ApproveRequestDialogProps = { requestId: string; requestTitle: string; version: number };

export default function ApproveRequestDialog({ requestId, requestTitle, version }: ApproveRequestDialogProps) {
  const router = useRouter();
  const mutation = useApproveRequest();
  const [open, setOpen] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending && !nextOpen) return;
    setOpen(nextOpen);
    if (!nextOpen) { mutation.reset(); idempotencyKeyRef.current = null; }
  }

  async function handleApprove() {
    idempotencyKeyRef.current ??= crypto.randomUUID();
    try {
      await mutation.mutateAsync({ requestId, version, idempotencyKey: idempotencyKeyRef.current });
      setOpen(false);
      idempotencyKeyRef.current = null;
      router.refresh();
    } catch {
      // エラーはmutation.errorを通じてDialog内に表示する。
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button />}><Check aria-hidden="true" />承認する</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>この申請を承認しますか？</AlertDialogTitle>
          <AlertDialogDescription>「{requestTitle}」を承認します。</AlertDialogDescription>
        </AlertDialogHeader>
        {mutation.isError && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{mutation.error.message}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>戻る</AlertDialogCancel>
          <AlertDialogAction type="button" disabled={mutation.isPending} onClick={(event) => { event.preventDefault(); void handleApprove(); }}>
            <Check aria-hidden="true" />{mutation.isPending ? "承認中..." : "承認する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
