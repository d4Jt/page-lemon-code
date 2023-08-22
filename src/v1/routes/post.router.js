const { verify } = require('crypto');
const postController = require('../controllers/post.controller');
const verifyToken = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const router = require('express').Router();
const uploadCloud = require('../middlewares/uploader');
const comment = require('../models/comment.model');

// router.post('/create',verifyToken, postController.createPost);
// get
router.get('/getPosts', postController.getPosts);
router.get('/getAll', postController.getAllPosts);
router.get('/getAllTags', postController.getAllTags);
router.get('/getPostsUser/:uid', postController.getPostsOfUser);
router.get('/', postController.getAPost);

// post
router.post(
   '/',
   verifyToken,
   uploadCloud.single('image'),
   postController.createPost
);
router.post('/like/:pid', verifyToken, postController.reactPost);

//put
router.put(
   '/',
   verifyToken,
   uploadCloud.single('image'),
   postController.updatePost
);
router.put('/softDelete', verifyToken, postController.softDeletePost);

//delete
router.delete('/', verifyToken, isAdmin, postController.deletePost);

module.exports = router;
