import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import BaseModel from "./BaseModel";

import Sessao from './Sessao';

@Entity()
export default class Local extends BaseModel { 
  
  @PrimaryColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;

  @OneToMany(() => Sessao, sessao => sessao.local)
  sessoes: Sessao[];
}