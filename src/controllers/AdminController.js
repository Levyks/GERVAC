const BaseController = require('./BaseController');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedAdmin = require('../middleware/isAuthenticatedAdmin');

const Paciente = require('../models/Paciente');
const Local = require('../models/Local');
const Vacina = require('../models/Vacina');

class AdminController extends BaseController {
  static baseUrl = '/admin';

  static middleware = [isAuthenticated, isAuthenticatedAdmin];

  constructor(router) {
    super(router);

    this.setRoutes({
      '/': {GET: this.dashboard_get},

      '/dashboard': {GET: this.dashboard_get},
      '/atualizar': {POST: this.atualizar_post},
      '/vacinar': {POST: this.vacinar_post},

      '/local': {GET: this.local_list_get},
      '/local/list': {GET: this.local_list_get},
      '/local/add': {GET: this.local_add_get, POST: this.local_add_post},
      '/local/edit/:localId': {GET: this.local_edit_get, POST: this.local_edit_post},
      '/local/delete/:localId': {POST: this.local_delete_post},

      '/vacina': {GET: this.vacina_list_get},
      '/vacina/list': {GET: this.vacina_list_get},
      '/vacina/add': {GET: this.vacina_add_get, POST: this.vacina_add_post},
      '/vacina/edit/:vacinaId': {GET: this.vacina_edit_get, POST: this.vacina_edit_post},
      '/vacina/delete/:vacinaId': {POST: this.vacina_delete_post}
    });
  }

  dashboard_get(req, res) {
    const pacientes = Paciente.find();
    const locais = Local.find();
    const vacinas = Vacina.find()

    res.render('admin/dashboard/main', {pacientes, locais, vacinas});
  }

  vacinar_post(req, res) {
    if(!req.body.vacina || !req.body.pacientes || !req.body.pacientes.length) {
      return res.redirect("/admin");
    }

    req.body.pacientes.forEach(pacienteId => {
      const paciente = Paciente.find({"paciente.id": pacienteId}, true);

      if(paciente.vacinadoCom &&  paciente.vacinadoCom != parseInt(req.body.vacina)) return;
      paciente.vacinadoCom = parseInt(req.body.vacina);

      if(!paciente.statusVacinacao) {
        paciente.statusVacinacao = 0;
      }

      if(paciente.statusVacinacao <2) paciente.statusVacinacao++;


      paciente.save();
    });

    res.redirect("/admin");
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

  /* CRUD LOCAL */

  local_list_get(req, res) {
    const locais = Local.find();
    res.render('admin/local/list', {locais: locais});
  }

  local_add_get(req, res) {
    res.render('admin/local/add');
  }

  local_add_post(req, res) {
    const local = new Local({nome: req.body.nome, endereco: req.body.endereco});
    local.save();

    res.redirect('/admin/local/list');
  }

  local_edit_get(req, res) {
    const id = req.params.localId;
    const local = Local.find({id}, true);

    res.render('admin/local/edit', {local: local});
  }

  local_edit_post(req, res) {
    const id = req.params.localId;
    const local = Local.find({id}, true);  
    local.nome = req.body.nome;
    local.endereco = req.body.endereco;
    local.save();
    
    res.redirect('/admin/local/list');
  }

  local_delete_post(req, res) {
    const id = req.params.localId;
    Local.delete(id);

    res.redirect('/admin/local/list');
  }
  /* /CRUD LOCAL */

  /* CRUD VACINA */

  vacina_list_get(req, res) {
    const vacinas = Vacina.find();
    res.render('admin/vacina/list', {vacinas: vacinas});
  }

  vacina_add_get(req, res) {
    res.render('admin/vacina/add');
  }

  vacina_add_post(req, res) {
    const vacina = new Vacina({
      fabricante: req.body.fabricante, 
      dosesNecessarias: req.body.dosesNecessarias,
      intervaloEntreDoses: req.body.intervaloEntreDoses
    });

    vacina.save();

    res.redirect('/admin/vacina/list');
  }

  vacina_edit_get(req, res) {
    const id = req.params.vacinaId;
    const vacina = Vacina.find({id}, true);

    res.render('admin/vacina/edit', {vacina: vacina});
  }

  vacina_edit_post(req, res) {
    const id = req.params.vacinaId;
    const vacina = Vacina.find({id}, true);  
    vacina.fabricante = req.body.fabricante;
    vacina.dosesNecessarias = req.body.dosesNecessarias;
    vacina.intervaloEntreDoses = req.body.intervaloEntreDoses;
    vacina.save();
    
    res.redirect('/admin/vacina/list');
  }

  vacina_delete_post(req, res) {
    const id = req.params.vacinaId;
    Vacina.delete(id);

    res.redirect('/admin/vacina/list');
  }
  /* /CRUD VACINA */
}

module.exports = AdminController;