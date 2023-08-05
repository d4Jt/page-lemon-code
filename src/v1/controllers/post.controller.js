const postService = require('../services/post.service.js');
const { internalServerError } = require('../middlewares/handle_error');

const createPost = async (req, res) => {
   const fileData = req.file;
   console.log(req.user.id);
   const post = await postService.createPost(req.body, req.user.id, fileData);
   console.log(req.files);
   res.status(200).json(post);
};

const updatePost = async (req, res) => {
   const fileData = req.file;
   const post = await postService.updatePost(req.body, fileData);
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
   const post = await postService.deletePost(req.body.pid, req.user.id);
   console.log(req.body);
   res.status(200).json(post);
};

const getAPost = async (req, res) => {
   const post = await postService.getAPost(req.params.pslug);

   console.log(post);
   res.status(200).json(post);
};

const getAllTags = async (req, res) => {
   try {
      const tags = await postService.getAllTags();
      return res.status(200).json(tags);
   } catch (error) {
      return internalServerError(res);
   }
};

const getPostsOfUser = async (req, res) => {
   try {
      const currentUser = req?.user?.id ? req.user.id : '';
      const posts = await postService.getPostsOfUser(
         req.params.uid,
         currentUser
      );
      return res.status(200).json(posts);
   } catch (error) {
      console.error(error);
      return internalServerError(res);
   }
};

const reactPost = async (req, res) => {
   try {
      const currentUser = req?.body?.uid
         ? req.body.uid
         : req?.user?.id
         ? req.user.id
         : '';

      const likePost = await postService.reactPost(
         req.params.pid,
         currentUser,
         req.body.quantity
      );
      return res.status(200).json(likePost);
   } catch (e) {
      console.error(error);
      return internalServerError(res);
   }
};

module.exports = {
   createPost,
   updatePost,
   softDeletePost,
   getPosts,
   getAllPosts,
   deletePost,
   getAPost,
   getAllTags,
   getPostsOfUser,
   reactPost,
};
