import { Router } from "express";

import * as rechargeController from "../controllers/rechargeControllers.js";
import { validateApiKey } from "../middlewares/authMiddleware.js";
import { validateJoi } from "../middlewares/joiValidationMiddleware.js";
import { sendRechargeSchema } from "../schemas/rechargeSchemas.js";

export const rechargeRouter = Router();

rechargeRouter.post(
    "/recharge",
    validateJoi(sendRechargeSchema),
    validateApiKey,
    rechargeController.sendRecharge
);
