import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../../utils";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import { createConnection } from 'typeorm';

describe("GET /character_classes", (): void => {
  let app: Router;

  beforeAll(async (): Promise<void> => {
    await createConnection();
    app = express();
    dotenv.config();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);
  });

  it("sends an array of character classes.", async (): Promise<void> => {
    const response = await request(app).get('/api/v1/character_classes');

    expect(response.status).toBe(200);
    expect(response.body.character_classes).toBeInstanceOf(Array);
  });
});