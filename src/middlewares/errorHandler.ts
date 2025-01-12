// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

interface Error {
  status?: number;
  message?: string;
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log error for debugging

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ error: message });
};

export default errorHandler;
