import { Request, Response } from 'express';
import Proficiency from './entity';

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
  }
];

export default proficiencyRoutes;
