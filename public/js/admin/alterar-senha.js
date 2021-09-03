$(() => {
  $(".password-input").on('input', e => {
    const passInput = $("#password-input")[0];
    const confirmInput = $("#confirm-password-input")[0];
    
    if(passInput.value != confirmInput.value) {
      confirmInput.setCustomValidity("As senhas não são iguais");
    } else {
      confirmInput.setCustomValidity("");
    }
  });
})