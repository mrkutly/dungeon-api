import { Request, Response } from 'express';
import Language from './entity';

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
  }
];

export default languageRoutes;
