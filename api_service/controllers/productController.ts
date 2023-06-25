import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Product } from '../models/products.js';
import { ProductCategory } from '../models/productsCategories.js';
import { Category } from '../models/categories.js';
import { Sku } from '../models/skus.js';
import { User } from '../models/users.js';
import { ProductLog } from '../models/productChangesLog.js';

export const readProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const result: ProductLog[] = ProductLog.createBatch(await PostgresDatabase.db.ProductLogs.findAll());
    console.log(result);
    res.status(200).json(result);
};

