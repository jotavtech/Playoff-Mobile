export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  cursor: string | null;
  hasMore: boolean;
};
