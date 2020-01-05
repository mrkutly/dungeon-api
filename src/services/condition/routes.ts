import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Condition from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';


dotenv.config();

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
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default conditionRoutes;
