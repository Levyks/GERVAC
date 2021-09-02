import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const PASSWORD_SALT_ROUNDS = 10;

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Usuario {

  @PrimaryGeneratedColumn()
  usuarioId: number;

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

  @Column()
  isAdmin: boolean;

  autenticar(senhaInserida: string): boolean {
    return bcrypt.compareSync(senhaInserida, this.password);
  }

  generateJwt(): string {
    return jwt.sign({
      id: this.usuarioId,
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