$(() => {
  $("#alterar-form").on('submit', (e) => {
    e.preventDefault();

    const action = e.originalEvent.submitter.value;
 
    const numPacientes = pacientesSelecionados.length;
    $(".contagem-pacientes").text(`${numPacientes} paciente${numPacientes>1 ? 's' : ''} selecionado${numPacientes>1 ? 's' : ''}`);

    $(".hidden-inputs").html('');
    pacientesSelecionados.forEach(paciente => {
      $(".hidden-inputs").append(`<input name="pacientes[]" type="checkbox" value="${paciente.id}" checked>`);
    });
  
    if(action == 'vacinar') {
      const selectVacina = $("#vacina-select")
      selectVacina.html('<option value selected>Selecione a vacina</option>');
      if(vacinaUsada) {
        selectVacina.append(`<option value="${vacinas[vacinaUsada].id}">${vacinas[vacinaUsada].fabricante}</option>`);
      } else {
        Object.values(vacinas).forEach(vacina => {
          selectVacina.append(`<option value="${vacina.id}">${vacina.fabricante}</option>`);
        });
      }
    }
    
    if(action == 'vacinar') {
      $("#modal-vacinar").modal('show'); 
    } else if(action=='agendar') {
      $("#modal-agendar").modal('show');
    }
  });

  let pacientesSelecionados = [];
  let vacinaUsada;

  $(".paciente-check").on('click', (e) => {
    vacinaUsada = null;
    const novoPacientesSelecionados = [];
    $(".paciente-check").each((idx, cb) => {
      if(cb.checked) {
        vacinaUsada = vacinaUsada || pacientes[cb.value].vacinadoCom;
        novoPacientesSelecionados.push(pacientes[cb.value]);
        if(pacientes[cb.value].vacinadoCom && pacientes[cb.value].vacinadoCom != vacinaUsada) {
          cb.setCustomValidity("Conflito no tipo de vacina");
          cb.reportValidity();
        } else {
          cb.setCustomValidity("");
        }
      } else {
        cb.setCustomValidity("");
      }
    });
    if(!novoPacientesSelecionados.length) {
      $(".paciente-check")[0].setCustomValidity("Selecione ao menos um paciente");    
    }

    pacientesSelecionados = novoPacientesSelecionados;
  });

  $(".paciente-check")[0].setCustomValidity("Selecione ao menos um paciente"); 
  
  $('.mais-info-btn').on('click', e => {
    const paciente = pacientes[e.target.value];
    
    $("#mais-info-nome-input").val(paciente.nome);
    $("#mais-info-cpf-input").val(paciente.cpf);
    $("#mais-info-email-input").val(paciente.email);
    $("#mais-info-telefone-input").val(paciente.telefone);
    $("#mais-info-nascimento-input").val(paciente.nascimento.split('T')[0]);
    $("#mais-info-endereco-input").val(paciente.endereco);
    $("#mais-info-comorbidade-input").val(paciente.comorbidade ? 'Sim' : 'Não');
    $("#mais-info-profissao-input").val(paciente.profissao);

    $("#modal-mais-info").modal('show');         
  });

  function formatarCpf(cpf) {
    cpf = cpf.replace( /\D/g , "");
    cpf = cpf.substr(0, 11);
    cpf = cpf.replace( /(\d{3})(\d)/ , "$1.$2");
    cpf = cpf.replace( /(\d{3})(\d)/ , "$1.$2");
    cpf = cpf.replace( /(\d{3})(\d{1,2})$/ , "$1-$2");
    return cpf;
  }
});