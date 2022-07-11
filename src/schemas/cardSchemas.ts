import joi from "joi";

export const createCardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi
        .string()
        .valid("groceries", "restaurants", "transport", "education", "health")
        .required(),
});

export const activateCardSchema = joi.object({
    cvc: joi.string().length(3).required(),
    password: joi.string().length(4).pattern(/[0-9]{4}/).required(),
});

export const cardPasswordSchema = joi.object({
    password: joi.string().length(4).pattern(/[0-9]{4}/).required()
});
