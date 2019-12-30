import { User } from './services/user/entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}