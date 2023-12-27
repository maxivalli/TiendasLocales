export const validatePassw = (password) => {
    if (password === '' && password === null) {
        return "Debes completar el campo";
      }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return null;
  }

  export const validateRepeat = (passwordRepeat, password) => {
    if (passwordRepeat === '') {
      return "Debes completar el campo";
    } else if (passwordRepeat !== password) {
      return "Las contraseñas no coinciden";
    }
    return null;
}