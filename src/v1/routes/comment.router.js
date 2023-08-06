const commentController = require('../controllers/comment.controller');
const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const uploadCloud = require('../middlewares/uploader');

//get
router.get('/getAll', commentController.getAllComment);
router.get('/getOne', commentController.getComment);
// post
router.post(
   '/',
   verify,
   uploadCloud.single('image'),
   commentController.createComment
);
// router.post('/',verify, (req,res) => {
//    res.json(req.user);
// })

//put
router.put('/softDelete', verify, commentController.softDeleteComment);
router.put(
   '/',
   verify,
   uploadCloud.single('image'),
   commentController.updateComment
);

//delete
router.delete('/', verify, commentController.deleteComment);


module.exports = router;
