/**
 * Application error carrying an HTTP status and a machine-readable code.
 * The error middleware serializes this as { error: { code, message } }.
 */
export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, code = 'BAD_REQUEST'): AppError {
    return new AppError(400, code, message);
  }

  static unauthorized(message = 'Não autenticado.', code = 'UNAUTHORIZED'): AppError {
    return new AppError(401, code, message);
  }

  static forbidden(message = 'Acesso negado.', code = 'FORBIDDEN'): AppError {
    return new AppError(403, code, message);
  }

  static notFound(message = 'Recurso não encontrado.', code = 'NOT_FOUND'): AppError {
    return new AppError(404, code, message);
  }

  static conflict(message: string, code = 'CONFLICT'): AppError {
    return new AppError(409, code, message);
  }

  static badGateway(message: string, code = 'BAD_GATEWAY'): AppError {
    return new AppError(502, code, message);
  }
}
