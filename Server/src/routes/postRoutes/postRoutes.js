const express = require("express");
const router = express.Router();

const postsController = require("../../controllers/postsControllers.js");

router.get("/getStorePosts/:storeId", async (req, res) => {
  const { storeId } = req.params;
  try {
    const storePosts = await postsController.getStorePosts(storeId);
    return res.status(200).json(storePosts);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get("/getAllPosts", async (req, res) => {
  try {
    const allPosts = await postsController.getAllPosts();
    return res.status(200).json(allPosts);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get("/getPost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postById = await postsController.getPostById(id);
    return res.status(200).json(postById);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.post("/createPost", async (req, res) => {
  const postData = req.body;
  try {
    console.log(postData);
    const newPost = await postsController.createPost(postData);

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/updatePost/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedPost = await postsController.updatePost(id, updatedData);
    return res.status(200).json({ message: "Resource updated successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.delete("/deletePost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await postsController.deletePost(id);

    if (deletedPost) {
      return res.status(200).json("Post successfully deleted");
    } else {
      return res.status(404).json("Post not found");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "There was an error deleting the post" });
  }
});

router.put('/restorePost/:id', async (req, res) => {
  const { id } = req.params
  try {
    const restoredPost = await postsController.restorePost(id);
    return res.status(200).json({restoredPost});
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
});


module.exports = router;
