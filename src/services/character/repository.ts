import { getRepository } from 'typeorm';
import { Character } from '../database/entity/Character';

const CharacterRepository = getRepository(Character);

export default CharacterRepository;