const commentController = require('../controllers/comment.controller');
const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const uploadCloud = require('../middlewares/uploader');

router.get('/getAll', commentController.getAllComment);
router.get('/getOne', commentController.getComment);
router.post(
   '/',
   verify,
   uploadCloud.single('image'),
   commentController.createComment
);
router.put('/softDelete', verify, commentController.softDeleteComment);
router.put(
   '/',
   verify,
   uploadCloud.single('image'),
   commentController.updateComment
);
router.delete('/', verify, isAdmin, commentController.deleteComment);

module.exports = router;
