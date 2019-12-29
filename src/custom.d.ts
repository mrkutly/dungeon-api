import { User } from './services/database/entity/User';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}