import { Request, Response } from 'express';
import Condition from './entity';

const conditionRoutes = [
  {
    path: '/api/v1/conditions',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const conditions = await Condition.find();
        res.status(200).json({ conditions });
      }
    ]
  }
];

export default conditionRoutes;
