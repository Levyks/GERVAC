const Usuario = require('./Usuario');
const BaseModel = require('./BaseModel');

class Paciente extends Usuario { 
  static table = 'paciente';

  static idField = 'pacienteId';

  constructor(data) {
    super(data.usuario, true);

    data = data.paciente;
    this.id = data.id;
    this.comorbidade = !!data.comorbidade;
    this.profissao = data.profissao;
    this.statusVacinacao = data.statusVacinacao;
    this.vacinadoCom = data.vacinadoCom;
    this.agendadoPara = data.agendadoPara;
  }

  static formatFormData(formData) {
    
    return {
      paciente: {
        comorbidade: formData.comorbidade,
        profissao: formData.profissao
      },
      usuario: {
        nome: formData.nome,
        cpf: formData.cpf.replace( /\D/g , ""),
        email: formData.email,
        telefone: formData.telefone.replace( /\D/g , ""),
        nascimento: formData.nascimento,
        endereco: formData.endereco
      }
    }
  }

  save() {
    const usuario = new Usuario(this);
    const paciente = new Paciente({paciente: this});
    
    paciente[Usuario.idField] = this[Usuario.idField];

    usuario.save();

    this[Usuario.idField] = usuario.id;
    paciente[Usuario.idField] = usuario.id;

    //Chama a função original em BaseModel com base em `paciente`
    BaseModel.prototype.save.call(paciente);
    
    this.id = paciente.id;
  }
  
}

module.exports = Paciente;