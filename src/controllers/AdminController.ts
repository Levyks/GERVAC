import express from 'express';

import BaseController from './BaseController';

import isAuthenticated from '../middleware/isAuthenticated';
import isAuthenticatedAdmin from '../middleware/isAuthenticatedAdmin';

import {Paciente, Local, Vacina} from '../models';

import { Admin, getConnection } from 'typeorm';

class AdminController extends BaseController {
  baseUrl = '/admin';

  middleware = [isAuthenticated, isAuthenticatedAdmin];

  constructor(router: express.Router) {
    super(router);

    this.setRoutes([
      {path: '/', method: 'get', callback: this.dashboard_get},
      {path: '/dashboard', method: 'get', callback: this.dashboard_get},

      {path: '/vacinar', method: 'post', callback: this.vacinar_post},

      {path: '/local', method: 'get', callback: this.local_list_get},
      {path: '/local/list', method: 'get', callback: this.local_list_get},
      {path: '/local/add', method: 'get', callback: this.local_add_get},
      {path: '/local/add', method: 'get', callback: this.local_add_post},
      {path: '/local/edit/:localId', method: 'get', callback: this.local_edit_get},
      {path: '/local/edit/:localId', method: 'post', callback: this.local_edit_post},
      {path: '/local/delete/:localId', method: 'post', callback: this.local_delete_post},

      {path: '/vacina', method: 'get', callback: this.vacina_list_get},
      {path: '/vacina/list', method: 'get', callback: this.vacina_list_get},
      {path: '/vacina/add', method: 'get', callback: this.vacina_add_get},
      {path: '/vacina/add', method: 'get', callback: this.vacina_add_post},
      {path: '/vacina/edit/:vacinaId', method: 'get', callback: this.vacina_edit_get},
      {path: '/vacina/edit/:vacinaId', method: 'post', callback: this.vacina_edit_post},
      {path: '/vacina/delete/:vacinaId', method: 'post', callback: this.vacina_delete_post},
    ]);
  }

  dashboard_get(req: express.Request, res: express.Response) {
    const connection = getConnection();
    const pacientes = connection.getRepository(Paciente).find();
    const locais = connection.getRepository(Local).find();
    const vacinas = connection.getRepository(Vacina).find();

    res.render('admin/dashboard/main', {pacientes, locais, vacinas});
  }

  vacinar_post(req: express.Request, res: express.Response) {
    if(!req.body.vacina || !req.body.pacientes || !req.body.pacientes.length) {
      return res.redirect("/admin");
    }

    const connection = getConnection();

    req.body.pacientes.forEach(async (pacienteId: number) => {
      const paciente = await connection.getRepository(Paciente).findOne({pacienteId});

      if(paciente.vacinadoCom &&  paciente.vacinadoCom.vacinaId != parseInt(req.body.vacina)) return;
      paciente.vacinadoCom = await connection.getRepository(Vacina).findOne({vacinaId: req.body.vacina});

      if(!paciente.statusVacinacao) {
        paciente.statusVacinacao = 0;
      }

      if(paciente.statusVacinacao <2) paciente.statusVacinacao++;

      connection.getRepository(Paciente).save(paciente);
    });

    res.redirect("/admin");
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
    local.nome = req.body.nome;
    local.endereco = req.body.endereco;
    repository.save(local);

    res.redirect('/admin/local/list');
  }

  async local_edit_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const localId = parseInt(req.params.localId);
    const local = await repository.findOne({localId});

    res.render('admin/local/edit', {local: local});
  }

  async local_edit_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const localId = parseInt(req.params.localId);

    const local = await repository.findOne({localId}); 
    local.nome = req.body.nome;
    local.endereco = req.body.endereco;
    repository.save(local);
    
    res.redirect('/admin/local/list');
  }

  async local_delete_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Local);
    const localId = parseInt(req.params.localId);
    const local = await repository.findOne({localId});
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
    
    vacina.fabricante = req.body.fabricante;
    vacina.dosesNecessarias = req.body.dosesNecessarias;
    vacina.intervaloEntreDoses = req.body.intervaloEntreDoses;

    repository.save(vacina);

    res.redirect('/admin/vacina/list');
  }

  async vacina_edit_get(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);

    const vacinaId = parseInt(req.params.vacinaId);
    const vacina = await repository.findOne({vacinaId});

    res.render('admin/vacina/edit', {vacina: vacina});
  }

  async vacina_edit_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);

    const vacinaId = parseInt(req.params.vacinaId);
    const vacina = await repository.findOne({vacinaId});  
    vacina.fabricante = req.body.fabricante;
    vacina.dosesNecessarias = req.body.dosesNecessarias;
    vacina.intervaloEntreDoses = req.body.intervaloEntreDoses;
    repository.save(vacina);
    
    res.redirect('/admin/vacina/list');
  }

  async vacina_delete_post(req: express.Request, res: express.Response) {
    const repository = getConnection().getRepository(Vacina);

    const vacinaId = parseInt(req.params.vacinaId);
    const vacina = await repository.findOne({vacinaId});  
    repository.remove(vacina);

    res.redirect('/admin/vacina/list');
  }
  /* /CRUD VACINA */
}

export default AdminController;