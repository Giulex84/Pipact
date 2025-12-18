export type ErrorCode =
  | "method_not_allowed"
  | "not_found"
  | "invalid_request"
  | "conflict"
  | "internal_error";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "code" in error
  );
};
