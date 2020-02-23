import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../../utils";
import * as TokenManager from "../../../utils/TokenManager";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import { createConnection } from 'typeorm';
import User from '../../user/entity';
import Character from '../entity';
import Logger from '../../../utils/Logger';

interface CharResponseBody {
  character: Character;
}

type CharacterReponse = request.Response & {
  body: CharResponseBody;
};

const characterParams = {
  name: "Rico",
  race: 1,
  character_class: 3,
  features: [{ id: 1 }, { id: 11 }],
  languages: [{ id: 1 }, { id: 2 }],
  proficiencies: [{ id: 1 }, { id: 19 }],
  skills: [{ id: 1 }, { id: 12 }],
  equipment: [{ id: 1 }, { id: 2 }],
  conditions: [{ id: 1 }, { id: 2 }],
  spells: [{ id: 1 }, { id: 5 }],
  magic_school: 1,
  level: 1,
  speed: 1,
  strength: 1,
  dexterity: 1,
  constitution: 1,
  wisdom: 1,
  intelligence: 1,
  charisma: 1,
  max_hp: 1
};

describe("POST /characters", (): void => {
  let app: Router;
  let authorization: string;
  const charactersCache: Character[] = [];
  let user: User;

  beforeAll(async (): Promise<void> => {
    await createConnection();
    app = express();
    dotenv.config();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);

    user = await User.findOne({ email: process.env.TEST_EMAIL }) as User;

    if (user === undefined) {
      Logger.error('Test user not found');
    }
    authorization = TokenManager.makeToken(user as User);
  });

  afterAll(async (): Promise<void> => {
    for (const id of charactersCache) {
      await Character.delete(id);
    }
  });

  it("does not create the character if the auth cookie is not present.", async (done): Promise<void> => {
    const response = await request(app)
      .post('/api/v1/characters')
      .send(characterParams);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing authorization cookie");
    done();
  });

  it("sends back an error if one required param is missing.", async (done): Promise<void> => {
    const response = await request(app)
      .post('/api/v1/characters')
      .set('Cookie', [`token=${authorization}`])
      .send({
        race: characterParams.race,
        character_class: characterParams.character_class,
        level: characterParams.level,
        speed: characterParams.speed,
        strength: characterParams.strength,
        dexterity: characterParams.dexterity,
        constitution: characterParams.constitution,
        wisdom: characterParams.wisdom,
        intelligence: characterParams.intelligence,
        charisma: characterParams.charisma,
        max_hp: characterParams.max_hp,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing required parameters: name");
    done();
  });

  it("sends back an error if the multiple required params are missing.", async (done): Promise<void> => {
    const response = await request(app)
      .post('/api/v1/characters')
      .set('Cookie', [`token=${authorization}`])
      .send({
        character_class: characterParams.character_class,
        level: characterParams.level,
        speed: characterParams.speed,
        strength: characterParams.strength,
        dexterity: characterParams.dexterity,
        constitution: characterParams.constitution,
        wisdom: characterParams.wisdom,
        intelligence: characterParams.intelligence,
        charisma: characterParams.charisma,
        max_hp: characterParams.max_hp,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing required parameters: name, race");
    done();
  });

  it("creates a character and returns it in the response", async (done): Promise<void> => {
    const response: CharacterReponse = await request(app)
      .post('/api/v1/characters')
      .set('Cookie', [`token=${authorization}`])
      .send(characterParams);

    const { character } = response.body;
    charactersCache.push(character.id);
    expect(response.status).toBe(201);

    expect(typeof character.id).toBe("number");
    expect(typeof character.level).toBe("number");
    expect(typeof character.experience).toBe("number");
    expect(typeof character.name).toBe("string");
    expect(typeof character.strength).toBe("number");
    expect(typeof character.dexterity).toBe("number");
    expect(typeof character.constitution).toBe("number");
    expect(typeof character.wisdom).toBe("number");
    expect(typeof character.intelligence).toBe("number");
    expect(typeof character.charisma).toBe("number");
    expect(typeof character.current_hp).toBe("number");
    expect(typeof character.max_hp).toBe("number");
    expect(typeof character.character_class.name).toBe("string");
    expect(typeof character.race.name).toBe("string");
    expect(typeof character.created_at).toBe('string');
    expect(typeof character.updated_at).toBe('string');
    expect(character.conditions).toBeInstanceOf(Array);
    expect(typeof character.conditions[0].name).toBe('string');
    expect(character.proficiencies).toBeInstanceOf(Array);
    expect(typeof character.proficiencies[0].name).toBe('string');
    expect(character.equipment).toBeInstanceOf(Array);
    expect(typeof character.equipment[0].name).toBe('string');
    expect(character.skills).toBeInstanceOf(Array);
    expect(typeof character.skills[0].name).toBe('string');
    expect(character.spells).toBeInstanceOf(Array);
    expect(typeof character.spells[0].name).toBe('string');
    expect(character.features).toBeInstanceOf(Array);
    expect(typeof character.features[0].name).toBe('string');
    expect(character.languages).toBeInstanceOf(Array);
    expect(typeof character.languages[0].name).toBe('string');
    expect(typeof character.magic_school.name).toBe('string');

    done();
  });

  it("associates the character with the correct user", async (done): Promise<void> => {
    const [character] = await Character.findByIds(charactersCache, { relations: ['user'] });
    expect(character.user.id).toBe(user.id);
    done();
  });
});