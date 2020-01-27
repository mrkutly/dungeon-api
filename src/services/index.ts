import characterRoutes from './character/routes';
import classRoutes from './character_class/routes';
import conditionRoutes from './condition/routes';
import equipmentRoutes from './equipment/routes';
import featureRoutes from './feature/routes';
import languageRoutes from './language/routes';
import magicSchoolRoutes from './magic_school/routes';
import proficiencyRoutes from './proficiency/routes';
import raceRoutes from './race/routes';
import skillRoutes from './skill/routes';
import spellRoutes from './spell/routes';
import subclassRoutes from './subclass/routes';
import userRoutes from './user/routes';

import Character from './character/entity';
import CharacterClass from './character_class/entity';
import Condition from './condition/entity';
import Equipment from './equipment/entity';
import Feature from './feature/entity';
import Language from './language/entity';
import MagicSchool from './magic_school/entity';
import Proficiency from './proficiency/entity';
import Race from './race/entity';
import Skill from './skill/entity';
import Spell from './spell/entity';
import Subclass from './subclass/entity';
import User from './user/entity';

export { default as Character } from './character/entity';
export { default as CharacterClass } from './character_class/entity';
export { default as Condition } from './condition/entity';
export { default as Equipment } from './equipment/entity';
export { default as Feature } from './feature/entity';
export { default as Language } from './language/entity';
export { default as MagicSchool } from './magic_school/entity';
export { default as Proficiency } from './proficiency/entity';
export { default as Race } from './race/entity';
export { default as Skill } from './skill/entity';
export { default as Spell } from './spell/entity';
export { default as Subclass } from './subclass/entity';
export { default as User } from './user/entity';

export type DungeonEntity = Character |
  CharacterClass |
  Condition |
  Equipment |
  Feature |
  Language |
  MagicSchool |
  Proficiency |
  Race |
  Skill |
  Spell |
  Subclass |
  User;

export const entities = {
  ['Character' as string]: Character,
  ['CharacterClass' as string]: CharacterClass,
  ['Condition' as string]: Condition,
  ['Equipment' as string]: Equipment,
  ['Feature' as string]: Feature,
  ['Language' as string]: Language,
  ['MagicSchool' as string]: MagicSchool,
  ['Proficiency' as string]: Proficiency,
  ['Race' as string]: Race,
  ['Skill' as string]: Skill,
  ['Spell' as string]: Spell,
  ['Subclass' as string]: Subclass,
  ['User' as string]: User,
};


export default [
  ...characterRoutes,
  ...classRoutes,
  ...conditionRoutes,
  ...equipmentRoutes,
  ...featureRoutes,
  ...languageRoutes,
  ...magicSchoolRoutes,
  ...proficiencyRoutes,
  ...raceRoutes,
  ...skillRoutes,
  ...spellRoutes,
  ...subclassRoutes,
  ...userRoutes,
];