import express, { Router } from 'express';

import * as productController from '../controllers/productController.js';

const router: Router = express.Router();

router.get('/', productController.readProducts);

export default router;