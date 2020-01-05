import { Request, Response, NextFunction } from "express";
import { validate } from 'class-validator';
import { HTTP400Error, HTTPClientError, HTTP404Error } from "../utils/httpErrors";
import RedisClient from '../utils/RedisClient';
import User from '../services/user/entity';

export const checkUserParamsPresent = (
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

export const checkUserParamsValid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = new User();

    user.email = email;
    user.password = password;
    const errors = await validate(user);

    if (errors.length > 0) {
      const errorMessages = Object.values(errors[0].constraints).join(", ");
      throw new HTTP404Error(errorMessages);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
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

export const checkUserDoesNotExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      throw new HTTP400Error('Account already exists for that email');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkResetRequestParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email } = req.body;
  if (!email) {
    throw new HTTP400Error('Missing required paramter: email');
  }

  next();
};

export const checkPasswordResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ reset_token: token });
    const tokenExpired = Number(user?.reset_token_expiry) < Date.now();

    if (!user || tokenExpired) {
      throw new HTTP400Error('Invalid reset token');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { path } = req;
    RedisClient.get(path, (err, data) => {
      if (data) {
        res.status(200).json(JSON.parse(data));
      } else {
        next();
      }
    });
  } catch (error) {
    next();
  }
};
