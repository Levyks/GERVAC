const BaseController = require('./BaseController');
const isAuthenticated = require('../middleware/isAuthenticated');

class MainController extends BaseController {
  static baseUrl = '/';

  static middleware = isAuthenticated;

  constructor(router) {
    super(router);

    this.setRoutes({
      '/': {GET: this.home_get},
    });
  }

  home_get(req, res) {
    if(req.user.isAdmin) {
      res.redirect('/admin');
    } else {
      res.redirect('/paciente');
    }
  }

}

module.exports = MainController;