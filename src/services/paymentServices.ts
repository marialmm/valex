import { SendPaymentBody } from "../controllers/paymentControllers.js";
import * as cardUtils from "../utils/cardUtils.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

export async function sendPayment({
    cardId,
    businessId,
    amount,
    password,
}: SendPaymentBody) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.checkCardActive(cardData.password, true);
    cardUtils.checkCardExpired(cardData.expirationDate);
    cardUtils.checkCardBlocked(cardData.isBlocked, false);
    cardUtils.validatePassword(password, cardData.password);
    await cardUtils.checkCardAndBusinessType(cardData.type, businessId);
    await cardUtils.checkCardBalance(cardId, amount);

    await paymentRepository.insert({cardId, businessId, amount});
}

