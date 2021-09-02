const Usuario = require('./Usuario');
const BaseModel = require('./BaseModel');
const Vacina = require('./Vacina');

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

  toJSON() {
    const obj = Object.assign({}, this);
    delete obj.password;
    return obj;
  }

  static formatFormData(formData) {
    
    return {
      paciente: {
        comorbidade: parseInt(formData.comorbidade),
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

  statusVacinadoStr(){
    if(this.vacinadoCom) {
      const vacina = Vacina.find({id: this.vacinadoCom}, true);
      switch(this.statusVacinacao){
        case 1:
          return `D1(${vacina.fabricante})`;
          break;
        case 2:
          return `D2(${vacina.fabricante})`;
          break;
        default:
          return "Não";
          break;
      }
    } else {
      return "Não";
    }
    
  }
  
}

module.exports = Paciente;