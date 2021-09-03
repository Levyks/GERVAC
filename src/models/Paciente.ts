import Usuario from './Usuario';
import Vacina from './Vacina';
import Sessao from './Sessao';

import { ChildEntity, Column, PrimaryColumn, ManyToOne } from "typeorm";

@ChildEntity()
export default class Paciente extends Usuario {

  @PrimaryColumn()
  id: number;

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

  @ManyToOne(() => Sessao, sessao => sessao.pacientes, {
    eager: true
  })
  agendadoPara: Sessao;

  toJSON(): Object {
    const obj = Object.assign({}, this);
    delete obj.password;
    return obj;
  }

  statusVacinadoStr(): string {
    if(this.vacinadoCom) {
      switch(this.statusVacinacao){
        case 1:
          return `D1(${this.vacinadoCom.fabricante})`;
          break;
        case 2:
          return `D2(${this.vacinadoCom.fabricante})`;
          break;
        default:
          return "Não";
          break;
      }
    } else {
      return "Não";
    }
  }

  getStatusHtml(): string {
    let statusHtml = "<p>";

    if(this.statusVacinacao) {
      statusHtml += `Você já tomou a ${this.statusVacinacao}º dose`;
    } else {
      if (this.agendadoPara) {
        statusHtml += "Boas notícias";
      } else {
        statusHtml += "Seu cadastro está validado";
      }
    }

    statusHtml += "</p>";

    if(this.vacinadoCom && this.vacinadoCom.dosesNecessarias == this.statusVacinacao) {
      statusHtml += '<p><strong>Sua vacinação está completa.</strong></p>';
      return statusHtml;
    }

    if(this.agendadoPara) {
      statusHtml += `<p><strong>Sua ${this.statusVacinacao+1}º dose está agendada</strong></p>`;
      statusHtml += `<p>Data: ${this.agendadoPara.getDataString()}</p>`;
      statusHtml += `<p>Local: ${this.agendadoPara.local.nome}<br>`;
      statusHtml += `Endereço: ${this.agendadoPara.local.endereco}</p>`;
    } else {
      statusHtml += `<p><strong>Aguarde pelo agendamento da sua ${this.statusVacinacao+1}º dose.</strong></p>`
    }

    return statusHtml;
  }
}

module.exports = Paciente;