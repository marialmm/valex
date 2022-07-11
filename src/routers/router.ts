import { Router } from "express";
import "express-async-errors";
import { handleError } from "../middlewares/handleErrorMiddleware.js";
import { cardRouter } from "./cardRouter.js";

const router = Router();

router.use(cardRouter);
router.use(handleError);

export default router;