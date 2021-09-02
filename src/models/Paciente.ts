import Usuario from './Usuario';
import Vacina from './Vacina';
import Sessao from './Sessao';

import { ChildEntity, Column, PrimaryColumn, ManyToOne } from "typeorm";

@ChildEntity()
export default class Paciente extends Usuario {

  @PrimaryColumn()
  id: number;

  @Column()
  comorbidade: boolean;

  @Column()
  profissao: string;

  @Column()
  statusVacinacao: number;

  @ManyToOne(() => Vacina, vacina => vacina.vacinou, {
    cascade: true,
    eager: true
  })
  vacinadoCom: Vacina;

  @ManyToOne(() => Sessao, sessao => sessao.pacientes, {
    eager: true
  })
  agendadoPara: Sessao;

  toJSON(): Object {
    const obj = Object.assign({}, this);
    delete obj.password;
    return obj;
  }

  statusVacinadoStr(): string {
    if(this.vacinadoCom) {
      switch(this.statusVacinacao){
        case 1:
          return `D1(${this.vacinadoCom.fabricante})`;
          break;
        case 2:
          return `D2(${this.vacinadoCom.fabricante})`;
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