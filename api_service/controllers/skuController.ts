import { NextFunction, Request, RequestHandler, Response } from "express";
import { Sku } from "../models/skus.js";
import PostgresDatabase from "../database/postgresHandler.js";

export const createSku: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const sku: Sku = new Sku(
            await PostgresDatabase.db.Skus.create(req.body)
        );

        res.setHeader('Last-Modified', sku.lastModified.toUTCString());

        res.status(200).json({
            sku: sku.skuResponse,
            links: sku.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}
