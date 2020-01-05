import { Request, Response } from 'express';
import axios from 'axios';
import Feature from './entity';
import { checkCache } from '../../middleware/checks';
import RedisClient from '../../utils/RedisClient';


const featureRoutes = [
  {
    path: '/api/v1/features',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const features = await Feature.find();
        res.status(200).json({ features });
      }
    ]
  },
  {
    path: '/api/v1/features/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const feature = await Feature.findOne(req.params.id);
        const resourceUrl = feature?.resource_url;

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

export default featureRoutes;
