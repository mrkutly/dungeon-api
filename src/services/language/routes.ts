import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Language from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

dotenv.config();

const languageRoutes = [
  {
    path: '/api/v1/languages',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const languages = await Language.find();
        res.status(200).json({ languages });
      }
    ]
  },
  {
    path: '/api/v1/languages/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const language = await Language.findOne(req.params.id);
        const resourceUrl = language?.resource_url;

        if (resourceUrl) {
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default languageRoutes;
