import dotenv from 'dotenv';
import axios from 'axios';
import { Request, Response } from 'express';
import MagicSchool from './entity';
import { checkCache } from '../../middleware/checks';
import RedisClient from '../../utils/RedisClient';

dotenv.config();

const magicSchoolRoutes = [
  {
    path: '/api/v1/magic_schools',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const magic_schools = await MagicSchool.find();
        res.status(200).json({ magic_schools });
      }
    ]
  },
  {
    path: '/api/v1/magic_schools/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const magicSchool = await MagicSchool.findOne(req.params.id);
        const resourceUrl = magicSchool?.resource_url;

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

export default magicSchoolRoutes;
