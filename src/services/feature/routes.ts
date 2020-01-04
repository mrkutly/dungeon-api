import { Request, Response } from 'express';
import Feature from './entity';

const featureRoutes = [
  {
    path: '/api/v1/features',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const features = await Feature.find();
        res.status(200).json({ features });
      }
    ]
  }
];

export default featureRoutes;
