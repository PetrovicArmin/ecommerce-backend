import express, { Router } from 'express';

import * as categoryController from '../controllers/categoryController.js';

const router: Router = express.Router();

router.get('/', categoryController.readCategories);

export default router;