import { Request, Response } from 'express';
import { checkUserParams, checkLoginCredentials } from '../../middleware/checks';
import { User } from '../database/entity/User';
import Logger from '../../utils/Logger';
import * as TokenManager from '../../utils/TokenManager';

const userRoutes = [
	{
		path: "/api/v1/signup",
		method: "post",
		handler: [
			checkUserParams,
			async ({ body }: Request, res: Response): Promise<void> => {
				const { email, password } = body;
				const user = new User();
				user.email = email;
				user.password = password;
				const saved = await user.save();
				Logger.info(saved);
				const token = TokenManager.makeToken(user);
				res.status(201).json({ token });
			}
		]
	},
	{
		path: "/api/v1/login",
		method: "post",
		handler: [
			checkUserParams,
			checkLoginCredentials,
			async (req: Request, res: Response): Promise<void> => {
				const token = TokenManager.makeToken(req.user);
				res.status(200).json({ token });
			}
		]
	}
];

export default userRoutes;