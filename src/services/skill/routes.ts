import { Request, Response } from 'express';
import Skill from './entity';

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
  }
];

export default skillRoutes;
