const { Tienda } = require("../DB_config");
const axios = require("axios")

exports.createStore = async (storeData) => {
  try {

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
        const data = {
          username: newStore.nombre,
          secret: newStore.email,
          email: newStore.email,
          first_name: newStore.nombre
        };
        
        const config = {
          method: 'post',
          url: 'https://api.chatengine.io/users/',
          headers: {
            'PRIVATE-KEY': '2b9635b2-fa51-4c12-a6b1-64a273f58dee'
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
          throw error
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

exports.getAllStores = async () => {
  try {
    const stores = await Tienda.findAll();
    return stores;
  } catch (error) {
    throw error;
  }
};


