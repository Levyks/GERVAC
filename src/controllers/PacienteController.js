const BaseController = require('./BaseController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthenticatedNotAdmin = require('../middleware/isAuthenticatedNotAdmin');
const Paciente = require('../models/Paciente');

const Utils = require('../helpers/utils');

class PacienteController extends BaseController {
  static baseUrl = '/paciente';

  static middleware = [isAuthenticated, isAuthenticatedNotAdmin];

  constructor(router) {
    super(router);

    this.setRoutes({
      '/': {GET: this.dashboard_get},
      '/dashboard': {GET: this.dashboard_get},
      '/edit': {GET: this.edit_get, POST:this.edit_post}
    });
  }

  dashboard_get(req, res) {
    const paciente = Paciente.find({usuarioId: req.user.id}, true);
    if(!paciente) return res.sendStatus(404);

    let statusMessage;

    if(paciente.agendadoPara) {

    } else {
      switch(paciente.statusVacinacao) {
        case 1:
          statusMessage = "Você já tomou a 1º dose, aguarde pelo agendamento da sua 2º dose";
          break;
        case 2:
          statusMessage = "Você já tomou a 2º dose";
          break;
        default:
          statusMessage = "Seu cadastro está validado, aguarde pelo agendamento da sua 1º dose";
          break;
      }
    }

    res.render('paciente/dashboard', {
      paciente: {
        nome: paciente.nome,
        email: paciente.email,
        telefone: Utils.formatarTelefone(paciente.telefone)
      },
      statusMessage
    });
  }

  edit_get(req, res) {
    const paciente = Paciente.find({usuarioId: req.user.id}, true);
    if(!paciente) return res.sendStatus(404);

    res.render('paciente/edit', {
      values: {
        nome: paciente.nome,
        cpf: paciente.cpf,
        nascimento: paciente.nascimento.toISOString().split('T')[0],
        profissao: paciente.profissao,
        comorbidade: paciente.comorbidade,
        telefone: paciente.telefone,
        endereco: paciente.endereco,
        email: paciente.email
      }
    });
  }

  edit_post(req, res) {
    
  }

}

module.exports = PacienteController;