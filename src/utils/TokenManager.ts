import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../services/user/entity';

dotenv.config();

const secret = process.env.NODE_ENV === 'test' ? process.env.TEST_SECRET : process.env.APP_SECRET;

interface UserToken {
  userId: number;
};

export const makeToken = (user: User): string => {
  return jwt.sign({ userId: user.id }, secret as Secret, { expiresIn: '2 days' });
};

export const parseToken = (token: string): UserToken => {
  try {
    const parsed = jwt.verify(token, secret as Secret);
    return parsed as UserToken;
  } catch (err) {
    return err;
  }
};