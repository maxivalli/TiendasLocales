const { Review, User, Tienda } = require("../DB_config");

const createReview = async (req, res) => {
    try {
        const { userId, reviewedUserId, rating} = req.body;

        const result = await Review.findAll({
            where: {
                userId: userId,
                reviewedUserId: reviewedUserId,
            },
        });

        if(result.length != 0){
            throw new Error("Ya haz calificado a este usuario")
        } else {
            const newReview = await Review.create({
                userId: userId,
                reviewedUserId: reviewedUserId,
                rating: rating
            });
    
            if(newReview) res.status(201)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la reseña", error: error.message });
    }
};

const allReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reviews.' });
    }
};

const getReviewById = async (req, res) => {
    const reviewId = req.params.id;
    const othId = req.params.othId;
    try {
        const review = await Review.findOne({
            where: {
                userId: reviewId,
                reviewedUserId: othId
            },
        });

        if (!review) {
        throw new Error("Ya haz calificado a este usuario")
        }
        return review
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la review.' });
    }
};

const getAverageRatingByUser = async (req, res) => {
    console.log("hola")
    try {
        const userId = req.params.userId;
        
        const result = await Review.findAll({
            where: {
                reviewedUserId: userId,
            },
        });

        if (!result || result.length === 0) {
            res.status(404).json({ message: "No se encontraron reseñas para este usuario" });
            return;
        }

        let promedio = result.map(element => element.rating);

        const totalRating = promedio.reduce((sum, rating) => sum + rating, 0);
        const promedioFinal = totalRating / promedio.length;

        const averageRating = parseInt(promedioFinal)
        // Actualiza la propiedad averageRating del usuario en la base de datos
        const resultado = await Tienda.findOne({
            where: {
                userId: userId,
            },
          });

          resultado.averageRating = averageRating;
          await resultado.save();
          console.log("1", resultado.averageRating)
        return resultado.averageRating
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al calcular el promedio de calificaciones", error: error.message });
    }
};


module.exports = {
    createReview,
    allReviews,
    getReviewById,
    getAverageRatingByUser
}

