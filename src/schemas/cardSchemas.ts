import joi from "joi";

export const createCardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi
        .string()
        .valid("groceries", "restaurants", "transport", "education", "health")
        .required()
});
