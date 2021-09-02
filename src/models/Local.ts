import { Entity, Column, PrimaryColumn } from "typeorm";
import BaseModel from "./BaseModel";

@Entity()
export default class Local extends BaseModel { 
  
  @PrimaryColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;


}