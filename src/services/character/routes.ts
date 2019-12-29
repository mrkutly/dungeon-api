import { Request, Response } from 'express';

const characterRoutes = [
  {
    path: "/api/v1/characters",
    method: "get",
    handler: [
      async (req: Request, res: Response) => {
        res.status(201).send("Here are some characters");
      }
    ]
  }
];

export default characterRoutes;