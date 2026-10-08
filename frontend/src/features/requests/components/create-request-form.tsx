"use client";

import { FieldLegend, FieldSet } from "@/components/ui/field";
import { createDraftRequestFormDefaultValues } from "@/features/requests/forms/request-form-default-values";
import {
  draftRequestFormSchema,
  submitRequestFormSchema,
  type DraftRequestFormValues,
} from "@/features/requests/schemas/request-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, type SubmitHandler, type Resolver, useForm } from "react-hook-form";
import { type SupplierOption } from "@/features/suppliers/types";
import type { CategoryOption } from "@/features/categories/types";
import { useRef, type SubmitEventHandler, type MouseEventHandler } from "react";
import RequestFormActionBar from "@/features/requests/components/request-form-action-bar";
import RequestBasicFields from "@/features/requests/components/request-basic-fields";
import RequestItemsFieldArray from "@/features/requests/components/request-items-field-array";
import RequestTotalAmountField from "@/features/requests/components/request-total-amount-field";
import { useCreateRequestSubmission } from "@/features/requests/hooks/use-create-request-submission";
import { toCreateRequestSubmissionRequest } from "@/features/requests/api/to-create-request-submission-request";
import { ApiError } from "@/lib/api/api-error";
import { useRouter } from "next/navigation";
import { toRequestFormFieldPath } from "@/features/requests/forms/to-request-form-field-path";
import { useCreateDraftRequest } from "@/features/requests/hooks/use-create-draft-request";
import { toCreateDraftRequest } from "@/features/requests/api/to-create-draft-request";

function hasDraftContent(values: DraftRequestFormValues): boolean {
  const hasRequestContent = [
    values.title,
    values.reason,
    values.desiredDeliveryDate,
    values.requestedSupplierId,
    values.note,
  ].some((value) => value.trim() !== "");

  const hasRequestItemContent = values.items.some((item) => {
    const hasTextContent = [
      item.productName,
      item.modelNumber,
      item.productUrl,
      item.categoryId,
    ].some((value) => value.trim() !== "");

    const hasNumberContent = item.quantity !== undefined || item.plannedUnitPrice !== undefined;

    return hasTextContent || hasNumberContent;
  });

  return hasRequestContent || hasRequestItemContent;
}

type RequestFormValidationIntent = "draft" | "submit";

const draftRequestResolver: Resolver<DraftRequestFormValues> = zodResolver(draftRequestFormSchema);

const submitRequestResolver: Resolver<DraftRequestFormValues> = zodResolver<
  DraftRequestFormValues,
  unknown,
  DraftRequestFormValues
>(submitRequestFormSchema);

type SubmissionAttempt = {
  idempotencyKey: string;
  requestFingerprint: string;
};
type DraftCreationAttempt = {
  idempotencyKey: string;
  requestFingerprint: string;
};

