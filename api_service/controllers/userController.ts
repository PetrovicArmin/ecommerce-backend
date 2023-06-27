import { RequestHandler, Request, Response, NextFunction } from "express";
import { User } from "../models/users.js";
import PostgresDatabase from "../database/postgresHandler.js";

export const createUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user: User = new User(
            await PostgresDatabase.db.Users.create(req.body)
        );

        res.setHeader('Last-Modified', user.lastModified.toUTCString());

        res.status(200).json({
            user: user.userResponse,
            links: user.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const readUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: User[] = User.createBatch(
            await PostgresDatabase.db.Users.findAll({ where: req.query })
        )

        if (users.length == 0) {
            res.status(404).json({
                message: "There are no 'User' resources that match your search"
            });
            return;
        }

        res.status(200).json({
            skus: users.map(user => {
                return {
                    sku: user.userResponse,
                    links: user.links
                }
            })
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const readUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const updateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
}
