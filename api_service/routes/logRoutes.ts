import express, { Router } from 'express';

import * as logsController from '../controllers/logsController.js';

const router: Router = express.Router();

router.get('/products', logsController.readProductLogs);

router.get('/skus', logsController.readSkuLogs);

router.get('/inventory', logsController.readInventoryLogs);

export default router;