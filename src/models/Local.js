const BaseModel = require('./BaseModel');

class Local extends BaseModel { 
  static table = 'local';

  static idField = 'localId';

  constructor(data, useCompleteIdName = false) {
    super();
    if(!data) return;
    this[useCompleteIdName ? Usuario.idField : 'id'] = data.localId || data.id;

    this.nome = data.nome;
    this.endereco = data.endereco;
  }
  
}

module.exports = Local; 