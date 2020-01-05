import dotenv from 'dotenv';
import { Request, Response } from 'express';
import SubClass from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

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
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default spellRoutes;
