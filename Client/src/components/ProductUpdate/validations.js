export const validateProductForm = (productData) => {
  let errors = {};

  const MIN_TITLE_LENGTH = 3;
  const MAX_TITLE_LENGTH = 20;
  if (productData.title.trim() === "") {
    errors.title = "";
  } else {
    if (
      productData.title.length < MIN_TITLE_LENGTH ||
      productData.title.length > MAX_TITLE_LENGTH
    ) {
      errors.title = `El titulo debe tener entre ${MIN_TITLE_LENGTH} y ${MAX_TITLE_LENGTH} caracteres`;
    }
  }

  const MIN_MARCA_LENGTH = 2;
  const MAX_MARCA_LENGTH = 20;
  if (productData.marca.trim() === "") {
    errors.marca = "";
  } else {
  if (
    (productData.marca !== "" && productData.marca.length < MIN_MARCA_LENGTH) ||
    productData.marca.length > MAX_MARCA_LENGTH
  ) {
    errors.marca = `La marca debe tener entre ${MIN_MARCA_LENGTH} y ${MAX_MARCA_LENGTH} caracteres`;
  }
}

if (productData.description.trim() === "") {
  errors.description = "";
} else {
  if (productData.description.length > 100) {
    errors.description = "La descripción no puede superar los 100 caracteres";
  }
}

if (productData.price.trim() === "") {
  errors.price = "";
} else {
  if (isNaN(Number(productData.price))) {
    errors.price = "El precio debe ser un número válido";
  }
}

if (productData.stock.trim() === "") {
  errors.stock = "";
} else {
  if (isNaN(Number(productData.stock))) {
    errors.stock = "El stock debe ser un número válido";
  }
}

  return errors;
};
