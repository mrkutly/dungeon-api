import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../../utils";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import { createConnection } from 'typeorm';

jest.mock('axios');

describe("User Routes", (): void => {
  let app: Router;

  beforeAll(async (): Promise<void> => {
    await createConnection();
    app = express();
    dotenv.config();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);
  });

  describe('POST /signup', (): void => {
    it('Sends back an error if the email address is missing', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ password: "fakepassword" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required parameters: email");
    });

    it('Sends back an error if the password is missing', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ email: "fake@email.com" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required parameters: password");
    });
  });
});