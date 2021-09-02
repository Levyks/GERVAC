import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Local { 
  
  @PrimaryGeneratedColumn()
  localId: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;


}