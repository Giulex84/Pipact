import type { VercelResponse } from "@vercel/node";
import { ApiError, isApiError } from "./errors";

export interface SuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const json = <T>(res: VercelResponse, status: number, data: T) => {
  res.status(status).json(data);
};

export const sendSuccess = <T>(
  res: VercelResponse,
  status: number,
  data: T
) => {
  json<SuccessResponse<T>>(res, status, { ok: true, data });
};

export const sendError = (
  res: VercelResponse,
  error: unknown,
  fallbackMessage = "Unexpected error"
) => {
  if (isApiError(error)) {
    json<ErrorResponse>(res, error.status, {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  const message = error instanceof Error ? error.message : fallbackMessage;

  json<ErrorResponse>(res, 500, {
    ok: false,
    error: {
      code: "internal_error",
      message: message || fallbackMessage
    }
  });
};
