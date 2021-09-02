import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import Paciente from "./Paciente";

@Entity()
export default class Vacina { 
  
  @PrimaryGeneratedColumn()
  vacinaId: number;

  @Column()
  fabricante: string;

  @Column()
  dosesNecessarias: number;

  @Column()
  intervaloEntreDoses: number;

  @OneToMany(() => Paciente, paciente => paciente.vacinadoCom)
  vacinou: Paciente[];
}