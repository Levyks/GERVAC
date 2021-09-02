import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from "typeorm";
import BaseModel from "./BaseModel";

import Paciente from "./Paciente";
import Local from "./Local";

@Entity()
export default class Sessao extends BaseModel { 

  @PrimaryColumn()
  id: number;

  @Column()
  data: Date;

  @ManyToOne(() => Local, local => local.sessoes, {
    cascade: true,
    eager: true
  })
  local: Local;

  @OneToMany(() => Paciente, paciente => paciente.agendadoPara)
  pacientes: Paciente[];
}