export default function CreateRequestForm({
  supplierOptions,
  categoryOptions,
}: {
  supplierOptions: SupplierOption[];
  categoryOptions: CategoryOption[];
}) {
  const validationIntentRef = useRef<RequestFormValidationIntent>("draft");

  const submissionAttemptRef = useRef<SubmissionAttempt | null>(null);
  const draftCreationAttemptRef = useRef<DraftCreationAttempt | null>(null);

  const createSubmissionMutation = useCreateRequestSubmission();
  const createDraftMutation = useCreateDraftRequest();

  const requestFormResolver: Resolver<DraftRequestFormValues> = (values, context, options) => {
    const resolver =
      validationIntentRef.current === "draft" ? draftRequestResolver : submitRequestResolver;

    return resolver(values, context, options);
  };
  const form = useForm<DraftRequestFormValues>({
    resolver: requestFormResolver,
    defaultValues: createDraftRequestFormDefaultValues(),
    mode: "onBlur",
  });

  const {
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = form;

  const router = useRouter();

  const onSubmitRequest: SubmitHandler<DraftRequestFormValues> = (data) => {
    const submitValues = submitRequestFormSchema.parse(data);

    const request = toCreateRequestSubmissionRequest(submitValues);

    const requestFingerprint = JSON.stringify(request);
    const previousAttempt = submissionAttemptRef.current;

    const idempotencyKey =
      previousAttempt?.requestFingerprint === requestFingerprint
        ? previousAttempt.idempotencyKey
        : crypto.randomUUID();

    submissionAttemptRef.current = { idempotencyKey, requestFingerprint };

    createSubmissionMutation.mutate(
      {
        request,
        idempotencyKey,
      },
      {
        onSuccess: (response) => {
          submissionAttemptRef.current = null;
          router.replace(`/requests/${encodeURIComponent(response.requestId)}`);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 422) {
            submissionAttemptRef.current = null;
          }
          if (error instanceof ApiError && error.status === 400) {
            submissionAttemptRef.current = null;

            const itemCount = form.getValues("items").length;
            let shouldFocus = true;

            for (const fieldError of error.problem?.fieldErrors ?? []) {
              const formFieldPath = toRequestFormFieldPath(fieldError.field, itemCount);

              if (formFieldPath === null) {
                continue;
              }

              setError(
                formFieldPath,
                {
                  type: fieldError.code,
                  message: fieldError.message,
                },
                { shouldFocus },
              );
              shouldFocus = false;
            }
          }
        },
      },
    );
  };

  const onSaveDraft: SubmitHandler<DraftRequestFormValues> = (data) => {
    if (!hasDraftContent(data)) {
      setError("root.draft", {
        type: "manual",
        message: "下書き保存するには、いずれかの項目を入力してください",
      });
      return;
    }
    clearErrors("root.draft");

    const request = toCreateDraftRequest(data);

    const requestFingerprint = JSON.stringify(request);
    const previousAttempt = draftCreationAttemptRef.current;

    const idempotencyKey =
      previousAttempt?.requestFingerprint === requestFingerprint
        ? previousAttempt.idempotencyKey
        : crypto.randomUUID();

    draftCreationAttemptRef.current = {
      idempotencyKey,
      requestFingerprint,
    };

    createDraftMutation.mutate(
      {
        request,
        idempotencyKey,
      },
      {
        onSuccess: (response) => {
          draftCreationAttemptRef.current = null;
          router.replace(`/requests/${encodeURIComponent(response.requestId)}/edit`);
        },
      },
    );
  };

  const handleSaveDraftClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    validationIntentRef.current = "draft";

    const validateAndSave = handleSubmit(onSaveDraft);
    void validateAndSave(event);
  };

  const handleRequestFormSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    validationIntentRef.current = "submit";

    const validateAndSubmit = handleSubmit(onSubmitRequest);
    void validateAndSubmit(event);
  };

  const submissionError = createSubmissionMutation.error;
  const currentItemCount = form.getValues("items").length;

  const hasMappedFieldError =
    submissionError instanceof ApiError &&
    submissionError.status === 400 &&
    (submissionError.problem?.fieldErrors.some(
      (fieldError) => toRequestFormFieldPath(fieldError.field, currentItemCount) !== null,
    ) ??
      false);

  let submissionErrorMessage: string | undefined;

  if (submissionError instanceof ApiError) {
    if (!hasMappedFieldError) {
      submissionErrorMessage = submissionError.message;
    }
  } else if (createSubmissionMutation.isError) {
    submissionErrorMessage = "申請処理に失敗しました。時間をおいて再度お試しください。";
  }

  const isPending = createSubmissionMutation.isPending || createDraftMutation.isPending;

  return (
    <FormProvider {...form}>
      <form
        className="flex h-full min-h-0 flex-col overflow-hidden"
        onSubmit={handleRequestFormSubmit}
        noValidate
        aria-busy={isPending}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-10 pt-2 pb-5">
          <FieldSet disabled={isPending}>
            <FieldLegend className="text-lg">申請内容</FieldLegend>

            <RequestBasicFields supplierOptions={supplierOptions} />

            <RequestItemsFieldArray categoryOptions={categoryOptions} />
          </FieldSet>

          <RequestTotalAmountField />
        </div>

        <RequestFormActionBar
          errorMessage={submissionErrorMessage ?? errors.root?.draft?.message}
          onSaveDraft={handleSaveDraftClick}
          isSubmitting={createSubmissionMutation.isPending}
          isSavingDraft={createDraftMutation.isPending}
        />
      </form>
    </FormProvider>
  );
}
