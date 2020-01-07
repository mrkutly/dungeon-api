import dotenv from 'dotenv';
import express, { Router } from "express";
import request from "supertest";
import { createConnection } from 'typeorm';
import { applyMiddleware, applyRoutes } from "../../../utils";
import middleware from "../../../middleware";
import errorHandlers from "../../../middleware/errorHandlers";
import routes from '../routes';
import User from '../entity';
import * as Mailer from '../../../utils/Mailer';

jest.mock('axios');
jest.mock('../../../utils/Mailer');

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

  afterAll(async (): Promise<void> => {
    const user = await User.findOne({ email: 'fake@email.com' });
    await user?.remove();

    const testUser = await User.findOne({ email: process.env.TEST_EMAIL });
    await testUser?.hashPassword(process.env.TEST_PASSWORD);
    await testUser?.save();
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

    it('Sends back an error if the email is not a valid email', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ email: "invalidemail.com", password: "fakepassword" });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("email must be an email");
    });

    it('Sends back an error if the password does not contain a number', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ email: "fake@email.com", password: "fakepassword%$#" });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Password must be at least 12 characters long and contain at least 1 number and 1 special character (!@#$%^&*).");
    });

    it('Sends back an error if the password does not contain a special character', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ email: "fake@email.com", password: "fakepassword123" });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Password must be at least 12 characters long and contain at least 1 number and 1 special character (!@#$%^&*).");
    });

    it('Sends back an error if the password is not long enough', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ email: "fake@email.com", password: "fa1#2$3%" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Password must be at least 12 characters long and contain at least 1 number and 1 special character (!@#$%^&*).");
    });

    it('Sends back an error if the email is already associated with an account', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ email: process.env.TEST_EMAIL, password: "fakepassword1!2@3#" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Account already exists for that email");
    });

    it('creates an account', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/signup')
        .send({ email: "fake@email.com", password: "fakepassword1#2$3%" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /login', (): void => {
    it('Sends back an error if the email address is missing', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({ password: "fakepassword" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required parameters: email");
    });

    it('Sends back an error if the password is missing', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({ email: "fake@email.com" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required parameters: password");
    });

    it('Sends back an error if the email address is not found', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({ email: "this-is-not-an-email@dungeonfriend.com", password: "fakepassword123!@#" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Incorrect login credentials");
    });

    it('Sends back an error if the password is incorrect', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({ email: process.env.TEST_EMAIL, password: "fakepassword123!@#" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Incorrect login credentials");
    });

    it('Sends back a json web token', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe('POST /request-reset', (): void => {
    it('Does not break if the email does not exist', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/request-reset')
        .send({ email: "not-a-real-email@dungeonfriend.com" });

      expect(response.body.message).toBe("An email will be sent to not-a-real-email@dungeonfriend.com");
    });
    it('Sends an email to the requested email', async (): Promise<void> => {
      await request(app)
        .post('/api/v1/request-reset')
        .send({ email: process.env.TEST_EMAIL });

      expect(Mailer.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('Sets a reset token in the DB', async (): Promise<void> => {
      const user = await User.findOne({ email: process.env.TEST_EMAIL });
      const token = user?.reset_token;

      await request(app)
        .post('/api/v1/request-reset')
        .send({ email: process.env.TEST_EMAIL });

      const updatedUser = await User.findOne({ email: process.env.TEST_EMAIL });
      const updatedToken = updatedUser?.reset_token;

      expect(token === updatedToken).toBe(false);
    });
  });

  describe('POST /reset-password', (): void => {
    it("Does not work if the token is incorrect", async (): Promise<void> => {
      const response = await request(app)
        .post("/api/v1/reset-password")
        .send({ token: '123abc', password: 'butter' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid reset token");
    });

    it("Does not work if there is no password present", async (): Promise<void> => {
      const { resetToken } = await User.setResetTokenWhereEmail(process.env.TEST_EMAIL as string);

      const response = await request(app)
        .post("/api/v1/reset-password")
        .send({ token: resetToken });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required parameters: password");
    });

    it("Does not work if the token has expired", async (): Promise<void> => {
      const user = await User.findOne({ email: process.env.TEST_EMAIL });
      const { resetToken } = await User.setResetTokenWhereEmail(process.env.TEST_EMAIL as string);

      (user as User).reset_token_expiry = String(Date.now() - 3600000); // on hour prior to now
      await user?.save();

      const response = await request(app)
        .post("/api/v1/reset-password")
        .send({ token: resetToken, password: "thisisavalidpassword123%$#" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid reset token");
    });

    it("Validates the password before saving", async (): Promise<void> => {
      const { resetToken } = await User.setResetTokenWhereEmail(process.env.TEST_EMAIL as string);

      const response = await request(app)
        .post("/api/v1/reset-password")
        .send({ token: resetToken, password: "abc123" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Password must be at least 12 characters long and contain at least 1 number and 1 special character (!@#$%^&*).");
    });

    it("Resets the user's password and sends back a JWT", async (): Promise<void> => {
      const { resetToken } = await User.setResetTokenWhereEmail(process.env.TEST_EMAIL as string);

      const response = await request(app)
        .post("/api/v1/reset-password")
        .send({ token: resetToken, password: "thisisavalidpassword123*&^" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password successfully reset");
      expect(response.body).toHaveProperty("token");
    });
  });
});