const fs = require('fs');
const AuthController = require('../src/controllers/AuthController');
const express = require('express');

const pessoas = JSON.parse(fs.readFileSync('pessoas.json'))[0];

const authController = new AuthController(express.Router());

pessoas.forEach(pessoa => {
  authController.register_post({
    body: {
      comorbidade: pessoa['Comorbidade'] == 'Sim' ? '1' : '0',
      profissao: pessoa['Profissão'],
      nome: pessoa['Nome'],
      cpf: pessoa['CPF'],
      email: pessoa['E-mail'],
      telefone: pessoa['Telefone'],
      nascimento: pessoa['Nascimento'],
      endereco: pessoa['Endereço'],
      password: pessoa['Senha'].toString()
    }
  },{
    status: () => {},
    redirect: () => {}
  });
});
