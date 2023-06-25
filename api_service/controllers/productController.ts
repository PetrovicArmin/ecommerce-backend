import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Product } from '../models/products.js';
import { ProductCategory } from '../models/productsCategories.js';
import { Category } from '../models/categories.js';

export const readProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const result: Category[] = Category.createBatch(await PostgresDatabase.db.Categories.findAll());
    console.log(result);
    res.status(200).json(result.map(category => category.categoryResponse));
};

