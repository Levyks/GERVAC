<script id="esbelto">
  let include = getInclude();
  let {pacientes} = getVariables();
</script>

<head>
  {include('../partials/head.svelte', {title: "GERVAC | Registro", scripts: ['/js/auth/register.js']})}
</head>

<body>
  <div class="app-wrapper">
    {include('../partials/navbar.svelte')}
    <div class="container app-container text-center mt-2">
      <h3>População Cadastrada</h3>
      <table class="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Nome</th>
            <th scope="col">Idade</th>
            <th scope="col">Comorbidade</th>
            <th scope="col">Vacinado</th>
            <th scope="col">Agendado</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {#each pacientes as paciente}
            <tr>
              <td></td>
              <td>{paciente.nome}</td>
              <td>{paciente.calcIdade()}</td>
              <td>{paciente.comorbidade ? "Sim" : "Não"}</td>
              <td>{paciente.statusVacinadoStr()}</td>
              <td>{paciente.agendadoPara ? "Sim" : "Não"}</td>
              <td></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</body>