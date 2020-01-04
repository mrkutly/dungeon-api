import userRoutes from './user/routes';
import characterRoutes from './character/routes';
import raceRoutes from './race/routes';
import classRoutes from './character_class/routes';
import featureRoutes from './feature/routes';
import proficiencyRoutes from './proficiency/routes';
import equipmentRoutes from './equipment/routes';
import languageRoutes from './language/routes';
import skillRoutes from './skill/routes';
import spellRoutes from './spell/routes';
import conditionRoutes from './condition/routes';
import magicSchoolRoutes from './magic_school/routes';

export default [
  ...userRoutes,
  ...characterRoutes,
  ...raceRoutes,
  ...classRoutes,
  ...featureRoutes,
  ...proficiencyRoutes,
  ...equipmentRoutes,
  ...languageRoutes,
  ...skillRoutes,
  ...spellRoutes,
  ...conditionRoutes,
  ...magicSchoolRoutes,
];