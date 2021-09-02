import Usuario from './Usuario';
import Vacina from './Vacina';

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

  toJSON() {
    const obj = Object.assign({}, this);
    delete obj.password;
    return obj;
  }

}

module.exports = Paciente;