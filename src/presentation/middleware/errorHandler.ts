import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { isAppError } from '../../shared/errors';
import { logger } from '../../shared/utils/logger';

const toErrorPayload = (error: unknown): { code: string; message: string; details?: unknown } => {
  if (isAppError(error)) {
    return { code: error.code, message: error.message, details: error.details };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return { code: 'MONGOOSE_VALIDATION_ERROR', message: 'Invalid request', details: error.errors as unknown };
  }

  if (error instanceof mongoose.Error.CastError) {
    const details: Record<string, unknown> = { path: error.path, value: error.value as unknown };
    return { code: 'MONGOOSE_CAST_ERROR', message: 'Invalid request', details };
  }

  if (error instanceof Error) {
    return { code: 'INTERNAL_SERVER_ERROR', message: error.message };
  }

  return { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' };
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  const statusCode = isAppError(error) ? error.statusCode : 500;

  if (statusCode >= 500) {
    logger.error('Unhandled error', { error });
  }

  if (res.headersSent) {
    return next(error);
  }

  return res.status(statusCode).json({ error: toErrorPayload(error) });
};
