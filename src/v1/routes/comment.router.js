const commentController = require('../controllers/comment.controller');
const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const {isAdmin} = require('../middlewares/verifyRole');

router.get('/getAll', commentController.getAllComment);
router.get('/getOne', commentController.getComment);
router.post('/',verify, commentController.createComment);
router.put('/softDelete',verify, commentController.softDeleteComment);
router.put('/', verify, commentController.updateComment);
router.delete('/', verify, isAdmin, commentController.deleteComment);

module.exports = router;