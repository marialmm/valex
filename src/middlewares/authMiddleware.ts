import { Request, Response, NextFunction } from "express";

import * as companyRepository from "./../repositories/companyRepository.js";
import * as employeeRepository from "./../repositories/employeeRepository.js";

export async function validateApiKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const apiKey: string = req.header("x-api-key");

    if(!apiKey){
        throw {
            type: "badRequest",
            message: "API key is required"
        }
    }

    const company = await companyRepository.findByApiKey(apiKey);
    
    if (!company) {
        throw {
            type: "unauthorized",
            message: "Invalid API Key",
        };
    }

    res.locals.companyId = company.id;
    next();
}

export async function checkEmployee(req: Request, res: Response, next: NextFunction) {
    const employeeId: number = req.body.employeeId;
    const companyId: number = res.locals.companyId;

    const employee = await employeeRepository.findById(employeeId);

    if(!employee){
        throw {
            type: "notFound",
            message: "Employee not found"
        }
    }

    if(employee.companyId !== companyId) {
        throw {
            type: "unauthorized",
            message: "Employee don't belong to company"
        }
    }

    res.locals.employee = employee;
    next();
}
