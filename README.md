<p align="center">
  <a href="https://github.com/marialmm/valex">
    <h1 align="center">
    Valex
    </h1>
  </a>

</p>

## Usage

```bash
$ git clone https://github.com/marialmm/valex

$ cd valex

$ npm install

$ npm run dev
```

API:

```
- POST /cards (autenticada)
    - Rota para cadastrar um novo cartão
    - headers: {
        "x-api-key": "$APIKey"
    }
    - body: {
        "employeeId": $id,
        "type": "groceries", "restaurants", "transport", "education" ou "health"
}

- PATCH /cards/:cardId/activate
    - Rota para ativar um cartão
    - headers: {}
    - body: {
        "cvc": "$cvc",
        "password": "$password"
    }

- GET /transactions/:cardId
    - Rota para listar as transações e saldo de um cartão
    - headers: {}
    - body: {}

- PATCH /cards/:cardId/block
    - Rota para bloquear um cartão
    - headers: {}
    - body: {
        "password": "$password"
    }

- PATCH /cards/:cardId/unlock
    - Rota para desbloquear um cartão
    - headers: {}
    - body: {
        "password": "$password"
    }

- POST /recharge (autenticada)
    - Rota para recarregar um cartão
    - headers: {
        "x-api-key": "$APIKey"
    }
    - body: {
        "cardId": $id,
        "amount": $amount
    }

- POST /payment
    - Rota para efetuar uma compra
    - headers: {}
    - body: {
        "cardId": $id,
        "password": "$password",
        "businessId": $id,
        "amount": $amount
    }
```
