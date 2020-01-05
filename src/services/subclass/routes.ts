import dotenv from 'dotenv';
import axios from 'axios';
import { Request, Response } from 'express';
import SubClass from './entity';
import { checkCache } from '../../middleware/checks';
import RedisClient from '../../utils/RedisClient';

dotenv.config();

const spellRoutes = [
  {
    path: '/api/v1/subclasses',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const subclasses = await SubClass.find();
        res.status(200).json({ subclasses });
      }
    ]
  },
  {
    path: '/api/v1/subclasses/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const subclass = await SubClass.findOne(req.params.id);
        const resourceUrl = subclass?.resource_url;

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

export default spellRoutes;
