import express, { Router } from 'express';

import * as userController from '../controllers/userController.js';

const router: Router = express.Router();

router.post('/', userController.createUser);

router.get('/', userController.readUsers);

router.get('/:id', userController.readUser);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

export default router;