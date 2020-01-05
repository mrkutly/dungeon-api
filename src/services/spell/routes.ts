import dotenv from 'dotenv';
import axios from 'axios';
import { Request, Response } from 'express';
import Spell from './entity';
import { checkCache } from '../../middleware/checks';
import RedisClient from '../../utils/RedisClient';

dotenv.config();

const spellRoutes = [
  {
    path: '/api/v1/spells',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const spells = await Spell.find();
        res.status(200).json({ spells });
      }
    ]
  },
  {
    path: '/api/v1/spells/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const spell = await Spell.findOne(req.params.id);
        const resourceUrl = spell?.resource_url;

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
