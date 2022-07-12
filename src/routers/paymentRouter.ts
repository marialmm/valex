import { Router } from "express";

import { validateJoi } from "../middlewares/joiValidationMiddleware.js";
import { sendPaymentSchema } from "../schemas/paymentSchemas.js";
import * as paymentControllers from "../controllers/paymentControllers.js";

export const paymentRouter = Router();

paymentRouter.post(
    "/payment",
    validateJoi(sendPaymentSchema),
    paymentControllers.sendPayment
);
