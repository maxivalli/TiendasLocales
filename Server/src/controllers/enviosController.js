const { User } = require("../DB_config");

const crearDireccionUsuario = async (ubicationData) => {
    try {
        const user = await User.findOne({
            where: {
                id: ubicationData.id,
            },
        });

        user.direccion = ubicationData; 
        await user.save();

        return true
    } catch (error) {
        console.error(error);
        throw new Error ("No se a podido agregar la direccion")
    }
};

module.exports = { crearDireccionUsuario };
