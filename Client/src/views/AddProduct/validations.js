export const validateProductForm = (newProduct) => {
    let errors = {};


    const MIN_TITLE_LENGTH = 3;
    const MAX_TITLE_LENGTH = 50;
if (!newProduct.title.trim()) {
    errors.title = "El título del producto es requerido";
  }
  if (
    newProduct.title.length < MIN_TITLE_LENGTH ||
    newProduct.title.length > MAX_TITLE_LENGTH
  ) {
    errors.title = `El titulo debe tener entre ${MIN_TITLE_LENGTH} y ${MAX_TITLE_LENGTH} caracteres`;
  }


  const MIN_MARCA_LENGTH = 2;
  const MAX_MARCA_LENGTH = 20;
  if (newProduct.marcaChecked && !newProduct.marca.trim()) {
    errors.marca = "La marca del producto es requerida";
  }
  if (newProduct.marcaChecked && newProduct.marca.length < MIN_MARCA_LENGTH ||
    newProduct.marca.length > MAX_MARCA_LENGTH
  ) {
    errors.marca = `La marca debe tener entre ${MIN_MARCA_LENGTH} y ${MAX_MARCA_LENGTH} caracteres`;
  }

  if (!newProduct.image) {
    errors.image = "La imagen del producto es requerida";
  }

  if (!newProduct.description.trim()) {
    errors.description = "La descripción del producto es requerida";
  }
  if (newProduct.description.length > 100) {
    errors.description = "La descripción no puede superar los 100 caracteres";
  }

  if (!newProduct.price.trim()) {
    errors.price = "El precio del producto es requerido";
  } else if (isNaN(Number(newProduct.price))) {
    errors.price = "El precio debe ser un número válido";
  }

  if (!newProduct.stock.trim()) {
    errors.stock = "El stock del producto es requerido";
  } else if (isNaN(Number(newProduct.stock))) {
    errors.stock = "El stock debe ser un número válido";
  }


  return errors;
};