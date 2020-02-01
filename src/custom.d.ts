import User from './services/user/entity';
import Character from './services/character/entity';

declare global {
  namespace Express {
    interface Request {
      user: User;
      character: Character;
    }
  }
}