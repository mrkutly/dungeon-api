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