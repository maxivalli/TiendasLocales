const { Tienda } = require("../DB_config");

const createStore = async (storeData) => {
  try {
    console.log(storeData);

    const existStore = await Tienda.findOne({
      where: {
        userId: storeData.userId,
      },
    });

    if (existStore) {
      throw new Error(
        "Ya tienes una tienda creada o en espera de aprobacion!"
      );
    } else {
      // Construir la dirección con piso y/o depto si están presentes
      let direccionCompleta = storeData.direccion;
      if (storeData.piso) {
        direccionCompleta += `, Piso ${storeData.piso}`;
      }
      if (storeData.depto) {
        direccionCompleta += `, Depto ${storeData.depto}`;
      }

      const newStore = await Tienda.create({
        nombre: storeData.nombre,
        email: storeData.email,
        indicaciones: storeData.indicaciones,
        direccion: direccionCompleta,
        image: storeData.image,
        categoria: storeData.categoria,
        horarios: `${storeData.dias}, ${storeData.horarios}`,
        userId: storeData.userId,
        facebook: storeData.facebook,
        instagram: storeData.instagram,
        whatsapp: storeData.whatsapp
      });

      if (newStore) {
        return true;
      } else {
        throw new Error("No se ha podido crear la tienda");
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("No se ha podido crear la tienda");
  }
};

module.exports = { createStore };
