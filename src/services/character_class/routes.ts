import { Request, Response } from 'express';
import CharacterClass from './entity';

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
  }
];

export default classRoutes;
