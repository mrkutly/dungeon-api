import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../../utils";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import { createConnection } from 'typeorm';

jest.mock('axios');
jest.mock('redis');

describe("/spells", (): void => {
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
    it("sends an array of subclasses", async (done): Promise<void> => {
      const response = await request(app).get('/api/v1/subclasses');

      expect(response.status).toBe(200);
      expect(response.body.subclasses).toBeInstanceOf(Array);
      done();
    });
  });


  describe('GET /:id', (): void => {
    it("sends an error back if the id does not exist", async (done): Promise<void> => {
      const response = await request(app).get('/api/v1/subclasses/20000');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Resource not found");
      done();
    });

    it("sends back data about the subclass", async (done): Promise<void> => {
      const response = await request(app).get('/api/v1/subclasses/2');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      done();
    });
  });
});