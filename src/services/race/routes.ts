import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Race from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

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
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default raceRoutes;
