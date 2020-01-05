import dotenv from 'dotenv';
import { Request, Response } from 'express';
import MagicSchool from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

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
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default magicSchoolRoutes;
