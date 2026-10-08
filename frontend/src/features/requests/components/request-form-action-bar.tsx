import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import type { MouseEventHandler } from "react";

type RequestFormActionBarProps = {
  errorMessage?: string;
  onSaveDraft: MouseEventHandler<HTMLButtonElement>;
  isSubmitting: boolean;
  isSavingDraft: boolean;
};

export default function RequestFormActionBar({
  errorMessage,
  onSaveDraft,
  isSubmitting,
  isSavingDraft,
}: RequestFormActionBarProps) {
  const isPending = isSubmitting || isSavingDraft;
  return (
    <div
      role="group"
      aria-label="申請操作"
      className="shrink-0 flex items-center gap-3 border-t bg-background px-4 py-4 shadow-[0_-4px_12px_rgb(0_0_0/0.06)]"
    >
      <FieldError role="alert">{errorMessage}</FieldError>
      <div className="ml-auto flex gap-3">
        <Button type="button" disabled={isPending} variant="outline" onClick={onSaveDraft}>
          {isSavingDraft ? "下書きを保存中です..." : "下書き保存"}
        </Button>

        <Button disabled={isPending} type="submit">
          {isSubmitting ? "申請中です..." : "申請する"}
        </Button>
      </div>
    </div>
  );
}
