<script id="esbelto">
  let include = getInclude();
  let { success, error } = getVariables();
</script>

<head>
  {include('../partials/head.svelte', {title: "GERVAC | Login", scripts: [{src:'/js/auth/login.js'}]})}
</head>
<body>
  <div class="auth-wrapper">
    <div>
      <h1 class="text-center">JGL Gerenciamento de Vacinação</h1>

      {#if success}
        <div class="alert alert-success alert-dismissible" role="alert">
          {success}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
      {/if}
      {#if error}
        <div class="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
      {/if}
      
    </div>
    
    <div class="auth-card login-card">
      <form method="POST">
        <h2 class="text-center mt-2">Login</h2>
        <div>
          <div class="mb-3">
            <label for="cpfInput" class="form-label">CPF</label>
            <input class="form-control" id="cpfInput" name="cpf" required>
          </div>
          <div class="mb-3">
            <label for="passwordInput" class="form-label">Senha</label>
            <input type="password" class="form-control" id="passwordInput" name="password" required>
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            <a class="btn btn-primary" href="/auth/register">Cadastrar</a>
          </div>
          <div class="col text-center">
            <button type="submit" class="btn btn-primary">Entrar</button>
          </div>
        </div>
      </form>
    </div>
    <div></div>
  </div>
</body>
