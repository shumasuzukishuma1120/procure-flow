export type ApiFieldError = {
  field: string;
  code: string;
  message: string;
};
export type ApiProblemResponse = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  code: string;
  traceId: string;
  fieldErrors: ApiFieldError[];
};
