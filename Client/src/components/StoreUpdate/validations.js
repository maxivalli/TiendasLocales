export const validateStoreForm = (formData) => {
  let errors = {};

  const MIN_CALLE_LENGTH = 3;
  const MAX_CALLE_LENGTH = 50;
  const VALID_CALLE_REGEX = /^[a-zA-Z0-9\s]+$/;
  if (formData.calle.trim() === "") {
    errors.calle = "";
  } else {
    if (
      formData.calle.length < MIN_CALLE_LENGTH ||
      formData.calle.length > MAX_CALLE_LENGTH
    ) {
      errors.calle = `La calle debe tener entre ${MIN_CALLE_LENGTH} y ${MAX_CALLE_LENGTH} caracteres`;
    }
    if (!VALID_CALLE_REGEX.test(formData.calle)) {
      errors.calle = "La calle solo puede contener letras, números y espacios";
    }
  }

  const MIN_NUMERO_LENGTH = 1;
  const MAX_NUMERO_LENGTH = 4;
  const VALID_NUMERO_REGEX = /^[0-9]+$/;
  if (formData.numero.trim() === "") {
    errors.numero = "";
  } else {
    if (
      formData.numero.length < MIN_NUMERO_LENGTH ||
      formData.numero.length > MAX_NUMERO_LENGTH
    ) {
      errors.numero = `El número debe tener entre ${MIN_NUMERO_LENGTH} y ${MAX_NUMERO_LENGTH} caracteres`;
    }
    if (!VALID_NUMERO_REGEX.test(formData.numero)) {
      errors.numero = "El número debe contener solo dígitos";
    }
  }

  const MAX_PISO_LENGTH = 3;
  const VALID_PISO_REGEX = /^[0-9-]+$/;
  if (formData.piso.trim() === "") {
    errors.piso = "";
  } else {
    if (formData.pisoDeptoChecked && !formData.piso.trim()) {
      errors.piso = "El número de piso es requerido";
    }
    if (formData.pisoDeptoChecked && formData.piso.length > MAX_PISO_LENGTH) {
      errors.piso = `El número de piso debe tener como máximo ${MAX_PISO_LENGTH} caracteres`;
    }
    if (formData.pisoDeptoChecked && !VALID_PISO_REGEX.test(formData.piso)) {
      errors.piso = "El número de piso debe contener solo dígitos";
    }
  }

  const MAX_DEPTO_LENGTH = 4;
  const VALID_DEPTO_REGEX = /^[a-zA-Z0-9]+$/;
  if (formData.depto.trim() === "") {
    errors.depto = "";
  } else {
    if (formData.pisoDeptoChecked && !formData.depto.trim()) {
      errors.depto = "El número de departamento es requerido";
    }
    if (formData.pisoDeptoChecked && formData.depto.length > MAX_DEPTO_LENGTH) {
      errors.depto = `El número de departamento debe tener como máximo ${MAX_DEPTO_LENGTH} caracteres`;
    }
    if (formData.pisoDeptoChecked && !VALID_DEPTO_REGEX.test(formData.depto)) {
      errors.depto =
        "El número de departamento solo puede contener letras y números sin espacios";
    }
  }

  const MIN_NOMBRE_TIENDA_LENGTH = 3;
  const MAX_NOMBRE_TIENDA_LENGTH = 50;
  if (formData.nombre.trim() === "") {
    errors.nombre = "";
  } else {
    if (
      formData.nombre.length < MIN_NOMBRE_TIENDA_LENGTH ||
      formData.nombre.length > MAX_NOMBRE_TIENDA_LENGTH
    ) {
      errors.nombre = `El nombre de la tienda debe tener entre ${MIN_NOMBRE_TIENDA_LENGTH} y ${MAX_NOMBRE_TIENDA_LENGTH} caracteres`;
    }
  }

  const VALID_TIME_REGEX = /^[0-9\s:-]+(?:\s*(am|pm|hs)\s*(.*))?$/i;
  if (formData.horarios.trim() === "") {
    errors.horarios = "";
  } else {
    if (!VALID_TIME_REGEX.test(formData.horarios)) {
      errors.horarios =
        "El horario debe contener solo dígitos del 0 al 9, espacios, guiones, barra diagonal, y las palabras am o pm";
    }
  }

  const validDiasRegex =
    /^(Lunes|Martes|Miércoles|Jueves|Viernes|Sabado|Domingo)( ?- ?(Lunes|Martes|Miércoles|Jueves|Viernes|Sabado|Domingo))*$/i;
  if (formData.dias.trim() === "") {
    errors.dias = "";
  } else {
    if (!validDiasRegex.test(formData.dias)) {
      errors.dias =
        "Ingrese días válidos separados por espacios o guiones. Ej: Lunes - Viernes";
    }
  }

  const urlRegex = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,})(\/?[\w .-]*)*\/?$/;
  if (formData.facebook && !urlRegex.test(formData.facebook)) {
    errors.facebook = "La URL de perfil de Facebook no es válida";
  }

  // Validaciones para la URL del perfil de Instagram
  if (formData.instagram && !urlRegex.test(formData.instagram)) {
    errors.instagram = "La URL de perfil de Instagram no es válida";
  }

  // Validaciones para la URL de WhatsApp
  if (formData.whatsapp && !urlRegex.test(formData.whatsapp)) {
    errors.whatsapp = "La URL de WhatsApp no es válida";
  }

  return errors;
};
