import { Request, Response } from 'express';
import { checkAuthorizationHeader } from '../../middleware/checks';

const characterRoutes = [
  {
    path: "/api/v1/characters",
    method: "get",
    handler: [
      checkAuthorizationHeader,
      async (req: Request, res: Response): Promise<void> => {
        const characters = req.user.characters || [];
        res.status(200).json({ characters: characters });
      }
    ]
  }
];

export default characterRoutes;