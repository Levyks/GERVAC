import express from 'express';

import MainController from '../controllers/MainController';
import AuthController from '../controllers/AuthController';
import PacienteController from '../controllers/PacienteController';
import AdminController from '../controllers/AdminController';

const router = express.Router();

new MainController(router);
new AuthController(router);
new PacienteController(router);
new AdminController(router);

export default router;