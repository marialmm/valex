import { Request, Response } from "express";
import { required } from "joi";

import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardServices from "../services/cardServices.js";

interface CreateCardBody {
    employeeId: number;
    type: TransactionTypes;
}

interface Employee {
    id: number;
    fullName: string;
    cpf: string;
    email: string;
    companyId: number;
}

interface ActivateCardBody {
    cvc: string;
    password: string;
}

export async function createCard(req: Request, res: Response) {
    const cardData: CreateCardBody = req.body;
    const employeeData: Employee = res.locals.employee;

    await cardServices.createCard(employeeData, cardData.type);

    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const cardId = parseInt(req.params.cardId);

    if (isNaN(cardId) || !cardId) {
        throw {
            type: "unprocessableEntity",
            message: "Invalid cardId",
        };
    }

    const { cvc, password }: ActivateCardBody = req.body;

    await cardServices.activateCard(cardId, cvc, password);

    res.sendStatus(200);
}

export async function getTransactions(req: Request, res: Response) {
    const cardId = parseInt(req.params.cardId);

    if (!cardId || isNaN(cardId)) {
        throw {
            type: "unprocessableEntity",
            message: "Invalid cardId",
        };
    }

    const transactions = await cardServices.getTransactions(cardId);

    res.send(transactions);
}

export async function blockCard(req: Request, res: Response) {
    const cardId = parseInt(req.params.cardId);
    const password: string = req.body.password;

    if (!cardId || isNaN(cardId)) {
        throw {
            type: "unprocessableEntity",
            message: "Invalid cardId",
        };
    }

    await cardServices.blockCard(cardId, password);

    res.sendStatus(200);
}

export async function unlockCard(req: Request, res: Response) {
    const cardId = parseInt(req.params.cardId);
    const password: string = req.body.password;

    if (!cardId || isNaN(cardId)) {
        throw {
            type: "unprocessableEntity",
            message: "Invalid cardId",
        };
    }

    await cardServices.unlockCard(cardId, password);

    res.sendStatus(200);
}
