"use client";

import { FieldLegend, FieldSet } from "@/components/ui/field";
import { toUpdateDraftRequest } from "@/features/requests/api/to-update-draft-request";
import RequestBasicFields from "@/features/requests/components/request-basic-fields";
import RequestFormActionBar from "@/features/requests/components/request-form-action-bar";
import RequestItemsFieldArray from "@/features/requests/components/request-items-field-array";
import RequestTotalAmountField from "@/features/requests/components/request-total-amount-field";
import { hasDraftContent } from "@/features/requests/forms/has-draft-content";
import { toDraftRequestFormValues } from "@/features/requests/forms/to-draft-request-form-values";
import { toRequestFormFieldPath } from "@/features/requests/forms/to-request-form-field-path";
import { useUpdateDraftRequest } from "@/features/requests/hooks/use-update-draft-request";
import {
  draftRequestFormSchema,
  submitRequestFormSchema,
  type DraftRequestFormValues,
} from "@/features/requests/schemas/request-form-schema";
import type {
  DraftRequestResponse,
  RequestFormValidationIntent,
  SubmissionAttempt,
} from "@/features/requests/types";
import type { CategoryOption } from "@/features/categories/types";
import type { SupplierOption } from "@/features/suppliers/types";
import { ApiError } from "@/lib/api/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitEventHandler, useRef, useState, type MouseEventHandler } from "react";
import { FormProvider, Resolver, useForm, type SubmitHandler } from "react-hook-form";
import { toCreateRequestSubmissionRequest } from "@/features/requests/api/to-create-request-submission-request";
import { useEditRequestSubmissions } from "@/features/requests/hooks/use-submit-draft-request";

type EditRequestFormProps = {
  request: DraftRequestResponse;
  supplierOptions: SupplierOption[];
  categoryOptions: CategoryOption[];
};

const draftRequestResolver: Resolver<DraftRequestFormValues> = zodResolver(draftRequestFormSchema);

const submitRequestResolver: Resolver<DraftRequestFormValues> = zodResolver<
  DraftRequestFormValues,
  unknown,
  DraftRequestFormValues
>(submitRequestFormSchema);

export default function EditRequestForm({
  request,
  supplierOptions,
  categoryOptions,
}: EditRequestFormProps) {
  const validationIntentRef = useRef<RequestFormValidationIntent>("draft");

  const submissionAttemptRef = useRef<SubmissionAttempt | null>(null);

  const requestFormResolver: Resolver<DraftRequestFormValues> = (values, context, options) => {
    const resolver =
      validationIntentRef.current === "draft" ? draftRequestResolver : submitRequestResolver;

    return resolver(values, context, options);
  };

  const [version, setVersion] = useState(request.version);
  const [successMessage, setSuccessMessage] = useState<string>();
  const updateMutation = useUpdateDraftRequest();
  const updateEditRequestSubmission = useEditRequestSubmissions();
  const router = useRouter();
  const form = useForm<DraftRequestFormValues>({
    resolver: requestFormResolver,
    defaultValues: toDraftRequestFormValues(request),
    mode: "onBlur",
  });
  const { handleSubmit, setError } = form;

  const onSaveDraft: SubmitHandler<DraftRequestFormValues> = (values) => {
    setSuccessMessage(undefined);
    if (!hasDraftContent(values)) {
      form.setError("root.draft", {
        type: "manual",
        message: "下書き保存するには、いずれかの項目を入力してください",
      });
      return;
    }

    form.clearErrors("root.draft");
    updateMutation.mutate(
      {
        requestId: request.requestId,
        request: toUpdateDraftRequest(values, version),
      },
      {
        onSuccess: (response) => {
          setVersion(response.version);
          form.reset(toDraftRequestFormValues(response));
          setSuccessMessage("変更を保存しました。");
          router.refresh();
        },
        onError: (error) => {
          if (!(error instanceof ApiError) || (error.status !== 400 && error.status !== 422)) {
            return;
          }

          const itemCount = form.getValues("items").length;
          let shouldFocus = true;
          for (const fieldError of error.problem?.fieldErrors ?? []) {
            const fieldPath = toRequestFormFieldPath(fieldError.field, itemCount);
            if (fieldPath === null) {
              continue;
            }
            form.setError(
              fieldPath,
              { type: fieldError.code, message: fieldError.message },
              { shouldFocus },
            );
            shouldFocus = false;
          }
        },
      },
    );
  };

  const handleSaveClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    validationIntentRef.current = "draft";

    void form.handleSubmit(onSaveDraft)(event);
  };

  const error = updateMutation.error;
  const itemCount = form.getValues("items").length;
  const hasMappedFieldError =
    error instanceof ApiError &&
    (error.status === 400 || error.status === 422) &&
    (error.problem?.fieldErrors.some(
      (fieldError) => toRequestFormFieldPath(fieldError.field, itemCount) !== null,
    ) ??
      false);
  const errorMessage =
    error instanceof ApiError && !hasMappedFieldError
      ? error.message
      : updateMutation.isError
        ? "下書きの更新に失敗しました。時間をおいて再度お試しください。"
        : form.formState.errors.root?.draft?.message;

  const onSubmitRequest: SubmitHandler<DraftRequestFormValues> = (values) => {
    const submitValues = submitRequestFormSchema.parse(values);

    const submitRequest = {
      ...toCreateRequestSubmissionRequest(submitValues),
      version,
    };

    const requestFingerprint = JSON.stringify(submitRequest);
    const previousAttempt = submissionAttemptRef.current;

    const idempotencyKey =
      previousAttempt?.requestFingerprint === requestFingerprint
        ? previousAttempt.idempotencyKey
        : crypto.randomUUID();

    submissionAttemptRef.current = { idempotencyKey, requestFingerprint };

    updateEditRequestSubmission.mutate(
      {
        requestId: request.requestId,
        request: submitRequest,
        idempotencyKey: idempotencyKey,
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

  const handleRequestFormSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    validationIntentRef.current = "submit";

    const validateAndSubmit = handleSubmit(onSubmitRequest);
    void validateAndSubmit(event);
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex h-full min-h-0 flex-col overflow-hidden"
        onSubmit={handleRequestFormSubmit}
        noValidate
        aria-busy={updateMutation.isPending}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
          <FieldSet disabled={updateMutation.isPending}>
            <FieldLegend className="text-lg">申請内容</FieldLegend>
            <RequestBasicFields supplierOptions={supplierOptions} />
            <RequestItemsFieldArray categoryOptions={categoryOptions} />
          </FieldSet>
          <RequestTotalAmountField />
        </div>

        <RequestFormActionBar
          errorMessage={errorMessage}
          onSaveDraft={handleSaveClick}
          isSubmitting={false}
          isSavingDraft={updateMutation.isPending}
          showSubmit={true}
          saveLabel="変更を保存"
          savingLabel="変更を保存中です..."
          successMessage={successMessage}
          isSaveDisabled={!form.formState.isDirty}
        />
      </form>
    </FormProvider>
  );
}
