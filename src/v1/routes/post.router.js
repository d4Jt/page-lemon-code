const postController = require( "../controllers/post.controller");
const verifyToken = require( "../middlewares/verifyToken");
const router = require('express').Router();


// router.post('/create',verifyToken, postController.createPost);
router.get('/',postController.getPosts);
router.post('/',verifyToken, postController.createPost);
router.put('/',verifyToken, postController.updatePost);
router.put('/softDelete', verifyToken, postController.softDeletePost);
module.exports = router;