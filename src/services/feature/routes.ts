import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Feature from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

dotenv.config();

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
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default featureRoutes;
