import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import BaseModel from "./BaseModel";

import Paciente from "./Paciente";

@Entity()
export default class Vacina extends BaseModel { 

  @PrimaryColumn()
  id: number;

  @Column()
  fabricante: string;

  @Column()
  dosesNecessarias: number;

  @Column()
  intervaloEntreDoses: number;

  @OneToMany(() => Paciente, paciente => paciente.vacinadoCom)
  vacinou: Paciente[];
}