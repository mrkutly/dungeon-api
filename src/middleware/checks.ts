import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkSignupParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requiredParams = ['email', 'password'];
  const presentParams = Object.keys(req.body);
  const missingParams = requiredParams.filter(param => !presentParams.includes(param));

  if (missingParams.length > 0) {
    throw new HTTP400Error(`Missing required parameters: ${missingParams.join(', ')}`);
  } else {
    next();
  }
};