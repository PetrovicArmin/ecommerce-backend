import { NextFunction, Request, Response } from "express";
import { Token } from "../oauth/oauthServer.js";
import { UserType } from "../models/users.js";

export const analystsFirewall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: Token  = req.body.token;
        if (token.user.userType != UserType.SUPPLY_ANALYST) {
            res.status(403).json({
                message: 'Logs are available only to SUPPLY_ANALYST users'
            });
            return;
        }
        next();
    } catch(err) {
        res.status(400).json(err);
    }
}

export const usersFirewall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: Token  = req.body.token;
        if (token.user.id != +req.params.id) {
            res.status(403).json({
                message: 'You only have permission to change your own USER account (id of ' + token.user.id + ')'
            })
            return;
        }
    } catch(err) {
        res.status(400).json(err);
    }
}

export const managersFirewall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: Token = req.body.token;
        if (token.user.userType != UserType.SUPPLY_MANAGER) {
            res.status(403).json({
                message: 'Only SUPPLY_MANAGER can manipulate with resources \'category\' and \'product\''
            })
            return;
        }
    } catch(err) {
        res.status(400).json(err);
    }
}

export const workerFirewall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: Token = req.body.token;

        if (token.user.userType != UserType.SHOP_WORKER) {
            res.status(403).json({
                message: 'Only SHOP_WORKER can manipulate with resource \'SKU\''
            })
            return;
        }
    } catch(err) {
        res.status(400).json(err);
    }
}


