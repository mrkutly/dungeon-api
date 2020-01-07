import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../../utils";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import { createConnection } from 'typeorm';

describe("GET /characters", (): void => {
  let app: Router;

  beforeAll(async (): Promise<void> => {
    await createConnection();
    app = express();
    dotenv.config();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);
  });

  it("does not send characters if the auth header is not present.", async (done): Promise<void> => {
    const response = await request(app).get('/api/v1/characters');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing authorization header");
    done();
  });

  it("sends an array of characers when the auth header is present.", async (done): Promise<void> => {
    const response = await request(app)
      .get('/api/v1/characters')
      .set({ authorization: process.env.TEST_JWT });

    expect(response.status).toBe(200);
    expect(response.body.characters).toBeInstanceOf(Array);
    done();
  });
});