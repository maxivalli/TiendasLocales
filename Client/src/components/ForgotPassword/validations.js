export function validateEmail(email) {
    if (email === '') {
        return "Debes completar el campo";
      }
      if (!/^\S+@\S+\.\S{2,}$/.test(email)) {
        return "Ingrese una dirección de correo electrónico válida" 
      }
    return null;
  }