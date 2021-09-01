const BaseController = require('./BaseController');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedAdmin = require('../middleware/isAuthenticatedAdmin');

const Paciente = require('../models/Paciente');
const Local = require('../models/Local');

class AdminController extends BaseController {
  static baseUrl = '/admin';

  static middleware = [isAuthenticated, isAuthenticatedAdmin];

  constructor(router) {
    super(router);

    this.setRoutes({
      '/': {GET: this.dashboard_get},
      '/dashboard': {GET: this.dashboard_get},
      '/atualizar': {POST: this.atualizar_post},

      '/local': {GET: this.local_view_get},
      '/local/view': {GET: this.local_view_get},
      '/local/add': {GET: this.local_add_get, POST: this.local_add_post},
      '/local/edit/:localId': {GET: this.local_edit_get},
    });
  }

  dashboard_get(req, res) {
    const pacientes = Paciente.find();
    res.render('admin/dashboard', {pacientes: pacientes});
  }

  local_view_get(req, res) {
    const locais = Local.find()
    res.render('admin/local/view', {locais: locais});
  }

  local_add_get(req, res) {
    res.render('admin/local/add');
  }

  local_add_post(req, res) {
    const local = new Local({nome: req.body.nome, endereco: req.body.endereco});
    local.save();

    res.redirect('/admin/local/view');
  }

  local_edit_get(req, res) {
    res.send("TO DO");
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