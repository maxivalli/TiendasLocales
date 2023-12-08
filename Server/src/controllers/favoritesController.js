const { Favorites, User } = require("../DB_config");

exports.createFavorite = async (userId, storeId) => {
    console.log(userId, storeId);
    try {
        const existingFavorite = await Favorites.findOne({
            where: { userId, storeId }
        });
        if (existingFavorite) {
            console.log('La tienda ya ha sido agregada como favorita por este usuario.');
            return existingFavorite;
        }
        const newFavorite = await Favorites.create({
            userId: userId,
            storeId: storeId
        });
        return newFavorite;
    } catch (error) {
        console.error("Error al crear favorito:", error);
        throw error;
    }
}

exports.removeFavorite = async (userId, storeId) => {
    console.log(userId, storeId);
    try {
        const deletedFavorite = await Favorites.destroy({
            where: { userId: userId, storeId: storeId }
        });

        return deletedFavorite > 0;
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        throw error;
    }
};


exports.getFavorites = async (userId) => {
    try {
        const userFavorites = await Favorites.findAll({
            where: { userId: userId }
        });

        return userFavorites;
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        throw error;
    }
};

