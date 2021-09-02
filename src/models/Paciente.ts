import Usuario from './Usuario';
import Vacina from './Vacina';

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export default class Paciente extends Usuario {

  @PrimaryGeneratedColumn()
  pacienteId: number;

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