import { Request, Response } from "express";

import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardServices from "../services/cardServices.js"

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

export async function createCard(req: Request, res: Response) {
    const cardData: CreateCardBody = req.body;
    const employeeData : Employee = res.locals.employee;

    await cardServices.createCard(employeeData, cardData.type);

    res.sendStatus(201);
}
