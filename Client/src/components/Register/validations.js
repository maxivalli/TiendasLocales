export function validateUsername(username) {
  if (username === "") {
    return "Debes completar el campo";
  }
  if (username.length < 3) {
    return "El nombre de usuario debe tener al menos 3 caracteres";
  }
  if (username.length > 20) {
    return "El nombre del usuario no debe superar los 20 caracteres";
  }
  return null;
}

export function validateEmail(email) {
  if (email === "") {
    return "Debes completar el campo";
  }
  if (!/^\S+@\S+\.\S{2,}$/.test(email)) {
    return "Ingrese una dirección de correo electrónico válida";
  }
  return null;
}

export function validatePassword(password) {
  if (password === "") {
    return "Debes completar el campo";
  }
  if (password.length < 6 || password.length > 20) {
    return "El nombre de usuario debe tener entre 6 y 20 caracteres";
  }
  return null;
}

export function validateImagen(image) {
  if (image === "") {
    return "Debes completar el campo";
  } else if (!isValidImageUrl(image)) {
    return "La URL de la imagen debe terminar en .png o .jpg";
  }
  return null;
}

function isValidImageUrl(url) {
  const urlPattern = /\.(png|jpg)$/i;
  return urlPattern.test(url);
}

export const validatePasswordRepeat = (passwordRepeat, password) => {
  if (passwordRepeat === "") {
    return "Debes completar el campo";
  } else if (passwordRepeat !== password) {
    return "Las contraseñas no coinciden";
  }
  return null;
};
