const express = require('express');

const MainController = require('../controllers/MainController');
const AuthController = require('../controllers/AuthController');
const PacienteController = require('../controllers/PacienteController');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

new MainController(router);
new AuthController(router);
new PacienteController(router);
new AdminController(router);

module.exports = router;