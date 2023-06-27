import { RequestHandler, Request, Response, NextFunction } from "express";
import { User } from "../models/users.js";
import PostgresDatabase from "../database/postgresHandler.js";
import isCached from "../middleware/chachingChecker.js";

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
    try {
        const instance: any = await PostgresDatabase.db.Users.findByPk(req.params.id)

        if (instance == null) {
            res.status(404).json({
                message: `Resource 'user' with id of ${req.params.id} does not exist`
            })
            return;
        }

        const user: User = new User(instance);

        if (!isCached(req, res, user.lastModified)) {
            res.status(200).json({
                user: user.userResponse,
                links: user.links
            });
        }
    } catch(err) {
        res.status(400).json(err);
    }
}

export const updateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.lastModified = new Date();

        const result = await PostgresDatabase.db.Users.update(req.body, { 
            where: { id: req.params.id }, 
            returning: true
        });

        if (result[0] == 0) {
            res.status(404).json({
                message: `Resource 'user' with id of ${req.params.id} does not exist`
            });
            return;
        }

        const user: User = new User(result[1][0]);

        res.setHeader('Last-Modified', user.lastModified.toUTCString());

        res.status(200).json({
            product: user.userResponse,
            links: user.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const numberOfDestroyedRows = await PostgresDatabase.db.sq.transaction(async (t) => {

            const destroyed = await PostgresDatabase.db.Users.destroy({
                where: {
                    id: req.params.id
                },
                transaction: t
            });
    
            await PostgresDatabase.db.ProductLogs.destroy({
                where: {
                    changedByUserId: req.params.id
                },
                transaction: t
            });
    
            await PostgresDatabase.db.SkuLogs.destroy({
                where: {
                    changedByUserId: req.params.id
                },
                transaction: t
            });
    
            await PostgresDatabase.db.InventoryLogs.destroy({
                where: {
                    changedByUserId: req.params.id
                },
                transaction: t
            });

            return destroyed;
        })

        if (numberOfDestroyedRows == 0) 
            res.status(404).json({
                message: `Resource 'user' with id of ${req.params.id} does not exist`
            });
        else 
            res.status(200).json({
                message: `Resource 'user' with id of ${req.params.id} successfully deleted`
            });
    } catch(err) {
        res.status(400).json(err);
    }
}
