import dotenv from 'dotenv';
import axios from 'axios';
import { Request, Response } from 'express';
import Proficiency from './entity';
import { checkCache } from '../../middleware/checks';
import RedisClient from '../../utils/RedisClient';

dotenv.config();

const proficiencyRoutes = [
  {
    path: '/api/v1/proficiencies',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const proficiencies = await Proficiency.find();
        res.status(200).json({ proficiencies });
      }
    ]
  },
  {
    path: '/api/v1/proficiencies/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const proficiency = await Proficiency.findOne(req.params.id);
        const resourceUrl = proficiency?.resource_url;

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

export default proficiencyRoutes;
