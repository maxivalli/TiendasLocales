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
  try {
    const existStore = await Tienda.findOne({
      where: {
        userId: storeData.userId,
      },
    });

    if (existStore) {
      throw new Error("Ya tienes una tienda creada o en espera de aprobacion!");
    } else {
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
          method: "post",
          url: "https://api.chatengine.io/users/",
          headers: {
            "PRIVATE-KEY": "a4751e26-0b61-4563-b34c-88729b25c792",
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
            throw error;
          });

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

exports.habStore = async (id) => {
  try {
    const store = await Tienda.findOne({
      where: {
        id: id,
      },
    });

    store.habilitado = "habilitado";
    await store.save();

    if (store) {
      const user = await User.findOne({
        where: {
          id: store.userId,
        },
      });

      user.vendedor = "vendedor";
      await user.save();
    }

    return true;
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

