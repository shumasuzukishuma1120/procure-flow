"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteDraftRequest } from "@/features/requests/hooks/use-delete-draft-request";
import { Trash } from "lucide-react";
import { useState } from "react";

type DeleteDraftRequestDialogProps = {
  requestId: string;
  requestTitle: string | null;
  version: number;
  onSuccess?: () => void;
};

export default function DeleteDraftRequestDialog({
  requestId,
  requestTitle,
  version,
  onSuccess,
}: DeleteDraftRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteDraftMutation = useDeleteDraftRequest();

  const handleOpenChange = (nextOpen: boolean) => {
    if (deleteDraftMutation.isPending && !nextOpen) return;

    setOpen(nextOpen);
    if (!nextOpen) {
      deleteDraftMutation.reset();
    }
  };

  const handleConfirm = async () => {
    try {
      await deleteDraftMutation.mutateAsync({ requestId, version });
      setOpen(false);
      onSuccess?.();
    } catch {
      // エラーはdeleteDraftMutation.errorを通じてDialog内に表示する。
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button variant="destructive" size="default" />}>
        <Trash aria-hidden="true" />
        削除
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>下書きを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{requestTitle ?? "タイトル未入力"}」を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteDraftMutation.isError && (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {deleteDraftMutation.error.message}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteDraftMutation.isPending}>戻る</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            variant="destructive"
            disabled={deleteDraftMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm(); // Promiseの結果を使わない
            }}
          >
            <Trash aria-hidden="true" />
            {deleteDraftMutation.isPending ? "削除中..." : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
