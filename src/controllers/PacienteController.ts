import BaseController from './BaseController';
import isAuthenticated from '../middleware/isAuthenticated';
import isAuthenticatedNotAdmin from '../middleware/isAuthenticatedNotAdmin';
import Paciente from '../models/Paciente';

import Utils from '../helpers/utils';

import express from 'express';
import { getConnection } from 'typeorm';

class PacienteController extends BaseController {
  baseUrl = '/paciente';

  middleware = [isAuthenticated, isAuthenticatedNotAdmin];

  constructor(router: express.Router) {
    super(router);

    this.setRoutes([
      {path: '/', method: 'get', callback: this.dashboard_get},
      {path: '/dashboard', method: 'get', callback: this.dashboard_get},
      {path: '/edit', method: 'get', callback: this.edit_get},
      {path: '/edit', method: 'post', callback: this.edit_post},

    ]);
  }

  async dashboard_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Paciente);
    const paciente = await repository.findOne({usuarioId: req.user.id});
    if(!paciente) return res.sendStatus(404);

    let statusMessage;

    if(false /*paciente.agendadoPara*/) {

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

  async edit_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Paciente);
    const paciente = await repository.findOne({usuarioId: req.user.id});

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

  edit_post(req: express.Request, res: express.Response) {}

}

export default PacienteController;