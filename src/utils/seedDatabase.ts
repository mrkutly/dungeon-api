import axios from 'axios';
import { createConnection } from 'typeorm';
import Logger from './Logger';
import Race from '../services/race/entity';
import CharacterClass from '../services/character_class/entity';
import Feature from '../services/feature/entity';
import Proficiency from '../services/proficiency/entity';
import Equipment from '../services/equipment/entity';
import Language from '../services/language/entity';
import Skill from '../services/skill/entity';
import Spell from '../services/spell/entity';
import Condition from '../services/condition/entity';
import MagicSchool from '../services/magic_school/entity';

const baseUrl = 'http://dnd5eapi.co/api/';

type Result = {
  name: string;
  url: string;
};

type SpellcastingResult = {
  class: string;
  url: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedResource(Resource: any, apiPath: string): Promise<void> {
  try {
    const row = await Resource.findOne();
    if (!row) {
      const resp = await axios.get(`${baseUrl}${apiPath}`);
      Logger.verbose(JSON.stringify(resp.data, null, 2));

      await resp.data.results.reduce(
        async (prev: Promise<Result>, result: Result): Promise<void> => {
          try {
            await prev;
            const instance = new Resource();
            instance.name = result.name;
            instance.resource_url = result.url;
            await instance.save();
            Logger.verbose(JSON.stringify(instance, null, 2));
          } catch (error) {
            Logger.error(error.message);
          }
        }
        , Promise.resolve()
      );
    }
  } catch (error) {
    Logger.error(error.message);
  }
}

async function assignSpellCasting(): Promise<void> {
  try {
    const characterClass = await CharacterClass.findOne({ name: "Bard" });
    const spellcastingUrl = characterClass?.spellcasting_url;

    if (!spellcastingUrl) {
      const response = await axios.get(`${baseUrl}spellcasting`);
      const results: SpellcastingResult[] = response.data.results;

      await results.reduce(async (prev: Promise<void>, result): Promise<void> => {
        await prev;
        const charClass = await CharacterClass.findOne({ name: result.class });

        if (charClass) {
          charClass.spellcasting_url = result.url;
          await charClass?.save();
        }
      }, Promise.resolve());
    }
  } catch (error) {
    Logger.error(error.message);
  }
}

async function seedDatabase(): Promise<void> {
  try {
    await createConnection();
    await seedResource(CharacterClass, 'classes');
    await seedResource(Condition, 'conditions');
    await seedResource(Equipment, 'equipment');
    await seedResource(Feature, 'features');
    await seedResource(Language, 'languages');
    await seedResource(Proficiency, 'proficiencies');
    await seedResource(Race, 'races');
    await seedResource(Skill, 'skills');
    await seedResource(Spell, 'spells');
    await seedResource(MagicSchool, 'magic-schools');
    await assignSpellCasting();
    process.exit(0);
  } catch (error) {
    Logger.error(error.message);
  }
}

seedDatabase();