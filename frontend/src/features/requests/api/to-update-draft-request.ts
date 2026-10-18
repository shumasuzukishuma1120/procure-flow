import { toCreateDraftRequest } from "@/features/requests/api/to-create-draft-request";
import type { DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import type { UpdateDraftRequest } from "@/features/requests/types";

export function toUpdateDraftRequest(
  values: DraftRequestFormValues,
  version: number,
): UpdateDraftRequest {
  return {
    ...toCreateDraftRequest(values),
    version,
  };
}
