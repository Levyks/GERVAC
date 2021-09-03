import express from 'express';

import BaseController from './BaseController';

import isAuthenticated from '../middleware/isAuthenticated';
import isAuthenticatedAdmin from '../middleware/isAuthenticatedAdmin';

import {Paciente, Local, Vacina, Sessao} from '../models';

import { getConnection } from 'typeorm';

class AdminController extends BaseController {
  baseUrl = '/admin';

  middleware = [isAuthenticated, isAuthenticatedAdmin];

  constructor(router: express.Router) {
    super(router);

    this.setRoutes([
      {path: '/', method: 'get', callback: this.dashboard_get},
      {path: '/dashboard', method: 'get', callback: this.dashboard_get},

      {path: '/vacinar', method: 'post', callback: this.vacinar_post},
      {path: '/agendar', method: 'post', callback: this.agendar_post},

      {path: '/alterar-senha/:pacienteId', method: 'get', callback: this.alterar_senha_get},
      {path: '/alterar-senha/:pacienteId', method: 'post', callback: this.alterar_senha_post},

      {path: '/local', method: 'get', callback: this.local_list_get},
      {path: '/local/list', method: 'get', callback: this.local_list_get},
      {path: '/local/add', method: 'get', callback: this.local_add_get},
      {path: '/local/add', method: 'post', callback: this.local_add_post},
      {path: '/local/edit/:localId', method: 'get', callback: this.local_edit_get},
      {path: '/local/edit/:localId', method: 'post', callback: this.local_edit_post},
      {path: '/local/delete/:localId', method: 'post', callback: this.local_delete_post},

      {path: '/vacina', method: 'get', callback: this.vacina_list_get},
      {path: '/vacina/list', method: 'get', callback: this.vacina_list_get},
      {path: '/vacina/add', method: 'get', callback: this.vacina_add_get},
      {path: '/vacina/add', method: 'post', callback: this.vacina_add_post},
      {path: '/vacina/edit/:vacinaId', method: 'get', callback: this.vacina_edit_get},
      {path: '/vacina/edit/:vacinaId', method: 'post', callback: this.vacina_edit_post},
      {path: '/vacina/delete/:vacinaId', method: 'post', callback: this.vacina_delete_post},
    ]);
  }

  async dashboard_get(req: express.Request, res: express.Response) {
    const connection = getConnection();
    const pacientes = await connection.getRepository(Paciente).find();
    const locais = await connection.getRepository(Local).find();
    const vacinas = await connection.getRepository(Vacina).find();

    res.render('admin/dashboard/main', {pacientes, locais, vacinas});
  }

  vacinar_post(req: express.Request, res: express.Response) {
    if(!req.body.vacina || !req.body.pacientes || !req.body.pacientes.length) {
      return res.redirect("/admin");
    }

    const connection = getConnection();

    req.body.pacientes.forEach(async (pacienteId: number) => {
      const paciente = await connection.getRepository(Paciente).findOne({id: pacienteId});

      if(paciente.vacinadoCom &&  paciente.vacinadoCom.id != parseInt(req.body.vacina)) return;
      paciente.vacinadoCom = await connection.getRepository(Vacina).findOne({id: req.body.vacina});

      if(!paciente.statusVacinacao) {
        paciente.statusVacinacao = 0;
      }

      paciente.agendadoPara = null;

      if(paciente.statusVacinacao <2) paciente.statusVacinacao++;

      await connection.getRepository(Paciente).save(paciente);
    });

    res.redirect("/admin");
  }

  async agendar_post(req: express.Request, res: express.Response) {
    if(!req.body.local || !req.body.data || !req.body.pacientes || !req.body.pacientes.length) {
      return res.redirect("/admin");
    }
    const connection = getConnection();
    const repLocal = connection.getRepository(Local);
    const repSessao = connection.getRepository(Sessao);
    const repPaciente = connection.getRepository(Paciente);

    const data = req.body.data;
    const local = await repLocal.findOne({id: req.body.local});

    let sessao = await repSessao.findOne({data: data + ' 00:00:00.000', local});

    if(!sessao) {
      sessao = new Sessao();
      await sessao.generateId();
      sessao.data = new Date(data + 'T00:00');
      sessao.local = local;
      await repSessao.save(sessao);
    } 

    req.body.pacientes.forEach(async (pacienteId: number) => {
      const paciente = await repPaciente.findOne({id: pacienteId});
      paciente.agendadoPara = sessao;
      await repPaciente.save(paciente);
    });

    res.redirect("/admin");
  }

