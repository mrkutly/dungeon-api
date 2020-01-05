import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../../utils";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import { createConnection } from 'typeorm';

jest.mock('axios');

describe("/languages", (): void => {
  let app: Router;

  beforeAll(async (): Promise<void> => {
    await createConnection();
    app = express();
    dotenv.config();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);
  });

  describe("GET /", (): void => {
    it("sends an array of languages", async (): Promise<void> => {
      const response = await request(app).get('/api/v1/languages');

      expect(response.status).toBe(200);
      expect(response.body.languages).toBeInstanceOf(Array);
    });
  });


  describe('GET /:id', (): void => {
    it("sends an error back if the id does not exist", async (): Promise<void> => {
      const response = await request(app).get('/api/v1/languages/20000');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Resource not found");
    });

    it("sends back data about the language", async (): Promise<void> => {
      const response = await request(app).get('/api/v1/languages/2');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});