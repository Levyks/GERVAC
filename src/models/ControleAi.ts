import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export default class ControleAi { 
  
  constructor(tabela: string) {
    this.tabela = tabela;
    this.ultimoId = 0;
  }

  @PrimaryColumn()
  tabela: string;

  @Column()
  ultimoId: number;

}