import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Category } from '../models/categories.js';

export const readCategories: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const result: Category[] = Category.createBatch(await PostgresDatabase.db.Categories.findAll());
    res.status(200).json(result.map(category => category.categoryResponse));
};

