const BaseController = require('./BaseController');
const Usuario = require('../models/Usuario');
const Paciente = require('../models/Paciente');

const jwt = require('jsonwebtoken');

class AuthController extends BaseController {
  static baseUrl = '/auth';

  constructor(router) {
    super(router);

    this.setRoutes({
      '/login': {GET: this.login_get, POST: this.login_post},
      '/register': {GET: this.register_get, POST: this.register_post},
      '/logout': {POST: this.logout_post}
    });
  }

  is_user_logged_in(req) {
    const token = req.cookies['jwt-token'];
    if (!token) return false;

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = {id: decoded.id, isAdmin: decoded.isAdmin};

    } catch {
      return false;

    }

    return true;
  }

  login_get(req, res) {
    if(this.is_user_logged_in(req)) return res.redirect('/');
    res.render('auth/login', req.query);
  }

  login_post(req, res) {
    const requiredFields = ['cpf', 'password'];

    if(!this.validate_post_data(req.body, requiredFields)) return res.status(400).redirect('/auth/login?error=Argumentos faltando');


    //Remove '.' e '-', deixando só os números
    let cpf = req.body.cpf.replace( /\D/g , ""); 

    //Procura o usuário no DB, de acordo com o CPF
    const user = Usuario.find({cpf}, true);

    //Usuário não existe OU senha errada
    if(!user || !user.autenticar(req.body.password)) return res.status(401).redirect('/auth/login?error=Credenciais inválidas');

    res.cookie('jwt-token', user.generateJwt(), {
      httpOnly: true, 
      maxAge: 6 * 3600 * 1000
    });

    res.redirect('/');
  }

  register_get(req, res) {
    if(this.is_user_logged_in(req)) return res.redirect('/');
    res.render('auth/register', req.query);
  }

  register_post(req, res, self = this) {

    const requiredFields = ['nome', 'cpf', 'nascimento', 'profissao', 'comorbidade', 'telefone', 'endereco', 'email', 'password'];

    if(!self.validate_post_data(req.body, requiredFields)) return res.status(400).redirect('auth/register?error=Argumentos faltando');

    const paciente = new Paciente(Paciente.formatFormData(req.body));
    paciente.setPassword(req.body.password)

    try {
      paciente.save();
    } catch (err) {
      if(err.message === "UNIQUE constraint failed: usuario.cpf") return res.status(400).redirect('auth/register?error=CPF já cadastrado');
    }

    res.redirect('/auth/login?success=Cadastrado com sucesso');
  }

  logout_post(req, res) {
    res.clearCookie('jwt-token').redirect('/');    
  }

}

module.exports = AuthController;