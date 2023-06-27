import express, { Router } from 'express';

import * as skuController from '../controllers/skuController.js';
import { authenticate } from '../middleware/authenticator.js';
import { workerFirewall } from '../middleware/firewalls.js';

const router: Router = express.Router();

router.post('/', authenticate, workerFirewall, skuController.createSku);

router.get('/', skuController.readSkus);

router.get('/:id', skuController.readSku);

router.put('/:id', authenticate, workerFirewall, skuController.updateSku);

router.delete('/:id', authenticate, workerFirewall, skuController.deleteSku);

export default router;