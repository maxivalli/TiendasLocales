const { Tienda, User } = require("../DB_config");
const axios = require("axios");

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
    console.log(existStoreByUserId);

    if (existStoreByName?.length !== 0) {
      throw new Error("Ya existe una tienda con este nombre.");
    }
    if (existStoreByUserId) {
      throw new Error("Ya tienes una tienda creada o en espera de aprobación.");
    }
    try {
    
    let direccionCompleta = storeData.direccion || {};
    direccionCompleta.piso = storeData.piso || "";
    direccionCompleta.depto = storeData.depto || "";
    
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
          "PRIVATE-KEY": "a4751e26-0b61-4563-b34c-88729b25c792",
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      await axios(config);

      return true;
    } else {
      throw new Error("No se ha podido crear la tienda");
    }
  } catch (error) {
    console.error(error.message);
    throw new Error("No se ha podido crear la tienda");
  }
};

exports.updateStore = async (storeId, storeData) => {
  try {
    const tienda = await Tienda.findByPk(storeId);

    if (!tienda) {
      throw new Error("Store not found");
    }

    if (storeData.direccion) {
      const direccionObj = JSON.parse(tienda.direccion || '{}');

      direccionObj.calle = storeData.direccion.calle || direccionObj.calle;
      direccionObj.numero = storeData.direccion.numero || direccionObj.numero;
      direccionObj.piso = storeData.direccion.piso || direccionObj.piso;
      direccionObj.depto = storeData.direccion.depto || direccionObj.depto;

      tienda.direccion = direccionObj
    }
    if (storeData.nombre) {
      tienda.nombre = storeData.nombre
    }
    if (storeData.image) {
      tienda.image = storeData.image
    }
    if (storeData.indicaciones) {
      tienda.indicaciones = storeData.indicaciones
    }
    if (storeData.categoria) {
      tienda.categoria = storeData.categoria
    }
    if (storeData.horarios) {
      tienda.horarios = storeData.horarios
    }
    if (storeData.dias) {
      tienda.dias = storeData.dias
    }
    if (storeData.facebook) {
      tienda.facebook = storeData.facebook
    }
    if (storeData.instagram) {
      tienda.instagram = storeData.instagram
    }
    if (storeData.whatsapp) {
      tienda.whatsapp = storeData.whatsapp
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
        },});

      if(user.accT){
        store.habilitado = "habilitado";
        await store.save();

        user.vendedor = "vendedor";
        await user.save();

        return true;
      } else if(!store.accT){
        throw new Error ("El usuario no a generado su access token!")
      }
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
  console.log("El usuario no tiene tienda aun")
}
};

