import * as cardUtils from "../utils/cardUtils.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function sendRecharge(cardId: number, amount: number) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.checkCardExpired(cardData.expirationDate);
    cardUtils.checkCardActive(cardData.password, true);

    await rechargeRepository.insert({cardId, amount});
}