import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Proficiency from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

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
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default proficiencyRoutes;
