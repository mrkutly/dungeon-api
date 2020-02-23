import { Request, Response, NextFunction } from "express";
import { validate } from 'class-validator';
import { HTTP400Error } from "../utils/httpErrors";
import RedisClient from '../utils/RedisClient';
import checkParams from '../utils/checkParams';
import User from '../services/user/entity';
import Character, { characterRelations } from "../services/character/entity";

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

export const checkAuthorizationCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new HTTP400Error('Missing authorization header');
    }

    const user = await User.parseFromWebToken(token);

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

export const checkCharacterBelongsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const character = await Character.findOne({ where: { id, user: req.user }, relations: characterRelations });

    if (typeof character === 'undefined' || character instanceof Error) {
      throw new HTTP400Error(`Character with id ${id} belonging to logged in user does not exist.`);
    }

    req.character = character;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkCharacterUpdateParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const hasOnes = [
    'character_class',
    'magic_school',
    'race',
  ];
  const hasManys = [
    'conditions',
    'equipment',
    'features',
    'languages',
    'proficiencies',
    'skills',
    'spells'
  ];
  const allowedParams = [
    ...hasOnes,
    ...hasManys,
    'charisma',
    'constitution',
    'current_hp',
    'dexterity',
    'intelligence',
    'level',
    'max_hp',
    'name',
    'speed',
    'strength',
    'wisdom',
    'experience'
  ];
  const reqParams = req.body.character;
  const notAllowedParams = Object.keys(reqParams).filter(param => !allowedParams.includes(param));

  if (notAllowedParams.length > 0) {
    throw new HTTP400Error(`Invalid character update params: ${notAllowedParams.join(', ')}`);
  }

  hasOnes.forEach((prop) => {
    if (reqParams[prop] && typeof reqParams[prop].id !== 'number') {
      throw new HTTP400Error(`Invalid character update params: missing property 'id' on parameter ${prop}`);
    }
  });

  hasManys.forEach((prop) => {
    if (!!reqParams[prop]) {
      if (!Array.isArray(reqParams[prop])) {
        throw new HTTP400Error(`Invalid character update params: ${prop} should be an array`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (reqParams[prop].some((obj: any) => typeof obj.id !== 'number')) {
        throw new HTTP400Error(
          `Invalid character update params: missing property 'id' on at least item in ${prop} params`
        );
      }
    }

  });
  next();
};