import { Request, Response } from "express";
import * as paymentServices from "../services/paymentServices.js";

export interface SendPaymentBody{
    cardId: number;
    businessId: number;
    amount: number;
    password: string;
}

export async function sendPayment(req: Request, res: Response){
    const {cardId, businessId, amount, password}: SendPaymentBody = req.body;

    await paymentServices.sendPayment({cardId, businessId, amount, password});

    res.sendStatus(200);
}