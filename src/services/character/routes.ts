import { Request, Response } from 'express';
import { checkAuthorizationHeader, checkCharacterParams } from '../../middleware/checks';
import Character, { CharacterParams, characterRelations } from './entity';

const characterRoutes = [
  {
    path: "/api/v1/characters",
    method: "get",
    handler: [
      checkAuthorizationHeader,
      async (req: Request, res: Response): Promise<void> => {
        const characters = await Character.find({
          where: { user: req.user },
          relations: characterRelations
        });
        res.status(200).json({ characters });
      }
    ]
  },
  {
    path: "/api/v1/characters",
    method: "post",
    handler: [
      checkAuthorizationHeader,
      checkCharacterParams,
      async (req: Request, res: Response): Promise<void> => {
        const character = await Character.createFromCharacterParams({ ...req.body, user: req.user } as CharacterParams);

        if (character instanceof Error || character === undefined) {
          res.status(500).json({ error: "There was an issue saving the character" });
          return;
        }

        res.status(201).json({ character });
      }
    ]
  }
];

export default characterRoutes;