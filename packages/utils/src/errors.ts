import type { ApiError, ApiErrorCode } from '@playoff/types';

export class AppError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details?: ApiError['details'],
  ) {
    super(message);
    this.name = 'AppError';
  }

  toApiError(): ApiError {
    return { code: this.code, message: this.message, details: this.details };
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
