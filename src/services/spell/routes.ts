import { Request, Response } from 'express';
import Spell from './entity';

const spellRoutes = [
  {
    path: '/api/v1/spells',
    method: 'get',
    handler: [
      async (req: Request, res: Response): Promise<void> => {
        const spells = await Spell.find();
        res.status(200).json({ spells });
      }
    ]
  }
];

export default spellRoutes;
