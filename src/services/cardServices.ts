import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import {
    TransactionTypes,
    CardInsertData,
    Card,
} from "../repositories/cardRepository.js";
import { Employee } from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { number } from "joi";

dotenv.config();

export async function createCard(
    employeeData: Employee,
    type: TransactionTypes
) {
    await checkCardType(type, employeeData.id);

    const cardNumber: string = faker.finance.creditCardNumber(
        "#### #### #### ####"
    );
    const cardholderName: string = formatCardholderName(employeeData.fullName);
    const expirationDate: string = createExpirationDate();
    const { cvc, encryptedCvc } = createCVC();

    const card: CardInsertData = {
        employeeId: employeeData.id,
        number: cardNumber,
        cardholderName: cardholderName,
        securityCode: encryptedCvc,
        expirationDate: expirationDate,
        isVirtual: false,
        isBlocked: false,
        type: type,
    };

    await cardRepository.insert(card);
}

async function checkCardType(type: TransactionTypes, employeeId: number) {
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

    if (card) {
        throw {
            type: "conflict",
            message: "Employee already owns this card",
        };
    }
}

function formatCardholderName(name: string) {
    const names = name.split(" ");
    let cardholderName: string[] = [names[0]];

    for (let i = 1; i < names.length - 1; i++) {
        const name = names[i];
        if (name.length >= 3) {
            cardholderName.push(name[0]);
        }
    }
    cardholderName.push(names[names.length - 1]);

    return cardholderName.join(" ").toUpperCase();
}

function createExpirationDate() {
    const date = new Date();
    const expirationDate = dayjs(date).add(5, "y").format("MM/YY");
    return expirationDate;
}

function createCVC() {
    const cvc = faker.finance.creditCardCVV();

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const encryptedCvc = cryptr.encrypt(cvc);

    return { cvc, encryptedCvc };
}

export async function activateCard(
    cardId: number,
    cvc: string,
    password: string
) {
    const cardData = await cardRepository.findById(cardId);

    if (!cardData) {
        throw {
            type: "notFound",
            message: "Card not found",
        };
    }

    checkCardActive(cardData.password);
    checkCardExpired(cardData.expirationDate);
    validateCvc(cvc, cardData.securityCode);

    const passwordHash = bcrypt.hashSync(password, 10);

    await cardRepository.update(cardId, { password: passwordHash });
}

function checkCardActive(password: string | null) {
    if (password !== null) {
        throw {
            type: "badRequest",
            message: "Card is already active",
        };
    }
}

function checkCardExpired(expirationDate: string) {
    const date = expirationDate.split("/");
    const formatedDate = dayjs()
        .set("date", 1)
        .set("month", parseInt(date[0])).set("year", parseInt(date[1]))
        .format("DD/MM/YYYY");
    if (new Date() > new Date(formatedDate)) {
        throw {
            type: "badRequest",
            message: "Expired card",
        };
    }
}

function validateCvc(cvcInserted: string, encryptedCvc: string) {
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
