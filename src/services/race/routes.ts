import dotenv from 'dotenv';
import axios from 'axios';
import { Request, Response } from 'express';
import Race from './entity';
import { checkCache } from '../../middleware/checks';
import RedisClient from '../../utils/RedisClient';

dotenv.config();

const raceRoutes = [
  {
    path: '/api/v1/races',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const races = await Race.find();
        res.status(200).json({ races });
      }
    ]
  },
  {
    path: '/api/v1/races/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const race = await Race.findOne(req.params.id);
        const resourceUrl = race?.resource_url;

        if (resourceUrl) {
          const { data } = await axios.get(`${process.env.DND_API_URL}${resourceUrl}`);
          res.status(200).json({ data });
          RedisClient.set(req.path, JSON.stringify({ data }));
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default raceRoutes;
