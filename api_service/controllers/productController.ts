import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Product } from '../models/products.js';
import { ProductCategory } from '../models/productsCategories.js';
import { Category } from '../models/categories.js';
import { Sku } from '../models/skus.js';

export const readProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const result: Sku[] = Sku.createBatch(await PostgresDatabase.db.Skus.findAll());
    console.log(result);
    res.status(200).json(result.map(category => category.skuResponse));
};

