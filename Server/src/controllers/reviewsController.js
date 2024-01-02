const { Review, User, Tienda } = require("../DB_config");

const createReview = async (userId, reviewedUserId, rating) => {
  try {
    const result = await Review.findAll({
      where: {
        userId: userId,
        reviewedUserId: reviewedUserId,
      },
    });
    if (result.length == 0) {
      const newReview = await Review.create({
        userId: userId,
        reviewedUserId: reviewedUserId,
        rating: rating,
      });
      return newReview;
    } else {
      throw new Error("Ya haz calificado a este usuario");
    }
  } catch (error) {
    throw error;
  }
};

const allReviews = async () => {
  try {
    const reviews = await Review.findAll();
    return reviews;
  } catch (error) {
    throw error;
  }
};

const getReviewById = async (reviewId, othId) => {
  try {
    const review = await Review.findOne({
      where: {
        userId: reviewId,
        reviewedUserId: othId,
      },
    });
    if (!review) {
      throw new Error("Este usuario todavia no tiene calificacion");
    }
    return review;
  } catch (error) {
    throw error;
  }
};

const getAverageRatingByUser = async (usuarioId) => {
  try {
    if(!usuarioId) {
      throw new Error("No estoy recibiendo userId"); 
    }
    const result = await Review.findAll({
      where: {
        reviewedUserId: usuarioId,
      },
    });

    if (!result || result.length === 0) {
      throw new Error("No se encontraron reseñas para este usuario");
    }

    let promedio = result.map((element) => element.rating);

    const totalRating = promedio.reduce((sum, rating) => sum + rating, 0);
    const promedioFinal = totalRating / promedio.length;

    const averageRating = parseInt(promedioFinal);
    // Actualiza la propiedad averageRating del usuario en la base de datos
    const resultado = await Tienda.findOne({
      where: {
        userId: usuarioId,
      },
    });

    resultado.averageRating = averageRating;
    await resultado.save();

    const resultado2 = await Tienda.findOne({
      where: {
        userId: usuarioId,
      },
    });
    return resultado2.averageRating;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createReview,
  allReviews,
  getReviewById,
  getAverageRatingByUser,
};
