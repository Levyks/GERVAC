require('dotenv-safe').config();

const esbelto = require('esbelto');

import { createConnection } from "typeorm";
import express from 'express';
import cookieParser from 'cookie-parser';
import Routes from './src/routes/Routes';

import Models from './src/models';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.engine('html', esbelto.express);
app.set('view engine', 'html');
app.set('views', './src/views');

app.use(express.static('./public'));

app.use('/', Routes);

const PORT = process.env.PORT || 3000;

createConnection({
  type: "better-sqlite3",
  database: "./data/db.sqlite",
  entities: Models,
  synchronize: true
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT} para testar`);
  });
});

