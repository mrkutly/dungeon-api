import { Request, Response, NextFunction } from "express";
import { validate } from 'class-validator';
import { HTTP400Error } from "../utils/httpErrors";
import RedisClient from '../utils/RedisClient';
import checkParams from '../utils/checkParams';
import User from '../services/user/entity';

export const checkUserParamsPresent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requiredParams = ['email', 'password'];
  checkParams(requiredParams, req, next);
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
      const errorMessages: string[] = [];
      for (const error of errors) {
        errorMessages.push(Object.values(error.constraints).join(', '));
      }
      throw new HTTP400Error(errorMessages.join(', '));
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
  checkParams(['email'], req, next);
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


export const checkPasswordResetParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requiredParams = ['token', 'password'];
  checkParams(requiredParams, req, next);
};

export const checkCache = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { path } = req;

    // skip cache during testing
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

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

export const checkCharacterParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requiredParams = [
    'name',
    'race',
    'character_class',
    'features',
    'languages',
    'proficiencies',
    'skills',
    'level',
    'speed',
    'strength',
    'dexterity',
    'constitution',
    'wisdom',
    'intelligence',
    'charisma',
    'max_hp',
  ];
  checkParams(requiredParams, req, next);
};