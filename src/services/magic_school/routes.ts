import { Request, Response } from 'express';
import MagicSchool from './entity';

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
  }
];

export default magicSchoolRoutes;
