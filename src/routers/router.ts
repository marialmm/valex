import { Router } from "express";
import "express-async-errors";
import { handleError } from "../middlewares/handleErrorMiddleware.js";
import { cardRouter } from "./cardRouter.js";
import { rechargeRouter } from "./rechargeRouter.js";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(handleError);

export default router;