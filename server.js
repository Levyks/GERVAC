require('dotenv-safe').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const esbelto = require('esbelto');
const Routes = require('./src/routes/Routes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.engine('svelte', esbelto.express);
app.set('view engine', 'svelte');
app.set('views', './src/views');

app.use(express.static('./public'));

app.use('/', Routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} para testar`);
});