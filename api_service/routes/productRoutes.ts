import express, { Router } from 'express';

import * as productController from '../controllers/productController.js';
import { authenticate } from '../middleware/authenticator.js';
import { managersFirewall } from '../middleware/firewalls.js';

const router: Router = express.Router();

router.get('/', productController.readProducts);

router.get('/:id', productController.readProduct);

router.post('/', authenticate, managersFirewall, productController.createProduct);

router.put('/:id', authenticate, managersFirewall, productController.updateProduct);

router.delete('/:id', authenticate, managersFirewall, productController.deleteProduct);

router.post('/:id/categories', authenticate, managersFirewall, productController.addCategories);

router.get('/:id/categories', productController.readCategories);

router.delete('/:id/categories', authenticate, managersFirewall, productController.deleteCategories);

export default router;