import express, { Router } from 'express';

import * as productController from '../controllers/productController.js';

const router: Router = express.Router();

router.get('/', productController.readProducts);

router.get('/:id', productController.readProduct);

router.post('/', productController.createProduct);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

router.post('/:id/categories', productController.addCategories);

router.get('/:id/categories', productController.readCategories);

router.delete('/:id/categories', productController.deleteCategories);

export default router;