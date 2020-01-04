import { Request, Response } from 'express';
import Equipment from './entity';

const equipmentRoutes = [
  {
    path: '/api/v1/equipment',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const equipment = await Equipment.find();
        res.status(200).json({ equipment });
      }
    ]
  }
];

export default equipmentRoutes;
