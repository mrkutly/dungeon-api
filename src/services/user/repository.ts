import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';

const UserRepository = getRepository(User);

export default UserRepository;