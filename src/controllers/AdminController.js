const BaseController = require('./BaseController');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedAdmin = require('../middleware/isAuthenticatedAdmin');

const Paciente = require('../models/Paciente');

class AdminController extends BaseController {
  static baseUrl = '/admin';

  static middleware = [isAuthenticated, isAuthenticatedAdmin];

  constructor(router) {
    super(router);

    this.setRoutes({
      '/': {GET: this.dashboard_get},
      '/dashboard': {GET: this.dashboard_get},
      '/atualizar': {POST: this.atualizar_post}
    });
  }

  dashboard_get(req, res) {
    const pacientes = Paciente.find({});
    res.render('admin/dashboard', {pacientes: pacientes});
  }

  atualizar_post(req, res) {
    if(req.body["select-pacientes"] && req.body["select-pacientes"].length){
      if(req.body.action == "vacinar") {
        req.body["select-pacientes"].forEach(pacienteId => {
          const paciente = Paciente.find({"paciente.id": pacienteId}, true);

          if(paciente.statusVacinacao === null) {
            paciente.statusVacinacao = 0;
          }

          if(paciente.statusVacinacao <2) paciente.statusVacinacao++;

          paciente.save();
        });
      }
    }
    res.redirect("/admin");
  }
}

module.exports = AdminController;