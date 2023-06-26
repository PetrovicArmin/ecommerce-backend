import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Product } from '../models/products.js';
import { timeStamp } from 'console';

export const readProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products: Product[] = Product.createBatch(
            await PostgresDatabase.db.Products.findAll()
        );

        if (products.length == 0)
            res.status(404).json({
                message: "Resource 'products' does not exist"
            })
        else
            res.status(200).json({
                products: products.map(prod => {
                    return {
                        product: prod.productResponse,
                        links: prod.links
                    };
                })
            });
    } catch(err) {
        res.status(400).json(err);
    }
};

export const readProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instance: any = await PostgresDatabase.db.Products.findByPk(req.params.id)

        if (instance == null) {
            res.status(404).json({
                message: `Resource 'product' with id of ${req.params.id} does not exist`
            })

            return;
        }

        const product: Product = new Product(instance);

        if (req.headers['if-modified-since'] && (new Date(req.headers['if-modified-since']) >= product.lastModified)) {
            res.status(304).json({});
            return;
        }
        
        res.setHeader('Last-Modified', product.lastModified.toUTCString());
        res.status(200).json({
            product: product.productResponse,
            links: product.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
};

export const createProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product: Product = new Product(
            await PostgresDatabase.db.Products.create(req.body)
        );

        res.setHeader('Last-Modified', product.lastModified.toUTCString());

        res.status(200).json({
            product: product.productResponse,
            links: product.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const updateProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.lastModified = new Date();

        const result = await PostgresDatabase.db.Products.update(req.body, { 
            where: { id: req.params.id }, 
            returning: true
        });

        if (result[0] == 0) {
            res.status(404).json({
                message: `Resource 'product' with id of ${req.params.id} does not exist`
            });
            return;
        }

        const product: Product = new Product(result[1][0]);

        res.setHeader('Last-Modified', product.lastModified.toUTCString());

        res.status(200).json({
            product: product.productResponse,
            links: product.links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}

export const deleteProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const numberOfDestroyedRows = await PostgresDatabase.db.Products.destroy({
            where: {
                id: req.params.id
            }
        });

        await PostgresDatabase.db.ProductsCategories.destroy({
            where: {
                productId: req.params.id
            }
        });

        await PostgresDatabase.db.Skus.destroy({
            where: {
                productId: req.params.id
            }
        });

        await PostgresDatabase.db.ProductLogs.destroy({
            where: {
                productId: req.params.id
            }
        });

        if (numberOfDestroyedRows == 0) 
            res.status(404).json({
                message: `Resource 'product' with id of ${req.params.id} does not exist`
            });
        else 
            res.status(200).json({
                message: `Resource 'product' with id of ${req.params.id} successfully deleted`
            });
    } catch(err) {
        res.status(400).json(err);
    }
}

