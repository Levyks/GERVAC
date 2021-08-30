<script id="esbelto">
  let include = getInclude();
</script>

<head>
  {include('../partials/head.svelte', {title: "GERVAC | Registro", scripts: ['/js/auth/register.js']})}
</head>

<div class="app-wrapper">
  {include('../partials/navbar.svelte')}
  <div class="container paciente-container mt-2">
    <h1 class="text-center">Situação Cadastral</h1>
    <div class="paciente-info">
      <h3>FULANO DA SILVA COSTA</h3>
      <p>fulano.silva@gmail.com</p>
      <p>(85)4002-8922</p>
    </div>
    <div class="paciente-status">
      <p>Seu cadastro está validado, aguarde pelo agendamento da sua 1º dose</p>
    </div>
    <div class="paciente-btns">
      <a class="btn btn-primary" href="/auth/register">Sair</a>
      <button class="btn btn-primary">Editar Cadastro</button>
    </div>
  </div>
</div>
