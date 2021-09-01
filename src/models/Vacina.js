const BaseModel = require('./BaseModel');

class Vacina extends BaseModel { 
  static table = 'vacina';

  static idField = 'vacinaId';

  constructor(data, useCompleteIdName = false) {
    super();
    if(!data) return;
    this[useCompleteIdName ? Usuario.idField : 'id'] = data.vacinaId || data.id;

    this.fabricante = data.fabricante;
    this.dosesNecessarias = parseInt(data.dosesNecessarias);
    this.intervaloEntreDoses = parseInt(data.intervaloEntreDoses);
  }
  
}

module.exports = Vacina; 