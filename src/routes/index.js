import { Router } from "express";
import authRouter from "./authRouter.js";
import registriesRouter from "./registriesRouter.js";

const router = Router();

router.use(authRouter);
router.use(registriesRouter);

export default router;