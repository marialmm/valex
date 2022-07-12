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
import * as cardUtils from "../utils/cardUtils.js";

dotenv.config();

export async function createCard(
    employeeData: Employee,
    type: TransactionTypes
) {
    await cardUtils.checkCardType(type, employeeData.id);

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
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.checkCardActive(cardData.password, false);
    cardUtils.checkCardExpired(cardData.expirationDate);
    cardUtils.validateCvc(cvc, cardData.securityCode);

    const passwordHash = bcrypt.hashSync(password, 10);

    await cardRepository.update(cardId, { password: passwordHash });
}

export async function getTransactions(cardId: number) {
    const cardData = await cardUtils.getCardData(cardId);

    const { balance, payments, recharges } = await cardUtils.calculateBalance(cardId);

    const transactions = {
        balance: balance,
        transactions: payments,
        recharges: recharges,
    };

    return transactions;
}

export async function blockCard(cardId: number, password: string) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.validatePassword(password, cardData.password);
    cardUtils.checkCardExpired(cardData.expirationDate);
    cardUtils.checkCardBlocked(cardData.isBlocked, false);

    await cardRepository.update(cardId, { isBlocked: true });
}

export async function unlockCard(cardId: number, password: string) {
    const cardData = await cardUtils.getCardData(cardId);

    cardUtils.validatePassword(password, cardData.password);
    cardUtils.checkCardExpired(cardData.expirationDate);
    cardUtils.checkCardBlocked(cardData.isBlocked, true);

    await cardRepository.update(cardId, { isBlocked: false });
}
