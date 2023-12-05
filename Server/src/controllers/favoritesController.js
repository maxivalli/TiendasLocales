const { UserFavorites, User } = require("../DB_config");

exports.createFavorite = async (userId, favoriteUserId) => {
    try {
        const newFavorite = await UserFavorites.create({ userId, favoriteUserId });
        return newFavorite
    }catch (error){
        throw error
    }
}

exports.removeFavorite = async (userId, favoriteUserId) => {
    try {
        const deletedFavorite = await UserFavorites.destroy({
            where: { userId, favoriteUserId }
        });

        if (deletedFavorite) {
          
            return true
        }else{
            return false
        }
    } catch (error) {
        console.error("Error al eliminar favorito:", error)
        throw error;
    }
};

exports.getFavorites = async (userId) => {
    try {
        const favorites = await User.findByPk(userId, {
            include: [{ model: User, as: 'favorites' }],
        })
        return favorites
    }catch (error) {
        console.error("Error al obtener favoritos:", error)
        throw error;
    }
}

