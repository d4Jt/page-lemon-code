const { verify } = require('crypto');
const postController = require('../controllers/post.controller');
const verifyToken = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const router = require('express').Router();

// router.post('/create',verifyToken, postController.createPost);
router.get('/', postController.getPosts);
router.get('/getAll', postController.getAllPosts);
router.post('/', verifyToken, postController.createPost);
router.put('/', verifyToken, postController.updatePost);
router.put('/softDelete', verifyToken, postController.softDeletePost);
router.delete('/', verifyToken, isAdmin, postController.deletePost);
router.get('/:pslug', postController.getAPost);
module.exports = router;
