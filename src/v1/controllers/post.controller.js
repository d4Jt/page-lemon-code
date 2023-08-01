const postService = require('../services/post.service.js');

const createPost = async (req, res) => {
   const post = await postService.createPost(req.body, req.user.id);
   res.json(post);
};

const updatePost = async (req, res) => {
   const post = await postService.updatePost(req.body);
   res.status(200).json(post);
};

const softDeletePost = async (req, res) => {
   const post = await postService.softDeletePost(req.body.pid);
   res.status(200).json(post);
};

const getPosts = async (req, res) => {
   const post = await postService.getPosts(req.query);
   res.status(200).json(post);
};

const getAllPosts = async (req, res) => {
   const post = await postService.getAllPosts();
   res.status(200).json(post);
};

const deletePost = async (req, res) => {
   const post = await postService.deletePost(req.body.pid, req.query);
   res.status(200).json(post);
};

const getAPost = async (req, res) => {
   const post = await postService.getAPost(req.params.pslug);

   console.log(post);
   res.status(200).json(post);
};

module.exports = {
   createPost,
   updatePost,
   softDeletePost,
   getPosts,
   getAllPosts,
   deletePost,
   getAPost,
};
