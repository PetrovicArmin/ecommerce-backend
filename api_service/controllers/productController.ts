import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Product } from '../models/products.js';

export const readProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const result: Product[] = Product.createBatch(await PostgresDatabase.db.Products.findAll());
    console.log(result);
    res.status(200).json(result.map(product => product.productResponse));
};

