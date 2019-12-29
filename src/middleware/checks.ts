import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";
import { User } from '../services/database/entity/User';

export const checkUserParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requiredParams = ['email', 'password'];
  const presentParams = Object.keys(req.body);
  const missingParams = requiredParams.filter(param => !presentParams.includes(param));

  if (missingParams.length > 0) {
    throw new HTTP400Error(`Missing required parameters: ${missingParams.join(', ')}`);
  } else {
    next();
  }
};

export const checkLoginCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new HTTP400Error('Incorrect login credentials');
    }

    const authenticated = await user.authenticate(password);

    if (!authenticated) {
      throw new HTTP400Error('Incorrect login credentials');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkAuthorizationHeader = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new HTTP400Error('Missing authorization header');
    }

    const user = await User.parseFromWebToken(authorization);

    if (!user) {
      throw new HTTP400Error('Invalid authorization header');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};