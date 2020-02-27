import { Request, Response } from 'express';
import Character, { CharacterParams, characterRelations } from './entity';
import {
  checkAuthorizationHeader,
  checkCharacterParams,
  checkCharacterUpdateParams,
  checkCharacterBelongsToUser
} from '../../middleware/checks';

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
    path: "/api/v1/characters/:id",
    method: "get",
    handler: [
      checkAuthorizationHeader,
      async (req: Request, res: Response): Promise<void> => {
        const character = await Character.findOne({
          where: { user: req.user, id: req.params.id },
          relations: characterRelations
        });

        if (typeof character === 'undefined') {
          res.status(400).json({ error: `Character not found.` });
          return;
        }

        res.status(200).json({ character });
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
        const character = await Character.createFromCharacterParams({
          ...req.body,
          user: req.user
        } as CharacterParams);

        if (character instanceof Error || character === undefined) {
          res.status(500).json({ error: "There was an issue saving the character" });
          return;
        }

        res.status(201).json({ character });
      }
    ]
  },
  {
    path: "/api/v1/characters/:id",
    method: 'patch',
    handler: [
      checkAuthorizationHeader,
      checkCharacterBelongsToUser,
      checkCharacterUpdateParams,
      async (req: Request, res: Response): Promise<void> => {
        const { character } = req;
        const updated = await character.updateFromParams(req.body.character);

        if (updated instanceof Error) {
          res.status(500).json({ error: "There was an issue saving the character" });
          return;
        }

        res.status(200).json({ message: 'successfully updated', character: updated });
      }
    ]
  },
  {
    path: "/api/v1/characters/:id",
    method: 'put',
    handler: [
      checkAuthorizationHeader,
      checkCharacterBelongsToUser,
      checkCharacterUpdateParams,
      async (req: Request, res: Response): Promise<void> => {
        const { character } = req;
        const updated = await character.setFromParams(req.body.character);

        if (updated instanceof Error) {
          res.status(500).json({ error: "There was an issue saving the character" });
          return;
        }

        res.status(200).json({ message: 'successfully updated', character: updated });
      }
    ]
  },
  {
    path: "/api/v1/characters/:id",
    method: 'delete',
    handler: [
      checkAuthorizationHeader,
      checkCharacterBelongsToUser,
      async (req: Request, res: Response): Promise<void> => {
        try {
          const { character } = req;
          await Character.delete(character.id);
          res.status(200).json({ deleted: character.id });
        } catch (error) {
          res.status(500).json({ error: "There was a problem deleting the character." });
        }
      }
    ]
  }
];

export default characterRoutes;