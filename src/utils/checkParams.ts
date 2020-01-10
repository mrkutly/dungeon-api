import { Request, NextFunction } from 'express';
import { HTTP400Error } from './httpErrors';

export default function checkParams(required: string[], req: Request, next: NextFunction): void {
  const presentParams = Object.keys(req.body);
  const missingParams = required.filter(param => !presentParams.includes(param));

  if (missingParams.length > 0) {
    throw new HTTP400Error(`Missing required parameters: ${missingParams.join(', ')}`);
  }

  next();
};