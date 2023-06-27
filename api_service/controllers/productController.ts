import {Request, Response, NextFunction, RequestHandler} from 'express';
import PostgresDatabase from '../database/postgresHandler.js';
import { Product } from '../models/products.js';
import isCached from '../middleware/chachingChecker.js';
import { Category } from '../models/categories.js';
import { ProductCategory } from '../models/productsCategories.js';
import { Op } from 'sequelize';

const updateLastModifiedCategory = async (req: Request, res: Response, now: Date) => {
    await PostgresDatabase.db.Products.update({
        lastModifiedCategory: now
    }, { where: { id: req.params.id } });

    res.setHeader('Last-Modified', now.toUTCString());
}

export const readProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products: Product[] = Product.createBatch(
            await PostgresDatabase.db.Products.findAll( { where: req.query })
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

        if (!isCached(req, res, product.lastModified)) {
            res.status(200).json({
                product: product.productResponse,
                links: product.links
            });
        }
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

export const addCategories: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!await PostgresDatabase.db.existsProduct(+req.params.id))
            res.status(404).json({
                message: `Resource 'product' with id of ${req.params.id} does not exist`
            })
        else if (!await PostgresDatabase.db.allCategoriesExist(req.body.categoryIds))
            res.status(404).json({
                message: `Some of the categories sent in body do not exist`
            })
        else {
            await PostgresDatabase.db.ProductsCategories.bulkCreate(req.body.categoryIds.map((categoryId: number) => {
                return {
                    productId: req.params.id,
                    categoryId: categoryId
                }
            }))

            await updateLastModifiedCategory(req, res, new Date());

            res.status(200).json({
                message: `Successfully added resource 'categories' to product with id ${req.params.id}`
            })
        }
    } catch(err) {
        res.status(400).json(err);
    }
}


export const readCategories: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productInstance = await PostgresDatabase.db.Products.findByPk(req.params.id);

        if (productInstance == null) {
            res.status(400).json({
                message: `Resource 'product' with id of ${req.params.id} does not exist`
            })
            return;
        }

        const product: Product = new Product(productInstance);

        if (!isCached(req, res, product.lastModifiedCategory)) {
            const productsCategories: ProductCategory[] = ProductCategory.createBatch(
                await PostgresDatabase.db.ProductsCategories.findAll({ where: { productId: req.params.id } })
            );

            const categoryIds: number[] = productsCategories.map(prodCat => prodCat.categoryId);


            if (categoryIds.length == 0) {
                res.status(404).json({
                    message: `Resource 'categories' has not been found on server`
                });
                return;
            }

            const categories: Category[] = Category.createBatch(
                await PostgresDatabase.db.Categories.findAll({
                    where: {
                        id: {
                            [Op.in]: categoryIds
                        }
                    }
                })
            );


            res.status(200).json({
                categories: categories.map(category => category.categoryResponse),
                links: [...Category.links, ...product.links]
            })
        }
    } catch(err) {
        res.status(400).json(err);
    }
}

export const deleteCategories: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.categories == undefined) {
            res.status(400).json({ message: 'Categories for deletion not found in query. Please provide them.' });
            return;
        }

        const productInstance = await PostgresDatabase.db.Products.findByPk(+req.params.id);

        if (productInstance == null) {
            res.status(404).json({
                message: `Resource 'product' with id of ${req.params.id} does not exist`
            })
            return;
        }

        const categoryIds: number[] = JSON.parse(req.query.categories.toString());
        
        if (!await PostgresDatabase.db.allCategoriesExist(categoryIds)) {
            res.status(404).json({
                message: "Resource 'categories' does not exist on server"
            });
            return;
        }

        const numOfDeletedRows: number = await PostgresDatabase.db.ProductsCategories.destroy({
            where: {
                categoryId: {
                    [Op.in]: categoryIds
                }
            }
        });

        if (numOfDeletedRows == 0) {
            res.status(400).json({
                message: 'Product is not related with given categories'
            })
            return;
        }

        await updateLastModifiedCategory(req, res, new Date());

        res.status(200).json({
            message: `Successfully deleted categories from product with id of ${req.params.id}`,
            links: new Product(productInstance).links
        });
    } catch(err) {
        res.status(400).json(err);
    }
}


