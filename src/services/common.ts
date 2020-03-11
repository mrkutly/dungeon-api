import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import RedisClient from '../utils/RedisClient';
import Logger from '../utils/Logger';

dotenv.config();

export const sendDndAPIData = async (
  req: Request,
  res: Response,
  resourceUrl: string
): Promise<void> => {
  try {
    const { data } = await axios.get(`${process.env.DND_API_URL}${resourceUrl}`);
    res.status(200).json({ data });
    RedisClient.set(req.path, JSON.stringify({ data }));
  } catch (error) {
    Logger.data(error);
    res.status(408).json({ error: "Request timed out" });
  }
};