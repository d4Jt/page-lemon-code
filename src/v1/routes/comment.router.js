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
   (req,res,next)=>{
      console.log(req.user);
      console.log(req.file);
      next();
   },
   commentController.createComment
);
// router.post('/',verify, (req,res) => {
//    res.json(req.body);
// })
router.put('/softDelete', verify, commentController.softDeleteComment);
router.put(
   '/',
   verify,
   uploadCloud.single('image'),
   commentController.updateComment
);
router.delete('/', verify, isAdmin, commentController.deleteComment);

module.exports = router;
