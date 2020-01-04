import { Request, Response } from 'express';
import Race from './entity';

const raceRoutes = [
  {
    path: '/api/v1/races',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const races = await Race.find();
        res.status(200).json({ races });
      }
    ]
  }
];

export default raceRoutes;
