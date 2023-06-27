import express, { Router } from 'express';

import * as categoryController from '../controllers/categoryController.js';
import { authenticate } from '../middleware/authenticator.js';
import { managersFirewall } from '../middleware/firewalls.js';


const router: Router = express.Router();

router.get('/', categoryController.readCategories);

router.post('/', authenticate, managersFirewall, categoryController.createCategory);

export default router;