import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const PASSWORD_SALT_ROUNDS = 10;

import { Entity, Column, PrimaryColumn, TableInheritance } from "typeorm";
import BaseModel from './BaseModel';

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class Usuario extends BaseModel {

  @PrimaryColumn()
  id: number;

  @Column()
  nome: string;

  @Column({unique: true})
  cpf: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  telefone: string;

  @Column()
  nascimento: Date;

  @Column()
  endereco: string;

  @Column('boolean', {default: false})
  isAdmin: boolean;

  autenticar(senhaInserida: string): boolean {
    return bcrypt.compareSync(senhaInserida, this.password);
  }

  generateJwt(): string {
    return jwt.sign({
      id: this.id,
      isAdmin: this.isAdmin
    }, process.env.SECRET, { expiresIn: '6h' });
  }

  setPassword(plainPassword: string): void {
    this.password = bcrypt.hashSync(plainPassword, PASSWORD_SALT_ROUNDS);
  }

  calcIdade(): number {
    var ageDifMs = Date.now() - this.nascimento.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}