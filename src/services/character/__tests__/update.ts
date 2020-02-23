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
import Character, { CharacterParams } from '../entity';
import Logger from '../../../utils/Logger';
import {
  Race,
  CharacterClass,
  Language,
  Feature,
  Proficiency,
  Skill,
  Equipment,
  Condition,
  Spell,
  MagicSchool
} from '../../index';

describe('Character update routes', () => {
  let app: Router;
  let authorization: string;
  let user: User;
  let testCharacter: Character;


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

    const characterParams: CharacterParams = {
      user,
      name: "Rico",
      experience: 0,
      current_hp: 1,
      race: { id: 1 } as Race,
      character_class: { id: 3 } as CharacterClass,
      features: [{ id: 1 }, { id: 11 }] as Feature[],
      languages: [{ id: 1 }, { id: 2 }] as Language[],
      proficiencies: [{ id: 1 }, { id: 19 }] as Proficiency[],
      skills: [{ id: 1 }, { id: 12 }] as Skill[],
      equipment: [{ id: 1 }, { id: 2 }] as Equipment[],
      conditions: [{ id: 1 }, { id: 2 }] as Condition[],
      spells: [{ id: 1 }, { id: 5 }] as Spell[],
      magic_school: { id: 1 } as MagicSchool,
      level: 1,
      speed: 1,
      strength: 1,
      dexterity: 1,
      constitution: 1,
      wisdom: 1,
      intelligence: 1,
      charisma: 1,
      max_hp: 1,
    };

    testCharacter = await Character.createFromCharacterParams(characterParams) as Character;

    if (testCharacter === undefined || testCharacter instanceof Error) {
      Logger.error('Test character not created');
    }
  });

  afterAll(async () => {
    if (testCharacter instanceof Character) {
      Character.delete(testCharacter.id);
    }
  });

  describe("PATCH /characters/:id", (): void => {
    it("does not update the character if the auth header is not present.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .send({ character: { name: "The character formerly known as Rico" } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing authorization header");
      done();
    });

    it("does not allow users to update characters that are not theirs.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/1`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { name: "The character formerly known as Rico" } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Character with id 1 belonging to logged in user does not exist.");
      done();
    });

    it("Enforces proper formatting of requests for hasOne relations.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { character_class: 4 } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid character update params: missing property 'id' on parameter character_class");
      done();
    });

    it("Enforces proper formatting of requests for hasMany relations.", async (done): Promise<void> => {
      let response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { proficiencies: { id: 4 } } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid character update params: proficiencies should be an array");

      response = await request(app).patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { proficiencies: [{ missing_id: 4 }] } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid character update params: missing property 'id' on at least item in proficiencies params");
      done();
    });

    it("Updates the character's name.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { name: "The character formerly known as Rico" } });

      expect(response.status).toBe(200);
      expect(response.body.character.name).toBe("The character formerly known as Rico");
      done();
    });

    it("Updates the character's stats.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({
          character: {
            dexterity: 19,
            strength: 17,
            constitution: 17,
            intelligence: 8,
            charisma: 13,
            wisdom: 7,
            level: 4,
            experience: 6000,
            max_hp: 25,
            current_hp: 24,
          }
        });

      const { character } = response.body;
      expect(response.status).toBe(200);
      expect(character.dexterity).toBe(19);
      expect(character.strength).toBe(17);
      expect(character.constitution).toBe(17);
      expect(character.intelligence).toBe(8);
      expect(character.charisma).toBe(13);
      expect(character.wisdom).toBe(7);
      expect(character.level).toBe(4);
      expect(character.experience).toBe(6000);
      expect(character.max_hp).toBe(25);
      expect(character.current_hp).toBe(24);
      done();
    });

    it("Updates the character's class.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { character_class: { id: 7 } } });

      expect(response.status).toBe(200);
      expect(response.body.character.character_class.id).toBe(7);
      done();
    });

    it("Updates the character's race.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { race: { id: 7 } } });

      expect(response.status).toBe(200);
      expect(response.body.character.race.id).toBe(7);
      done();
    });

    it("Updates the character's magic school.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { magic_school: { id: 3 } } });

      expect(response.status).toBe(200);
      expect(response.body.character.magic_school.id).toBe(3);
      done();
    });

    it("Adds to the characters features.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { features: [{ id: 10 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.features.length).toBe(3);
      expect((response.body.character.features.find((feat: Feature) => feat.id === 10))).toBeTruthy();
      done();
    });

    it("Adds to the characters languages.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { languages: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.languages.length).toBe(3);
      expect((response.body.character.languages.find((lang: Language) => lang.id === 3))).toBeTruthy();
      done();
    });

    it("Adds to the characters proficiencies.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { proficiencies: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.proficiencies.length).toBe(3);
      expect((response.body.character.proficiencies.find((prof: Proficiency) => prof.id === 3))).toBeTruthy();
      done();
    });

    it("Adds to the characters skills.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { skills: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.skills.length).toBe(3);
      expect((response.body.character.skills.find((skill: Skill) => skill.id === 3))).toBeTruthy();
      done();
    });

    it("Adds to the characters equipment.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { equipment: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.equipment.length).toBe(3);
      expect((response.body.character.equipment.find((eq: Equipment) => eq.id === 3))).toBeTruthy();
      done();
    });

    it("Adds to the characters conditions.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { conditions: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.conditions.length).toBe(3);
      expect((response.body.character.conditions.find((cond: Condition) => cond.id === 3))).toBeTruthy();
      done();
    });

    it("Adds to the characters spells.", async (done): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { spells: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.spells.length).toBe(3);
      expect((response.body.character.spells.find((spell: Spell) => spell.id === 3))).toBeTruthy();
      done();
    });
  });

  describe("PUT /characters/:id", (): void => {
    it("does not update the character if the auth header is not present.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .send({ character: { name: "The character formerly known as Rico" } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing authorization header");
      done();
    });

    it("does not allow users to update characters that are not theirs.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/1`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { name: "The character formerly known as Rico" } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Character with id 1 belonging to logged in user does not exist.");
      done();
    });

    it("Enforces proper formatting of requests for hasOne relations.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { character_class: 4 } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid character update params: missing property 'id' on parameter character_class");
      done();
    });

    it("Enforces proper formatting of requests for hasMany relations.", async (done): Promise<void> => {
      let response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { proficiencies: { id: 4 } } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid character update params: proficiencies should be an array");

      response = await request(app).put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { proficiencies: [{ missing_id: 4 }] } });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid character update params: missing property 'id' on at least item in proficiencies params");
      done();
    });

    it("Updates the character's name.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { name: "The character formerly known as Rico" } });

      expect(response.status).toBe(200);
      expect(response.body.character.name).toBe("The character formerly known as Rico");
      done();
    });

    it("Updates the character's stats.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({
          character: {
            dexterity: 19,
            strength: 17,
            constitution: 17,
            intelligence: 8,
            charisma: 13,
            wisdom: 7,
            level: 4,
            experience: 6000,
            max_hp: 25,
            current_hp: 24,
          }
        });

      const { character } = response.body;
      expect(response.status).toBe(200);
      expect(character.dexterity).toBe(19);
      expect(character.strength).toBe(17);
      expect(character.constitution).toBe(17);
      expect(character.intelligence).toBe(8);
      expect(character.charisma).toBe(13);
      expect(character.wisdom).toBe(7);
      expect(character.level).toBe(4);
      expect(character.experience).toBe(6000);
      expect(character.max_hp).toBe(25);
      expect(character.current_hp).toBe(24);
      done();
    });

    it("Updates the character's class.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { character_class: { id: 7 } } });

      expect(response.status).toBe(200);
      expect(response.body.character.character_class.id).toBe(7);
      done();
    });

    it("Updates the character's race.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { race: { id: 7 } } });

      expect(response.status).toBe(200);
      expect(response.body.character.race.id).toBe(7);
      done();
    });

    it("Updates the character's magic school.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { magic_school: { id: 3 } } });

      expect(response.status).toBe(200);
      expect(response.body.character.magic_school.id).toBe(3);
      done();
    });

    it("Sets to the characters features.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { features: [{ id: 10 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.features.length).toBe(1);
      expect((response.body.character.features.find((feat: Feature) => feat.id === 10))).toBeTruthy();
      done();
    });

    it("Sets the characters languages.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { languages: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.languages.length).toBe(1);
      expect((response.body.character.languages.find((lang: Language) => lang.id === 3))).toBeTruthy();
      done();
    });

    it("Sets the characters proficiencies.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { proficiencies: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.proficiencies.length).toBe(1);
      expect((response.body.character.proficiencies.find((prof: Proficiency) => prof.id === 3))).toBeTruthy();
      done();
    });

    it("Sets the characters skills.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { skills: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.skills.length).toBe(1);
      expect((response.body.character.skills.find((skill: Skill) => skill.id === 3))).toBeTruthy();
      done();
    });

    it("Sets the characters equipment.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { equipment: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.equipment.length).toBe(1);
      expect((response.body.character.equipment.find((eq: Equipment) => eq.id === 3))).toBeTruthy();
      done();
    });

    it("Sets the characters conditions.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { conditions: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.conditions.length).toBe(1);
      expect((response.body.character.conditions.find((cond: Condition) => cond.id === 3))).toBeTruthy();
      done();
    });

    it("Sets the characters spells.", async (done): Promise<void> => {
      const response = await request(app)
        .put(`/api/v1/characters/${testCharacter.id}`)
        .set('Cookie', [`token=${authorization}`])
        .send({ character: { spells: [{ id: 3 }] } });

      expect(response.status).toBe(200);
      expect(response.body.character.spells.length).toBe(1);
      expect((response.body.character.spells.find((spell: Spell) => spell.id === 3))).toBeTruthy();
      done();
    });
  });

});
