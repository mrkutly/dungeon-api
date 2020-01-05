import dotenv from 'dotenv';
import { Request, Response } from 'express';
import CharacterClass from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

dotenv.config();

const classRoutes = [
  {
    path: '/api/v1/character_classes',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const character_classes = await CharacterClass.find();
        res.status(200).json({ character_classes });
      }
    ]
  },
  {
    path: '/api/v1/character_classes/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const character_class = await CharacterClass.findOne(req.params.id);
        const resourceUrl = character_class?.resource_url;

        if (resourceUrl) {
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default classRoutes;
