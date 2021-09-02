const db = require('../db/db');

class BaseModel {

  serialize() {
    const saida = {};

    const propriedades = Object.keys(this);

    propriedades.forEach(propriedade => {
      const valor = this[propriedade];
      
      if(typeof valor === 'boolean') {
        saida[propriedade] = valor ? 1 : 0;
      } else if(valor instanceof Date) {
        saida[propriedade] = valor.toISOString().split('T')[0];
      } else {
        saida[propriedade] = valor;
      }
    });

    return saida;
  }

  insert() {
    const serialized = this.serialize();
    delete serialized.id;

    const serializedKeys = Object.keys(serialized);

    let sql = `INSERT INTO ${this.constructor.table} (`;

    serializedKeys.forEach((propriedade, idx) => {
      sql += propriedade;

      if(idx < serializedKeys.length - 1) sql += ', ';
    });

    sql += ') VALUES (';

    serializedKeys.forEach((_, idx) => {
      sql += '?';

      if(idx < serializedKeys.length - 1) sql += ', ';
    });

    sql += ');';

    const stmt = db.prepare(sql);
    
    const info = stmt.run(Object.values(serialized));
    this.id = info.lastInsertRowid;
    
  }

  update() {
    const serialized = this.serialize();
    const serializedKeys = Object.keys(serialized);

    const values = [];

    let sql = `UPDATE ${this.constructor.table} SET `;

    serializedKeys.forEach((propriedade, idx) => {
      if(propriedade === this.constructor.idField) return;

      sql += propriedade + ' = ?';

      values.push(serialized[propriedade]);

      if(idx < serializedKeys.length - 1) sql += ', ';
    });
    
    sql += ' WHERE id = ' + this.id + ';';
    
    db.prepare(sql).run(values);
  }

  save() {
    if(this.id) {
      return this.update();
    } else {
      return this.insert();
    }
  }

  static delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run([id]);
  }

  static find(conditions = {}, onlyFirst = false, limit = false, offset = 0) {
    let sql = `SELECT * FROM ${this.table} `;

    const superClass = Object.getPrototypeOf(this);
    if(superClass.name !== 'BaseModel' && superClass.idField) {
      const superTable = superClass.table;
      sql += `INNER JOIN ${superTable} ON ${this.table}.${superClass.idField} = ${superTable}.id `;
    }

    const fields = Object.keys(conditions)
    
    const values = [];

    if(fields.length > 0) {
      sql += 'WHERE ';
      for(let i = 0; i < fields.length; i++) {
        
        const field = fields[i];
        const value = conditions[field];

        values.push(value);

        sql += `${field} = ? `;

        if(i < fields.length - 1) sql += ' AND ';
      }
    }

    if(limit) {
      sql += `LIMIT ${offset}, ${limit} `;
    }

    sql += ';';

    const stmt = db.prepare(sql);
    if(superClass.name !== 'BaseModel' && superClass.idField) stmt.expand();

    const results = [];

    for(const row of stmt.iterate(values)){
      const rowObj = new this(row);
      if(onlyFirst) return rowObj;
      results.push(rowObj);
    }
    
    return onlyFirst ? false : results;
  }
}

module.exports = BaseModel;