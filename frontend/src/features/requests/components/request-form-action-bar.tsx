import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import type { MouseEventHandler } from "react";

type RequestFormActionBarProps = {
  errorMessage?: string;
  onSaveDraft: MouseEventHandler<HTMLButtonElement>;
  isSubmitting: boolean;
  isSavingDraft: boolean;
  showSubmit?: boolean;
  saveLabel?: string;
  savingLabel?: string;
  successMessage?: string;
  isSaveDisabled?: boolean;
};

export default function RequestFormActionBar({
  errorMessage,
  onSaveDraft,
  isSubmitting,
  isSavingDraft,
  showSubmit = true,
  saveLabel = "下書き保存",
  savingLabel = "下書きを保存中です...",
  successMessage,
  isSaveDisabled = false,
}: RequestFormActionBarProps) {
  const isPending = isSubmitting || isSavingDraft;
  return (
    <div
      role="group"
      aria-label="申請操作"
      className="shrink-0 flex items-center gap-3 border-t bg-background px-4 pt-4  shadow-[0_-4px_12px_rgb(0_0_0/0.06)]"
    >
      <div className="min-w-0">
        <FieldError role="alert">{errorMessage}</FieldError>
        {!errorMessage && successMessage && (
          <p role="status" className="text-sm font-medium text-green-700 dark:text-green-300">
            {successMessage}
          </p>
        )}
      </div>
      <div className="ml-auto flex gap-3">
        <Button
          type="button"
          disabled={isPending || isSaveDisabled}
          variant="outline"
          onClick={onSaveDraft}
        >
          {isSavingDraft ? savingLabel : saveLabel}
        </Button>

        {showSubmit && (
          <Button disabled={isPending} type="submit">
            {isSubmitting ? "申請中です..." : "申請する"}
          </Button>
        )}
      </div>
    </div>
  );
}
