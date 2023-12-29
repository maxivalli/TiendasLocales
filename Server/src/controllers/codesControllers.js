const { Code } = require("../DB_config");

exports.comprobarCodigo = async (codigo) => {
    console.log(codigo);
    try {
      const result = await Code.findOne({
        where: {
          codigoForgot: parseInt(codigo),
        },
      });

      if (result) {
       await result.destroy()
        return true;
      } else {
        throw new Error("Codigo incorrecto");
      }
    } catch (error) {
      throw error;
    }
  };

