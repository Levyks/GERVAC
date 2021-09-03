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
    const paciente = await repository.findOne({id: req.user.id});
    if(!paciente) return res.sendStatus(404);

    paciente.telefone = Utils.formatarTelefone(paciente.telefone);

    res.render('paciente/dashboard', {paciente});
  }

  async edit_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Paciente);
    const paciente = await repository.findOne({id: req.user.id});

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

  async edit_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Paciente);
    const paciente = await repository.findOne({id: req.user.id});

    if(!paciente) return res.sendStatus(404);

    paciente.nome = req.body.nome;
    paciente.email = req.body.email;
    paciente.telefone = req.body.telefone;
    paciente.telefone = req.body.telefone.replace( /\D/g , "");
    paciente.endereco = req.body.endereco;

    paciente.comorbidade = req.body.comorbidade == 1;
    paciente.profissao = req.body.profissao;

    if(req.body.password) {
      paciente.setPassword(req.body.password);
    }

    await repository.save(paciente);
    res.redirect('/paciente');
  }
}

export default PacienteController;