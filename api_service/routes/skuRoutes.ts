import express, { Router } from 'express';

import * as skuController from '../controllers/skuController.js';

const router: Router = express.Router();

router.post('/', skuController.createSku);

router.get('/', skuController.readSkus);

router.get('/:id', skuController.readSku);

export default router;