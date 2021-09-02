import BaseController from './BaseController';
import Usuario from '../models/Usuario';
import Paciente from '../models/Paciente';

import jwt from 'jsonwebtoken';

import express from 'express';
import { getConnection } from 'typeorm';

class AuthController extends BaseController {
  baseUrl = '/auth';

  constructor(router: express.Router) {
    super(router);

    this.setRoutes([
      {path: '/login', method: "get", callback: this.login_get},
      {path: '/login', method: "post", callback: this.login_post},
      {path: '/register', method: "get", callback: this.register_get},
      {path: '/register', method: "post", callback: this.register_post},
      {path: '/logout', method: "post", callback: this.logout_post},

    ]);
  }

  is_user_logged_in(req: express.Request) {
    const token = req.cookies['jwt-token'];
    if (!token) return false;

    try {
      const decoded: any = jwt.verify(token, process.env.SECRET);
      req.user = {id: decoded.id, isAdmin: decoded.isAdmin};

    } catch {
      return false;

    }

    return true;
  }

  login_get(req: express.Request, res: express.Response) {
    if(this.is_user_logged_in(req)) return res.redirect('/');
    res.render('auth/login', req.query);
  }

  async login_post(req: express.Request, res: express.Response) {
    const requiredFields = ['cpf', 'password'];

    if(!this.validate_post_data(req.body, requiredFields)) return res.status(400).redirect('/auth/login?error=Argumentos faltando');

    //Remove '.' e '-', deixando só os números
    let cpf = req.body.cpf.replace( /\D/g , ""); 

    const repository = getConnection().getRepository(Usuario);

    //Procura o usuário no DB, de acordo com o CPF
    const user = await repository.findOne({cpf});

    //Usuário não existe OU senha errada
    if(!user || !user.autenticar(req.body.password)) return res.status(401).redirect('/auth/login?error=Credenciais inválidas');

    res.cookie('jwt-token', user.generateJwt(), {
      httpOnly: true, 
      maxAge: 6 * 3600 * 1000
    });

    res.redirect('/');
  }

  register_get(req: express.Request, res: express.Response) {
    if(this.is_user_logged_in(req)) return res.redirect('/');
    res.render('auth/register', req.query);
  }

  register_post(req: express.Request, res: express.Response) {

    const requiredFields = ['nome', 'cpf', 'nascimento', 'profissao', 'comorbidade', 'telefone', 'endereco', 'email', 'password'];

    if(!this.validate_post_data(req.body, requiredFields)) return res.status(400).redirect('auth/register?error=Argumentos faltando');

    const paciente = new Paciente();

    paciente.nome = req.body.nome;
    paciente.cpf = req.body.cpf.replace( /\D/g , ""),
    paciente.email = req.body.email;
    paciente.telefone = req.body.telefone;
    paciente.nascimento = new Date(req.body.nascimento);
    paciente.telefone = req.body.telefone.replace( /\D/g , "");
    paciente.endereco = req.body.endereco;

    paciente.comorbidade = req.body.comorbidade == 1;
    paciente.profissao = req.body.profissao;

    paciente.setPassword(req.body.password)

    const repository = getConnection().getRepository(Paciente);
    repository.save(paciente);

    //if(err.message === "UNIQUE constraint failed: usuario.cpf") return res.status(400).redirect('auth/register?error=CPF já cadastrado');

    res.redirect('/auth/login?success=Cadastrado com sucesso');
  }

  logout_post(req: express.Request, res: express.Response) {
    res.clearCookie('jwt-token').redirect('/');    
  }

}

export default AuthController;