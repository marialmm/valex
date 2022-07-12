import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import { TransactionTypes, Card } from "../repositories/cardRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function checkCardType(type: TransactionTypes, employeeId: number) {
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

    if (card) {
        throw {
            type: "conflict",
            message: "Employee already owns this card",
        };
    }
}

export async function getCardData(cardId: number) {
    const cardData = await cardRepository.findById(cardId);

    if (!cardData) {
        throw {
            type: "notFound",
            message: "Card not found",
        };
    }

    return cardData;
}

export function checkCardActive(password: string | null, active: boolean) {
    if (password !== null && !active) {
        throw {
            type: "badRequest",
            message: "Card is already active",
        };
    } else if (password === null && active) {
        throw {
            type: "unauthorized",
            message: "Card is not active",
        };
    }
}

export function checkCardExpired(expirationDate: string) {
    const date = expirationDate.split("/");
    const formatedDate = dayjs()
        .set("date", 1)
        .set("month", parseInt(date[0]))
        .set("year", parseInt(date[1]))
        .format("DD/MM/YYYY");
    if (new Date() > new Date(formatedDate)) {
        throw {
            type: "badRequest",
            message: "Expired card",
        };
    }
}

export function validateCvc(cvcInserted: string, encryptedCvc: string) {
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const decryptedCvc = cryptr.decrypt(encryptedCvc);
    console.log(decryptedCvc);

    if (cvcInserted !== decryptedCvc) {
        throw {
            type: "unauthorized",
            message: "Invalid cvc",
        };
    }
}

export function checkCardBlocked(isBlocked: boolean, blocked: boolean) {
    if (isBlocked && !blocked) {
        throw {
            type: "badRequest",
            message: "Card is blocked",
        };
    } else if (!isBlocked && blocked) {
        throw {
            type: "badRequest",
            message: "Card is not blocked",
        };
    }
}

export function validatePassword(password: string, passwordHash: string) {
    if (!bcrypt.compareSync(password, passwordHash)) {
        throw {
            type: "unauthorized",
            message: "Invalid password",
        };
    }
}