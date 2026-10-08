import { draftRequestHandlers } from "@/mocks/handlers/draft-request-handler";
import { requestSubmissionHandlers } from "@/mocks/handlers/request-submission-handler";

export const handlers = [
  ...draftRequestHandlers,
  ...requestSubmissionHandlers,
];
