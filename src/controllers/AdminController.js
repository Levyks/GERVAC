const BaseController = require('./BaseController');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedAdmin = require('../middleware/isAuthenticatedAdmin');

class AdminController extends BaseController {
  static baseUrl = '/admin';

  static middleware = [isAuthenticated, isAuthenticatedAdmin];

  constructor(router) {
    super(router);

    this.setRoutes({
      '/': {GET: this.dashboard_get},
      '/dashboard': {GET: this.dashboard_get}
    });
  }

  dashboard_get(req, res) {
    res.render('admin/dashboard');
  }

}

module.exports = AdminController;