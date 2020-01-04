import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../../utils";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import { createConnection } from 'typeorm';

describe("GET /races", (): void => {
  let app: Router;

  beforeAll(async (): Promise<void> => {
    await createConnection();
    app = express();
    dotenv.config();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);
  });

  it("sends an array of races", async (): Promise<void> => {
    const response = await request(app).get('/api/v1/races');

    expect(response.status).toBe(200);
    expect(response.body.races).toBeInstanceOf(Array);
  });
});