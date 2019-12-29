import { Response, NextFunction } from "express";
import { HTTPClientError, HTTP404Error } from "../utils/httpErrors";
import Logger from '../utils/Logger';

export const notFoundError = (): void => {
  throw new HTTP404Error("Method not found.");
};

export const clientError = (err: Error, res: Response, next: NextFunction): void => {
  if (err instanceof HTTPClientError) {
    Logger.warn(`api.request.error.client - ${err}`);
    res.status(err.statusCode).send(err.message);
  } else {
    next(err);
  }
};

export const serverError = (err: Error, res: Response, next: NextFunction): void => {
  Logger.warn(`api.request.error.server - ${err}`);
  if (process.env.NODE_ENV === "production") {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(500).send(err.stack);
  }
};