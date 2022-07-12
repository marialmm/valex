import joi from "joi";

export const sendPaymentSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().length(4).pattern(/[0-9]{4}/).required(),
    businessId: joi.number().required(),
    amount: joi.number().min(1).required()
})