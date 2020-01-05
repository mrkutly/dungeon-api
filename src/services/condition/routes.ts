import { Request, Response } from 'express';
import axios from 'axios';
import Condition from './entity';
import { checkCache } from '../../middleware/checks';
import RedisClient from '../../utils/RedisClient';

const conditionRoutes = [
  {
    path: '/api/v1/conditions',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const conditions = await Condition.find();
        res.status(200).json({ conditions });
      }
    ]
  },
  {
    path: '/api/v1/conditions/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const condition = await Condition.findOne(req.params.id);
        const resourceUrl = condition?.resource_url;

        if (resourceUrl) {
          const { data } = await axios.get(`http://www.dnd5eapi.co${resourceUrl}`);
          res.status(200).json({ data });
          RedisClient.set(req.path, JSON.stringify({ data }));
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default conditionRoutes;
