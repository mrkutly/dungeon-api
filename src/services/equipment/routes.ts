import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Equipment from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

dotenv.config();

const equipmentRoutes = [
  {
    path: '/api/v1/equipment',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const equipment = await Equipment.find();
        res.status(200).json({ equipment });
      }
    ]
  },
  {
    path: '/api/v1/equipment/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const equipment = await Equipment.findOne(req.params.id);
        const resourceUrl = equipment?.resource_url;

        if (resourceUrl) {
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default equipmentRoutes;
