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
});