import { Request, Response, NextFunction, request, response } from "express";

export async function handleError(
    error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(error);
    if (error.type === "unauthorized") {
        res.sendStatus(401);
    } else if (error.type === "notFound") {
        res.sendStatus(404);
    } else if(error.type === "conflict") {
        res.sendStatus(409);
    } else if (error.type === "unprocessableEntity") {
        res.sendStatus(422);
    } else {
        res.sendStatus(500);
    }
}
