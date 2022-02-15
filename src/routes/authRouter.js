import { Router } from 'express'
import { signIn, signUp } from '../controllers/authController.js';
import { validateSignUpSchema } from '../middlewares/validateSignUpSchema.js'

const authRouter = Router();

authRouter.post('/sign-in', signIn);
authRouter.post('/sign-up', validateSignUpSchema, signUp);

export default authRouter;