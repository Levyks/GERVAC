class Utils {
  static formatarTelefone(numero: string): string {
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

}


export default Utils;