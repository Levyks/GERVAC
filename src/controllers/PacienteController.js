const BaseController = require('./BaseController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedNotAdmin = require('../middleware/isAuthenticatedNotAdmin');
const Paciente = require('../models/Paciente');

class PacienteController extends BaseController {
  static baseUrl = '/paciente';

  static middleware = [isAuthenticated, isAuthenticatedNotAdmin];

  constructor(router) {
    super(router);

    this.setRoutes({
      '/': {GET: this.dashboard_get},
      '/dashboard': {GET: this.dashboard_get}
    });
  }

  dashboard_get(req, res) {
    console.log(req.user);
    res.render('paciente/dashboard');
  }

}

module.exports = PacienteController;