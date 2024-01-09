export const validateAddressForm = (formData) => {
  let errors = {};


  const MIN_CALLE_LENGTH = 3;
  const MAX_CALLE_LENGTH = 20;
  const VALID_CALLE_FORMAT = /^[A-Za-z\s]+$/;
  if (!formData.calle.trim()) {
    errors.calle = "La calle es requerida";
  }
  if (
    formData.calle.length < MIN_CALLE_LENGTH ||
    formData.calle.length > MAX_CALLE_LENGTH
  ) {
    errors.calle = `La calle debe tener entre ${MIN_CALLE_LENGTH} y ${MAX_CALLE_LENGTH} caracteres`;
  }
  if (!VALID_CALLE_FORMAT.test(formData.calle)) {
    errors.calle = 'La calle debe contener solo letras y espacios';
  }


  const MIN_NUMERO_LENGTH = 1;
  const MAX_NUMERO_LENGTH = 4;
  const VALID_NUMERO_REGEX = /^[0-9]+$/;
  if (!formData.numero.trim()) {
    errors.numero = "El número es requerido";
  }
  if (formData.numero.length < MIN_NUMERO_LENGTH || formData.numero.length > MAX_NUMERO_LENGTH) {
    errors.numero = `El número debe tener entre ${MIN_NUMERO_LENGTH} y ${MAX_NUMERO_LENGTH} caracteres`;
  }
  if (!VALID_NUMERO_REGEX.test(formData.numero)) {
    errors.numero = 'El número debe contener solo dígitos';
  }


const MAX_PISO_LENGTH = 2;
const VALID_PISO_REGEX = /^[0-9]+$/;
const MAX_DEPTO_LENGTH = 4;
const VALID_DEPTO_REGEX = /^[a-zA-Z0-9]+$/;
  if (formData.pisoDeptoChecked) {
    if (!formData.piso.trim()) {
      errors.piso = "El piso es requerido";
    }
    if (formData.piso.length > MAX_PISO_LENGTH) {
        errors.piso = `El número de piso debe tener como máximo ${MAX_PISO_LENGTH} caracteres`;
      }
      if (!VALID_PISO_REGEX.test(formData.piso)) {
        errors.piso = 'El número de piso debe contener solo dígitos';
      }

    if (!formData.depto.trim()) {
      errors.depto = "El departamento es requerido";
    }
    if (formData.depto.length > MAX_DEPTO_LENGTH) {
        errors.depto = `El número de departamento debe tener como máximo ${MAX_DEPTO_LENGTH} caracteres`;
      }
      if (!VALID_DEPTO_REGEX.test(formData.depto)) {
        errors.depto = 'El número de departamento solo puede contener letras y números';
      }
  }


  const MIN_CELULAR_LENGTH = 8;
const MAX_CELULAR_LENGTH = 15;
const VALID_CELULAR_REGEX = /^[+]?[0-9]+$/;
  if (!formData.celular.trim()) {
    errors.celular = "El número celular es requerido";
  }
  if (formData.celular.length < MIN_CELULAR_LENGTH || formData.celular.length > MAX_CELULAR_LENGTH) {
    errors.celular = `El número de celular debe tener entre ${MIN_CELULAR_LENGTH} y ${MAX_CELULAR_LENGTH} caracteres`;
  }
  if (!VALID_CELULAR_REGEX.test(formData.celular)) {
    errors.celular = 'El número de celular debe contener solo dígitos y, opcionalmente, "+" al inicio';
  }

  return errors;
};
