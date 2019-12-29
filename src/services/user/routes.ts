import { Request, Response } from 'express';
import { checkSignupParams } from '../../middleware/checks';

const userRoutes = [
  {
    path: "/api/v1/signup",
    method: "post",
    handler: [
      checkSignupParams,
      async ({ body }: Request, res: Response) => {
        res.status(201).send("Thanks for signing up!");
      }
    ]
  }
];

export default userRoutes;