const { Post, User } = require("../DB_config");
const { Op } = require("sequelize");



/* exports.getAllDisabled = async () => {
  try {
    const disabledPosts = await Post.findAll({
      where: {paranoid: false}
    })

    return disabledPosts
  } catch (error) {
    throw "Ocurrió un error al traer las publicaciones: " + error;
  }
}; */

/* exports.getAllExisting = async () => {
  try {
    const existingPosts = await Post.findAll({
      paranoid: false,
      order: [['id', 'ASC']],
    })

    return existingPosts
  } catch (error) {
    throw "Ocurrió un error al traer las publicaciones: " + error;
  }
}; */

exports.getPostById = async (id) => {
  try {
    const postById = await Post.findByPk(id)

    if (!postById) {
      throw new Error("No post found with the specified id");
    }

    return postById;
  } catch (error) {
    throw error;
  }
};


exports.getStorePosts = async (storeId) => {
  try {
    const storePosts = await Post.findAll({
      where: {
        storeId: storeId,
      },
    });
    
    return storePosts;
  } catch (error) {
    throw error;
  }
};

exports.getAllPosts = async () => {
  try {
    const allPosts = await Post.findAll();
    return allPosts;
  } catch (error) {
    throw error;
  }
};

exports.createPost = async (postData) => {
  try {
      const newPost = await Post.create({
        storeId: postData.storeId,
        title: postData.title,
        marca: postData.marca,
        description: postData.description,
        price: postData.price,
        stock: postData.stock,
        delivery: postData.delivery,
        image: postData.image,
        userId: postData.userId,
  });
      return newPost;
  } catch (error) {
    console.log("error al crear producto en controller", error);
    throw new Error(error.message);
    }
};

exports.updatePost = async (id, postData) => {
  try {
    const post = await Post.findByPk(id);

    if (!post) {
      throw new Error("Post not found");
    }

    await post.update(postData);

    return post;
  } catch (error) {
    throw error;
  }
};

exports.updateStock = async (postId, quantity) => {
  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    post.stock -= quantity;

    await post.save();

    return post;
  } catch (error) {
    throw error;
  }
};

exports.deletePost = async (id) => {
  try {
    const post = await Post.findByPk(id);

    if (!post) {
      throw new Error("Post not found");
    } else {
      await post.destroy();
    }


    return true;
  } catch (error) {
    throw error;
  }
};

exports.getPostByName = async (name) => {
  try {
    const posts = await Post.findAll({
      where: {
        title: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
    if (posts.length >= 1) 
      return posts;
  } catch (error) {
    throw error;
  }
};



/* exports.restorePost = async (id) => {
  try {
    const postDisabled = await Post.findByPk(id, {paranoid:false})

    if(!postDisabled) {
      throw new Error("La publicacion que intenta restaurar no se encuentra.")
    }
    
    await postDisabled.restore()
    return postDisabled;
  } catch (error) {
    throw (error)
  }
}; */
