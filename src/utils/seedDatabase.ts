// TODO: Seed db again with updated resource urls

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
import { openSync } from 'fs';

const baseUrl = 'http://dnd5eapi.co/api/';

const resources = [
  { entity: CharacterClass, apiPath: 'classes' },
  { entity: Condition, apiPath: 'conditions' },
  { entity: Equipment, apiPath: 'equipment' },
  { entity: Feature, apiPath: 'features' },
  { entity: Language, apiPath: 'languages' },
  { entity: Proficiency, apiPath: 'proficiencies' },
  { entity: Race, apiPath: 'races' },
  { entity: Skill, apiPath: 'skills' },
  { entity: Spell, apiPath: 'spells' },
  { entity: MagicSchool, apiPath: 'magic-schools' },
];

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

      const results: Result[] = resp.data.results;

      for (const result of results) {
        const instance = new Resource();
        instance.name = result.name;
        instance.resource_url = result.url;
        await instance.save();
        Logger.verbose(JSON.stringify(instance, null, 2));
      }
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

      for (const result of results) {
        const charClass = await CharacterClass.findOne({ name: result.class });

        if (charClass) {
          charClass.spellcasting_url = result.url;
          await charClass?.save();
        }
      }
    }
  } catch (error) {
    Logger.error(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resetResourceUrls(Resource: any, apiPath: string): Promise<void> {
  try {
    const resp = await axios.get(`${baseUrl}${apiPath}`);
    Logger.verbose(JSON.stringify(resp.data, null, 2));
    const results: Result[] = resp.data.results;

    for (const result of results) {
      const instance = await Resource.findOne({ name: result.name });
      instance.resource_url = result.url;
      await instance.save();
      Logger.verbose(JSON.stringify(instance, null, 2));
    }

  } catch (error) {
    Logger.error(error.message);
  }
}

type SeedOptions = {
  resetResourceUrls?: boolean;
};

async function seedDatabase(opts?: SeedOptions): Promise<void> {
  try {
    await createConnection();

    for (const resource of resources) {
      await seedResource(resource.entity, resource.apiPath);
    }

    await assignSpellCasting();

    if (opts?.resetResourceUrls) {
      for (const resource of resources) {
        await resetResourceUrls(resource.entity, resource.apiPath);
      }
    }

    process.exit(0);
  } catch (error) {
    Logger.error(error.message);
  }
}

seedDatabase({ resetResourceUrls: true });