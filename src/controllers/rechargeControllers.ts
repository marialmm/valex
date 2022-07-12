import { Request, Response } from "express";

import * as rechargeServices from "../services/rechargeServices.js";

interface SendRechargeBody{
    cardId: number;
    amount: number;
}

export async function sendRecharge(req: Request, res: Response) {
    const {cardId, amount}: SendRechargeBody = req.body;
    
    await rechargeServices.sendRecharge(cardId, amount);

    res.sendStatus(200);
}