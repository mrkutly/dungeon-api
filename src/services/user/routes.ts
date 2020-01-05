import { Request, Response } from 'express';
import dotenv from 'dotenv';
import {
	checkUserParamsPresent,
	checkPasswordResetParams,
	checkUserParamsValid,
	checkLoginCredentials,
	checkUserDoesNotExist,
	checkResetRequestParams,
	checkPasswordResetToken
} from '../../middleware/checks';
import User from './entity';
import * as TokenManager from '../../utils/TokenManager';
import * as Mailer from '../../utils/Mailer';
import Logger from '../../utils/Logger';
import { isError } from 'util';
import { validate } from 'class-validator';

dotenv.config();

const userRoutes = [
	{
		path: "/api/v1/signup",
		method: "post",
		handler: [
			checkUserParamsPresent,
			checkUserParamsValid,
			checkUserDoesNotExist,
			async ({ user }: Request, res: Response): Promise<void> => {
				await user.save();
				const token = TokenManager.makeToken(user);
				res.status(201).json({ token });
			}
		]
	},
	{
		path: "/api/v1/login",
		method: "post",
		handler: [
			checkUserParamsPresent,
			checkLoginCredentials,
			async (req: Request, res: Response): Promise<void> => {
				const token = TokenManager.makeToken(req.user);
				res.status(200).json({ token });
			}
		]
	},
	{
		path: "/api/v1/request-reset",
		method: "post",
		handler: [
			checkResetRequestParams,
			async (req: Request, res: Response): Promise<void> => {
				const { email } = req.body;

				const { affected, resetToken } = await User.setResetTokenWhereEmail(email);

				if (affected === 1) {

					const mailSentSuccessfully = await Mailer.sendPasswordResetEmail(email, resetToken);

					if (!mailSentSuccessfully) {
						Logger.warn(`api.mailer.rejected - ${email}`);
					}
				}

				res.status(200).json({ message: `An email will be sent to ${email}` });
			}
		]
	},
	{
		path: "/api/v1/reset-password",
		method: "post",
		handler: [
			checkPasswordResetToken,
			checkPasswordResetParams,
			async (req: Request, res: Response): Promise<void> => {
				const { user } = req;
				const { password } = req.body;
				user.password = password;
				const errors = await validate(user);

				if (errors.length > 0) {
					const errorMessages: string[] = [];
					for (const error of errors) {
						errorMessages.push(Object.values(error.constraints).join(', '));
					}
					res.status(400).json({ error: errorMessages.join(', ') });
					return;
				}

				await user.hashPassword();
				await user.save();
				const token = TokenManager.makeToken(user);
				res.status(200).json({ message: "Password successfully reset", token });
			}
		]
	}
];

export default userRoutes;