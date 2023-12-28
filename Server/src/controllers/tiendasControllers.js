const { Tienda, User, Compra } = require("../DB_config");
const axios = require("axios");
const { Op } = require("sequelize");
const { habStoreMail } = require("../utils/mailObjects");
const { transporter } = require("../config/mailer");

async function getImageBlobFromURL(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error al obtener la imagen como Blob:", error);
    throw new Error("Error al obtener la imagen como Blob");
  }
}

exports.createStore = async (storeData) => {
  const existStoreByName = await Tienda.findAll({
    where: {
      nombre: storeData.nombre,
    },
  });
  const existStoreByUserId = await Tienda.findOne({
    where: {
      userId: storeData.userId,
    },
  });

  if (existStoreByName?.length !== 0) {
    throw new Error("Ya existe una tienda con este nombre.");
  }
  if (existStoreByUserId) {
    throw new Error("Ya tienes una tienda creada o en espera de aprobación.");
  }
  try {
    const newStore = await Tienda.create({
      nombre: storeData.nombre,
      email: storeData.email,
      indicaciones: storeData.indicaciones,
      direccion: storeData.direccion,
      image: storeData.image,
      categoria: storeData.categoria,
      horarios: storeData.horarios,
      dias: storeData.dias,
      userId: storeData.userId,
      facebook: storeData.facebook,
      instagram: storeData.instagram,
      whatsapp: storeData.whatsapp,
    });

    if (newStore) {
      const data = {
        username: newStore.nombre,
        secret: newStore.email,
        email: newStore.email,
        first_name: newStore.nombre,
      };

      const imageBlob = await getImageBlobFromURL(storeData.image);

      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("secret", data.secret);
      formData.append("email", data.email);
      formData.append("first_name", data.first_name);
      formData.append("avatar", imageBlob, "avatar.png");

      const config = {
        method: "put",
        url: "https://api.chatengine.io/users/",
        headers: {
          "PRIVATE-KEY": "900fe425-d125-4c43-a60c-834e306082bd",
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      await axios(config);

      return true;
    }
  } catch (error) {
    console.error(error.message);
    throw new Error("No se ha podido crear la tienda");
  }
};

exports.updateStore = async (storeId, storeData) => {
  try {
    const tienda = await Tienda.findByPk(storeId);
    console.log(storeData);

    if (!tienda) {
      throw new Error("Store not found");
    }
    if (storeData?.direccion) {
      if (storeData?.direccion?.calle != "") {
        tienda.direccion = {
          ...tienda.direccion,
          calle: storeData?.direccion?.calle,
        };
      }

      if (storeData?.direccion?.numero != "") {
        tienda.direccion = {
          ...tienda.direccion,
          numero: storeData?.direccion?.numero,
        };
      }

      if (storeData?.direccion?.piso != "") {
        tienda.direccion = {
          ...tienda.direccion,
          piso: storeData?.direccion?.piso,
        };
      }

      if (storeData?.direccion?.depto != "") {
        tienda.direccion = {
          ...tienda.direccion,
          depto: storeData?.direccion?.depto,
        };
      }
    }
    if (storeData.nombre) {
      tienda.nombre = storeData.nombre;
    }
    if (storeData.image) {
      tienda.image = storeData.image;
    }
    if (storeData.indicaciones) {
      tienda.indicaciones = storeData.indicaciones;
    }
    if (storeData.categoria) {
      tienda.categoria = storeData.categoria;
    }
    if (storeData?.horarios) {
      if (storeData?.horarios?.horario_de_apertura != "") {
        tienda.horarios = {
          ...tienda.horarios,
          horario_de_apertura: storeData?.horarios?.horario_de_apertura,
        };
      }
      if (storeData?.horarios?.horario_de_cierre != "") {
        tienda.horarios = {
          ...tienda.horarios,
          horario_de_cierre: storeData?.horarios?.horario_de_cierre,
        };
      }
      if (storeData?.horarios?.horario_de_apertura2 != "") {
        tienda.horarios = {
          ...tienda.horarios,
          horario_de_apertura2: storeData?.horarios?.horario_de_apertura2,
        };
      }
      if (storeData?.horarios?.horario_de_cierre2 != "") {
        tienda.horarios = {
          ...tienda.horarios,
          horario_de_cierre2: storeData?.horarios?.horario_de_cierre2,
        };
      }
    }
    console.log(tienda.dias, storeData.dias);
    if (storeData.dias) {
      tienda.dias = storeData.dias;
    }
    if (storeData.facebook) {
      tienda.facebook = storeData.facebook;
    }
    if (storeData.instagram) {
      tienda.instagram = storeData.instagram;
    }
    if (storeData.whatsapp) {
      tienda.whatsapp = storeData.whatsapp;
    }

    await tienda.save();
    return tienda;
  } catch (error) {
    throw error;
  }
};

exports.getStore = async (id) => {
  try {
    const store = await Tienda.findOne({
      where: {
        userId: id,
      },
    });

    return store;
  } catch (error) {
    throw error;
  }
};

exports.deleteStore = async (storeId) => {
  try {
    const store = await Tienda.findByPk(storeId);

    if (!store) {
      throw new Error("Store not found");
    } else {
      await store.destroy({ force: true });
    }

    return true;
  } catch (error) {
    throw error;
  }
};

exports.enviado = async (compraId) => {
  try {
    const compra = await Compra.findOne({
      where: {
        id: compraId.compraId,
      },
    });

    console.log("1", compra)

    compra.enviado = true;
    await compra.save();
    console.log("2", compra)
    return true;
  } catch (error) {
    throw error;
  }
};

exports.habStore = async (id) => {
  try {
    const store = await Tienda.findOne({
      where: {
        id: id,
      },
    });
    if (store) {
      const user = await User.findOne({
        where: {
          id: store.userId,
        },
      });
      store.habilitado = "habilitado";
      await store.save();

      user.vendedor = "vendedor";
      await user.save();

      await transporter.sendMail(habStoreMail(user));
      return store;
    }
  } catch (error) {
    throw error;
  }
};

exports.getAllStores = async () => {
  try {
    const stores = await Tienda.findAll();
    return stores;
  } catch (error) {
    throw error;
  }
};

exports.getUserStore = async (userId) => {
  try {
    const userStore = await Tienda.findOne({
      where: {
        userId: userId,
      },
    });

    return userStore;
  } catch (error) {
    console.log("El usuario no tiene tienda aun");
  }
};

exports.getStoresByCategory = async (category) => {
  try {
    if (category === "🔍 Mostrar todas") {
      const stores = await Tienda.findAll();
      return stores;
    }
    const stores = await Tienda.findAll({
      where: {
        categoria: category,
      },
    });

    return stores;
  } catch (error) {
    throw error;
  }
};

exports.getStoreByName = async (name) => {
  try {
    const stores = await Tienda.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
    if (stores.length >= 1) 
      return stores;
  } catch (error) {
    throw error;
  }
};
