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
  characters: Character[];
}

type CharacterReponse = request.Response & {
  body: CharResponseBody;
};

describe("GET /characters", (): void => {
  let app: Router;
  let authorization: string;
  let user: User | undefined;
  let successfulResponse: CharacterReponse;

  beforeAll(async (): Promise<void> => {
    await createConnection();
    app = express();
    dotenv.config();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);

    user = await User.findOne({ email: process.env.TEST_EMAIL });

    if (user === undefined) {
      Logger.error('Test user not found');
    }
    authorization = TokenManager.makeToken(user as User);

    successfulResponse = await request(app)
      .get('/api/v1/characters')
      .set({ authorization });
  });

  it("does not send characters if the auth header is not present.", async (done): Promise<void> => {
    const response = await request(app).get('/api/v1/characters');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing authorization header");
    done();
  });

  it("has a 200 status code.", (done): void => {
    expect(successfulResponse.status).toBe(200);
    done();
  });

  it("has a body param called 'characters' that is an array.", (done): void => {
    expect(successfulResponse.body.characters).toBeInstanceOf(Array);
    done();
  });


  it("sends an array of characters.", (done): void => {
    const character = successfulResponse.body.characters[0] as Character;
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
});