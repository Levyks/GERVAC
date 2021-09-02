$(() => {
  $('#cpfInput').on('input', (e) => {
    let cpf = e.target.value;
    cpf = cpf.replace( /\D/g , "");
    cpf = cpf.substr(0, 11);
    cpf = cpf.replace( /(\d{3})(\d)/ , "$1.$2");
    cpf = cpf.replace( /(\d{3})(\d)/ , "$1.$2");
	  cpf = cpf.replace( /(\d{3})(\d{1,2})$/ , "$1-$2");

    e.target.value = cpf;

    if(e.target.value.length !== 14){
      e.target.setCustomValidity("CPF inválido");
    } else {
      e.target.setCustomValidity("");
    }
  });

  $('#cpfInput').trigger('input');

  $('#telefoneInput').on('keydown', (e) => {
    const numeroLen = e.target.value.length;
    if(e.key === 'Backspace' && ['(', '-'].includes(e.target.value[numeroLen-1])) {
      e.target.value = e.target.value.slice(0, numeroLen - 1);
      return false;
    }
  });

  $('#telefoneInput').on('input', (e) => {
    e.target.value = formatarTelefone(e.target.value);
  });

  $('#telefoneInput').trigger('input');

  function formatarTelefone(numero) {
    numero = numero.replace(/\D/g, "");
    numero = numero.replace(/^0/, "");
    if (numero.length > 10) {
      numero = numero.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (numero.length > 5) {
      numero = numero.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (numero.length > 2) {
      numero = numero.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
      numero = numero.replace(/^(\d*)/, "($1");
    } 
    return numero;  
  }

  $(".passwordInput").on('input', (e) => {
    if($("#passwordConfirmInput").val() !== $("#passwordInput").val()) {
      $("#passwordConfirmInput")[0].setCustomValidity("A confirmação não é igual");
    } else {
      $("#passwordConfirmInput")[0].setCustomValidity("");
    }
  })
});