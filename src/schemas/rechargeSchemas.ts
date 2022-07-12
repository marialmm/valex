import joi from "joi";

export const sendRechargeSchema = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().min(1).required()
});