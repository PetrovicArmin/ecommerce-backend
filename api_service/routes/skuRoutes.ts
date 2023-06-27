import express, { Router } from 'express';

import * as skuController from '../controllers/skuController.js';

const router: Router = express.Router();

router.post('/', skuController.createSku)

export default router;