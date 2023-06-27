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
    
}

export const readUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const updateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
}
