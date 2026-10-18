"use client";

import { useId, useState, type FormEvent } from "react";
import { EraserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCancelSubmittedRequest } from "@/features/requests/hooks/use-cancel-submitted-request";

const MAX_CANCELLATION_REASON_LENGTH = 500;

type CancelSubmittedRequestDialogProps = {
  requestId: string;
  requestTitle: string | null;
  version: number;
  onSuccess?: () => void;
};

export default function CancelSubmittedRequestDialog({
  requestId,
  requestTitle,
  version,
  onSuccess,
}: CancelSubmittedRequestDialogProps) {
  const reasonId = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const cancelRequestMutation = useCancelSubmittedRequest();

  const normalizedReason = reason.trim();
  const canSubmit = normalizedReason.length > 0 && !cancelRequestMutation.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (cancelRequestMutation.isPending && !nextOpen) return;

    setOpen(nextOpen);

    if (!nextOpen) {
      setReason("");
      cancelRequestMutation.reset();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    try {
      await cancelRequestMutation.mutateAsync({
        requestId,
        version,
        reason: normalizedReason,
      });
      setOpen(false);
      setReason("");
      onSuccess?.();
    } catch {
      // MutationのErrorをDialog内へ表示する。
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" size="default" />}>
        <EraserIcon aria-hidden="true" />
        取消
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={!cancelRequestMutation.isPending}>
        <form className="contents" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>申請を取り消しますか？</DialogTitle>
            <DialogDescription>
              「{requestTitle ?? "タイトル未入力"}」を取り消します。取消理由は後から変更できません。
            </DialogDescription>
          </DialogHeader>

          <Field>
            <FieldLabel htmlFor={reasonId}>取消理由</FieldLabel>
            <Textarea
              id={reasonId}
              name="cancellationReason"
              value={reason}
              maxLength={MAX_CANCELLATION_REASON_LENGTH}
              disabled={cancelRequestMutation.isPending}
              required
              aria-describedby={`${reasonId}-description`}
              onChange={(event) => setReason(event.target.value)}
            />
            <FieldDescription id={`${reasonId}-description`}>
              取消理由を{MAX_CANCELLATION_REASON_LENGTH}文字以内で入力してください（必須）
            </FieldDescription>
          </Field>

          {cancelRequestMutation.isError && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              {cancelRequestMutation.error.message}
            </p>
          )}

          <DialogFooter>
            <DialogClose
              disabled={cancelRequestMutation.isPending}
              render={<Button type="button" variant="outline" />}
            >
              戻る
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={!canSubmit}>
              <EraserIcon aria-hidden="true" />
              {cancelRequestMutation.isPending ? "取消中..." : "申請を取り消す"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
