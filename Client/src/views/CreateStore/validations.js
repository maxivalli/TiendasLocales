export const validateStoreForm = (formData) => {
  let errors = {};

  const MIN_CALLE_LENGTH = 3;
  const MAX_CALLE_LENGTH = 50;
  const VALID_CALLE_REGEX = /^[a-zA-Z0-9\s]+$/;
  if (!formData.calle.trim()) {
    errors.calle = "La calle es requerida";
  }
  if (
    formData.calle.length < MIN_CALLE_LENGTH ||
    formData.calle.length > MAX_CALLE_LENGTH
  ) {
    errors.calle = `La calle debe tener entre ${MIN_CALLE_LENGTH} y ${MAX_CALLE_LENGTH} caracteres`;
  }
  if (!VALID_CALLE_REGEX.test(formData.calle)) {
    errors.calle = "La calle solo puede contener letras, números y espacios";
  }

  const MIN_NUMERO_LENGTH = 1;
  const MAX_NUMERO_LENGTH = 4;
  const VALID_NUMERO_REGEX = /^[0-9]+$/;
  if (!formData.numero.trim()) {
    errors.numero = "El número es requerido";
  }
  if (
    formData.numero.length < MIN_NUMERO_LENGTH ||
    formData.numero.length > MAX_NUMERO_LENGTH
  ) {
    errors.numero = `El número debe tener entre ${MIN_NUMERO_LENGTH} y ${MAX_NUMERO_LENGTH} caracteres`;
  }
  if (!VALID_NUMERO_REGEX.test(formData.numero)) {
    errors.numero = "El número debe contener solo dígitos";
  }

  const MAX_PISO_LENGTH = 3;
  const VALID_PISO_REGEX = /^[0-9-]+$/;
  if (formData.pisoDeptoChecked && !formData.piso.trim()) {
    errors.piso = "El número de piso es requerido";
  }
  if (formData.pisoDeptoChecked && formData.piso.length > MAX_PISO_LENGTH) {
    errors.piso = `El número de piso debe tener como máximo ${MAX_PISO_LENGTH} caracteres`;
  }
  if (formData.pisoDeptoChecked && !VALID_PISO_REGEX.test(formData.piso)) {
    errors.piso = "El número de piso debe contener solo dígitos";
  }

  const MAX_DEPTO_LENGTH = 4;
  const VALID_DEPTO_REGEX = /^[a-zA-Z0-9]+$/;
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

  
  const MIN_NOMBRE_TIENDA_LENGTH = 3;
  const MAX_NOMBRE_TIENDA_LENGTH = 50;
  if (!formData.nombre.trim()) {
    errors.nombre = "El nombre de la tienda es requerido";
  }
  if (
    formData.nombre.length < MIN_NOMBRE_TIENDA_LENGTH ||
    formData.nombre.length > MAX_NOMBRE_TIENDA_LENGTH
  ) {
    errors.nombre = `El nombre de la tienda debe tener entre ${MIN_NOMBRE_TIENDA_LENGTH} y ${MAX_NOMBRE_TIENDA_LENGTH} caracteres`;
  }


  if (!formData.categoria) {
    errors.categoria = 'Selecciona una categoría para la tienda';
  }


  if (!formData.horario_de_apertura) {
    errors.horario_de_apertura = 'Los horarios son requeridos';
  }
  if (!formData.horario_de_cierre) {
    errors.horario_de_cierre = 'Los horarios son requeridos';
  }

  if (formData.horarioCortado && !formData.horario_de_apertura2) {
    errors.horario_de_apertura2 = 'Los horarios son requeridos';
  }
  if (formData.horarioCortado && !formData.horario_de_cierre2) {
    errors.horario_de_cierre2 = 'Los horarios son requeridos';
  }



  if (!formData.primerDia) {
    errors.primerDia = 'El dia de apertura es requerido';
  }
  if (!formData.ultimoDia) {
    errors.ultimoDia = 'El dia de cierre es requerido';
  }

  const urlRegex = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,})(\/?[\w .-]*)*\/?$/;
  if (formData.facebook && !urlRegex.test(formData.facebook)) {
    errors.facebook = 'La URL de perfil de Facebook no es válida';
  }
  
  // Validaciones para la URL del perfil de Instagram
  if (formData.instagram && !urlRegex.test(formData.instagram)) {
    errors.instagram = 'La URL de perfil de Instagram no es válida';
  }
  
  const numRegex = /^(?:(?:11|2[0-9]|3[0-8]|4[1-9]|5[0-4]|6[0-9]|7[0-9]|9[0-1])\d{6,8}|(?:3[9]|4[0]|5[5])\d{7})$/

  // Validaciones para la URL de WhatsApp
  if (formData.whatsapp && !numRegex.test(formData.whatsapp)) {
    errors.whatsapp = 'El numero ingresado no es valido';
  }


  if (!formData.image) {
    errors.image = 'La imagen es requerida';
  }

  return errors;
};