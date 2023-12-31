import { NextFunction, Request, RequestHandler, Response } from "express";
import { Sku } from "../models/skus.js";
import PostgresDatabase from "../database/postgresHandler.js";
import isCached from "../middleware/chachingChecker.js";
import kafkaCluster from "../kafka/kafkaCluster.js";
import ChangeType from "../models/changeType.js";

export const createSku: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const sku: Sku = new Sku(
            await PostgresDatabase.db.Skus.create(req.body)
        );

        res.setHeader('Last-Modified', sku.lastModified.toUTCString());

        await kafkaCluster.skusEvent(sku.skuResponse.id, req.body.token.user.id, ChangeType.INSERT_ROW);

        res.status(200).json({
            sku: sku.skuResponse,
            links: sku.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const readSkus: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skus: Sku[] = Sku.createBatch(
            await PostgresDatabase.db.Skus.findAll({ where: req.query })
        )

        if (skus.length == 0) {
            res.status(404).json({
                message: "There are no 'Sku' resources that match your search"
            });
            return;
        }

        res.status(200).json({
            skus: skus.map(sku => {
                return {
                    sku: sku.skuResponse,
                    links: sku.links
                }
            })
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const readSku: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instance: any = await PostgresDatabase.db.Skus.findByPk(req.params.id)

        if (instance == null) {
            res.status(404).json({
                message: `Resource 'sku' with id of ${req.params.id} does not exist`
            })
            return;
        }

        const sku: Sku = new Sku(instance);

        if (!isCached(req, res, sku.lastModified)) {
            res.status(200).json({
                sku: sku.skuResponse,
                links: sku.links
            });
        }
    } catch(err) {
        res.status(400).json(err);
    }
};

export const updateSku: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.lastModified = new Date();

        const oldInstance = await PostgresDatabase.db.Skus.findOne({ where: { id: req.params.id } });

        const result = await PostgresDatabase.db.Skus.update(req.body, { 
            where: { id: req.params.id }, 
            returning: true
        });

        if (result[0] == 0) {
            res.status(404).json({
                message: `Resource 'sku' with id of ${req.params.id} does not exist`
            });
            return;
        }

        const sku: Sku = new Sku(result[1][0]);
        const old: Sku = new Sku(oldInstance);

        if (old.skuResponse.quantityInStock != sku.skuResponse.quantityInStock) {
            const change: number = old.skuResponse.quantityInStock - sku.skuResponse.quantityInStock;

            const type: ChangeType = change > 0 ? ChangeType.QUANTITY_REDUCTION : ChangeType.QUANTITY_INCREASE;

            await kafkaCluster.inventoryEvent(sku.skuResponse.id, req.body.token.user.id, type, Math.abs(change));
        } else {
            await kafkaCluster.skusEvent(sku.skuResponse.id, req.body.token.user.id, ChangeType.UPDATE_ROW);
        }


        res.setHeader('Last-Modified', sku.lastModified.toUTCString());

        res.status(200).json({
            product: sku.skuResponse,
            links: sku.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const deleteSku: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const numberOfDestroyedRows = await PostgresDatabase.db.Skus.destroy({
            where: {
                id: req.params.id
            }
        });

        if (numberOfDestroyedRows == 0) 
            res.status(404).json({
                message: `Resource 'sku' with id of ${req.params.id} does not exist`
            });
        else {
            await kafkaCluster.skusEvent(+req.params.id, req.body.token.user.id, ChangeType.DELETE_ROW);
            res.status(200).json({
                message: `Resource 'sku' with id of ${req.params.id} successfully deleted`
            });
        }
    } catch(err) {
        res.status(400).json(err);
    }
}

