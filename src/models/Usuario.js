const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BaseModel = require('./BaseModel');

const PASSWORD_SALT_ROUNDS = 10;

class Usuario extends BaseModel { 
  static table = 'usuario';

  static idField = 'usuarioId';

  constructor(data, useCompleteIdName = false) {
    super();
    if(!data) return;
    this[useCompleteIdName ? Usuario.idField : 'id'] = data.usuarioId || data.id;
    this.nome = data.nome;
    this.cpf = data.cpf;
    this.email = data.email;
    this.password = data.password;
    this.telefone = data.telefone;
    this.nascimento = (data.nascimento instanceof Date) ? data.nascimento : new Date(data.nascimento);
    this.endereco = data.endereco;
    this.isAdmin = !!data.isAdmin;
  }

  autenticar(senhaInserida) {
    return bcrypt.compareSync(senhaInserida, this.password);
  }

  generateJwt() {
    return jwt.sign({
      id: this.id,
      isAdmin: this.isAdmin
    }, process.env.SECRET, { expiresIn: '6h' });
  }

  setPassword(plainPassword) {
    this.password = bcrypt.hashSync(plainPassword, PASSWORD_SALT_ROUNDS);
  }

  calcIdade() {
    var ageDifMs = Date.now() - this.nascimento.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  
}

module.exports = Usuario;