$(() => {
  $("#alterar-form").on('submit', (e) => {
    e.preventDefault();
 
    const numPacientes = pacientesSelecionados.length;
    $("#contagem-pacientes-vacinar").text(`${numPacientes} paciente${numPacientes>1 ? 's' : ''} selecionado${numPacientes>1 ? 's' : ''}`);

    pacientesSelecionados.forEach(paciente => {
      $("#hidden-inputs").append(`<input name="pacientes[]" type="checkbox" value="${paciente.id}" checked>`);
    });
  
    const selectVacina = $("#vacina-select")
    selectVacina.html('<option value selected>Selecione a vacina</option>');
    if(vacinaUsada) {
      selectVacina.append(`<option value="${vacinas[vacinaUsada].id}">${vacinas[vacinaUsada].fabricante}</option>`);
    } else {
      Object.values(vacinas).forEach(vacina => {
        selectVacina.append(`<option value="${vacina.id}">${vacina.fabricante}</option>`);
      });
    }

    $("#modal-vacinar").modal('show'); 
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
});