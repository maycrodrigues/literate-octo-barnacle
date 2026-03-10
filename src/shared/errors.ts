export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(404, code, message, details);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
    this.name = 'ValidationError';
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
