import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string> = {};
    err.errors.forEach((issue) => {
      const field = issue.path.join('.') || 'body';
      formattedErrors[field] = issue.message;
    });

    res.status(400).json({
      error: 'Erreur de validation des données',
      details: formattedErrors,
    });
    return;
  }

  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  const message = err.message || 'Une erreur interne est survenue';
  res.status(status).json({ error: message });
}
