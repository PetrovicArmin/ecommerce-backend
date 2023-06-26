import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Category } from '../models/categories.js';

export const readCategories: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const categories: Category[] = Category.createBatch(
        await PostgresDatabase.db.Categories.findAll()
    );

    if (categories.length == 0)
        res.status(404).json({
            message: "Resource 'categories' does not exist"
        });
    else 
        res.status(200).json({
            categories: categories.map(category => category.categoryResponse),
            links: Category.links
        });
};

export const createCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category: Category = new Category(
            await PostgresDatabase.db.Categories.create(req.body)
        ); 
        res.status(200).json({
            category: category.categoryResponse,
            links: Category.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}