  async alterar_senha_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Paciente);
    const id = parseInt(req.params.pacienteId);
    const paciente = await repository.findOne({id});
    if(!paciente) return res.status(404).redirect('/admin');
    res.render("admin/dashboard/alterar-senha", {paciente});
  }

  async alterar_senha_post(req: express.Request, res: express.Response) {
    if(!req.body.password) return res.status(400).redirect('/admin');

    const repository = getConnection().getRepository(Paciente);
    const id = parseInt(req.params.pacienteId);
    const paciente = await repository.findOne({id});
    paciente.setPassword(req.body.password);
    
    await repository.save(paciente);
    res.status(204).redirect('/admin');
  }

  /* CRUD LOCAL */

  async local_list_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const locais = await repository.find();
    res.render('admin/local/list', {locais: locais});
  }

  local_add_get(req: express.Request, res: express.Response) {
    res.render('admin/local/add');
  }

  local_add_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const local = new Local();

    local.generateId();
    local.nome = req.body.nome;
    local.endereco = req.body.endereco;

    repository.save(local).then(() => {
      return res.redirect('/admin/local/list');
    }).catch(() => {
      return res.status(500).redirect('/admin/local/list');
    })
  }

  async local_edit_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const id = parseInt(req.params.localId);
    const local = await repository.findOne({id});

    res.render('admin/local/edit', {local: local});
  }

  async local_edit_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const id = parseInt(req.params.localId);

    const local = await repository.findOne({id}); 
    local.nome = req.body.nome;
    local.endereco = req.body.endereco;
    repository.save(local).then(() => {
      return res.redirect('/admin/local/list');
    }).catch(() => {
      return res.status(500).redirect('/admin/local/list');
    });
  }

  async local_delete_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const id = parseInt(req.params.localId);
    const local = await repository.findOne({id});
    repository.remove(local);

    res.redirect('/admin/local/list');
  }
  /* /CRUD LOCAL */

  /* CRUD VACINA */

  async vacina_list_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);
    const vacinas = await repository.find();
    res.render('admin/vacina/list', {vacinas: vacinas});
  }

  vacina_add_get(req: express.Request, res: express.Response) {
    res.render('admin/vacina/add');
  }

  vacina_add_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);

    const vacina = new Vacina();
    
    vacina.generateId();
    vacina.fabricante = req.body.fabricante;
    vacina.dosesNecessarias = req.body.dosesNecessarias;
    vacina.intervaloEntreDoses = req.body.intervaloEntreDoses;

    repository.save(vacina).then(() => {
      return res.redirect('/admin/vacina/list');
    }).catch(() => {
      return res.status(500).redirect('/admin/vacina/list');
    });
  }

  async vacina_edit_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);

    const id = parseInt(req.params.vacinaId);
    const vacina = await repository.findOne({id});

    res.render('admin/vacina/edit', {vacina: vacina});
  }

  async vacina_edit_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);

    const id = parseInt(req.params.vacinaId);
    const vacina = await repository.findOne({id});  
    vacina.fabricante = req.body.fabricante;
    vacina.dosesNecessarias = req.body.dosesNecessarias;
    vacina.intervaloEntreDoses = req.body.intervaloEntreDoses;
    repository.save(vacina).then(() => {
      return res.redirect('/admin/vacina/list');
    }).catch(() => {
      return res.status(500).redirect('/admin/vacina/list');
    });
  }

  async vacina_delete_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);

    const id = parseInt(req.params.vacinaId);
    const vacina = await repository.findOne({id});  
    repository.remove(vacina);

    res.redirect('/admin/vacina/list');
  }
  /* /CRUD VACINA */
}

export default AdminController;