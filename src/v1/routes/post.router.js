const { verify } = require('crypto');
const postController = require('../controllers/post.controller');
const verifyToken = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const router = require('express').Router();
const uploadCloud = require('../middlewares/uploader');
const comment = require('../models/comment.model');

// router.post('/create',verifyToken, postController.createPost);
router.get('/', postController.getPosts);
router.get('/getAll', postController.getAllPosts);
router.post(
   '/',
   verifyToken,
   uploadCloud.single('image'),
   postController.createPost
);
router.put(
   '/',
   verifyToken,
   uploadCloud.single('image'),
   postController.updatePost
);
router.get('/getAllTags', postController.getAllTags);
router.get('/getPostsUser/:uid', postController.getPostsOfUser);
router.put('/softDelete', verifyToken, postController.softDeletePost);
router.delete('/', verifyToken, isAdmin, postController.deletePost);
router.get('/:pslug', postController.getAPost);



module.exports = router;
