import { Router } from "express";
import * as cardController from "../controllers/cardControllers.js";
import {
    checkEmployee,
    validateApiKey,
} from "../middlewares/authMiddleware.js";
import { validateJoi } from "../middlewares/joiValidationMiddleware.js";
import {
    activateCardSchema,
    cardPasswordSchema,
    createCardSchema,
} from "../schemas/cardSchemas.js";

export const cardRouter = Router();

cardRouter.post(
    "/cards",
    validateApiKey,
    validateJoi(createCardSchema),
    checkEmployee,
    cardController.createCard
);

cardRouter.patch(
    "/cards/:cardId/activate",
    validateJoi(activateCardSchema),
    cardController.activateCard
);

cardRouter.get("/transactions/:cardId", cardController.getTransactions);

cardRouter.patch(
    "/cards/:cardId/block",
    validateJoi(cardPasswordSchema),
    cardController.blockCard
);

cardRouter.patch(
    "/cards/:cardId/unlock",
    validateJoi(cardPasswordSchema),
    cardController.unlockCard
);
