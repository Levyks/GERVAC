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
      <form method="POST" action="/admin/atualizar">
        <h3>População Cadastrada</h3>
        <div class="d-flex">
          <button name="action" class="btn btn-outline-success me-2" type="submit" value="vacinar">Vacinar</button>
          <button name="action" class="btn btn-outline-primary"      type="submit" value="agendar">Agendar</button>
        </div>
        <table class="table align-middle">
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
                <td><input name="select-pacientes[]" class="form-check-input" type="checkbox" value="{paciente.id}"></td>
                <td>{paciente.nome}</td>
                <td>{paciente.calcIdade()}</td>
                <td>{paciente.comorbidade ? "Sim" : "Não"}</td>
                <td>{paciente.statusVacinadoStr()}</td>
                <td>{paciente.agendadoPara ? "Sim" : "Não"}</td>
                <td><button class="btn btn-primary py-1">Mais info</button></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </form>
    </div>
  </div>
</body>