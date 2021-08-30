<script id="esbelto">
  let include = getInclude();
  let { error } = getVariables();
</script>

<head>
  {include('../partials/head.svelte', {title: "GERVAC | Registro", scripts: ['/js/auth/register.js']})}
</head>
<body>
  <div class="auth-wrapper">

    <div class="auth-header">
      <a href="/auth/login" class="register-sair">&#8249;</a>
      <div>
        <h1 class="text-center">JGL Gerenciamento de Vacinação</h1>
        {#if error}
          <div class="alert alert-danger alert-dismissible" role="alert">
            {error}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
          </div>
        {/if}
      </div>
      <span></span>
    </div>

    <div class="auth-card register-card">
      <form method="POST" id="registerForm">

        <h2 class="text-center mt-2">Registro</h2>

        <div class="input-container">

          <div class="input-column">
            <div class="mb-3">
              <label for="nomeInput" class="form-label">Nome</label>
              <input class="form-control" id="nomeInput" name="nome" required>
            </div>
            <div class="mb-3">
              <label for="cpfInput" class="form-label">CPF</label>
              <input class="form-control" id="cpfInput" name="cpf" required>
            </div>
            <div class="mb-3">
              <label for="nascimentoInput" class="form-label">Data de Nascimento</label>
              <input type="date" class="form-control" id="nascimentoInput" name="nascimento" required>
            </div>
            <div class="mb-3">
              <label for="profissaoInput" class="form-label">Profissão</label>
              <input class="form-control" id="profissaoInput" name="profissao" required>
            </div>
            <div class="mb-3">
              <label for="comorbidadeRadioSim" class="form-label">Comorbidade</label>
              <br>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="comorbidadeRadioSim" name="comorbidade" value=1>
                <label class="form-check-label" for="comorbidadeRadioSim">Sim</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="comorbidadeRadioNao" name="comorbidade" value=0>
                <label class="form-check-label" for="comorbidadeRadioNao">Não</label>
              </div>
            </div>
          </div>

          <div class="input-column">
            <div class="mb-3">
              <label for="telefoneInput" class="form-label">Telefone</label>
              <input class="form-control" id="telefoneInput" name="telefone" required>
            </div>    
            <div class="mb-3">
              <label for="enderecoInput" class="form-label">Endereço</label>
              <input class="form-control" id="enderecoInput" name="endereco" required>
            </div>  
            <div class="mb-3">
              <label for="emailInput" class="form-label">E-mail</label>
              <input type="email" class="form-control" id="emailInput" name="email" required>
            </div> 
            <div class="mb-3">
              <label for="passwordInput" class="form-label">Senha</label>
              <input type="password" class="form-control passwordInput" id="passwordInput" name="password" required>
            </div> 
            <div class="mb-3">
              <label for="passwordConfirmInput" class="form-label">Confirme a senha</label>
              <input type="password" class="form-control passwordInput" id="passwordConfirmInput" name="passwordConfirm" required>
            </div> 
          </div>

        </div>

        <div class="row text-center">
          <div>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
          </div>
        </div>

      </form>
    </div>

    <div></div>
  </div>
</body>
