import express, { Router } from 'express';

import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticator.js';
import { usersFirewall } from '../middleware/firewalls.js';

const router: Router = express.Router();

router.post('/', userController.createUser);

router.post('/login', userController.login)

router.get('/', userController.readUsers);

router.get('/:id', userController.readUser);

router.put('/:id', authenticate, usersFirewall, userController.updateUser);

router.delete('/:id', authenticate, usersFirewall, userController.deleteUser);

export default router;