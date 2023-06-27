import { NextFunction, Request, RequestHandler, Response } from "express";
import { ProductLog } from "../models/productChangesLog.js";
import PostgresDatabase from "../database/postgresHandler.js";
import { InventoryLog } from "../models/inventoryChangesLog.js";
import { SkuLog } from "../models/skuChangesLog.js";


export const readProductLogs: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productLogs: ProductLog[] = ProductLog.createBatch(
            await PostgresDatabase.db.ProductLogs.findAll( { where: req.query })
        );

        if (productLogs.length == 0)
            res.status(404).json({
                message: "Resource 'productLogs' does not exist"
            })
        else
            res.status(200).json({
                products: productLogs.map(prod => prod.productLogResponse),
                logs: ProductLog.links
            });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const readInventoryLogs: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inventoryLogs: InventoryLog[] = InventoryLog.createBatch(
            await PostgresDatabase.db.InventoryLogs.findAll( { where: req.query })
        );

        if (inventoryLogs.length == 0)
            res.status(404).json({
                message: "Resource 'inventoryLogs' does not exist"
            })
        else
            res.status(200).json({
                inventory: inventoryLogs.map(prod => prod.inventoryLogResponse),
                logs: InventoryLog.links
            });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const readSkuLogs: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skuLogs: SkuLog[] = SkuLog.createBatch(
            await PostgresDatabase.db.SkuLogs.findAll( { where: req.query })
        );

        if (skuLogs.length == 0)
            res.status(404).json({
                message: "Resource 'skuLogs' does not exist"
            })
        else
            res.status(200).json({
                skus: skuLogs.map(prod => prod.skuLogResponse),
                logs: SkuLog.links
            });
    } catch(err) {
        res.status(400).json(err);
    }
}


