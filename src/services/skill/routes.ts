import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Skill from './entity';
import { checkCache } from '../../middleware/checks';
import { sendDndAPIData } from '../common';

dotenv.config();

const skillRoutes = [
  {
    path: '/api/v1/skills',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const skills = await Skill.find();
        res.status(200).json({ skills });
      }
    ]
  },
  {
    path: '/api/v1/skills/:id',
    method: 'get',
    handler: [
      checkCache,
      async (req: Request, res: Response): Promise<void> => {
        const skill = await Skill.findOne(req.params.id);
        const resourceUrl = skill?.resource_url;

        if (resourceUrl) {
          sendDndAPIData(req, res, resourceUrl);
        } else {
          res.status(404).json({ error: "Resource not found" });
        }
      }
    ]
  }
];

export default skillRoutes;
