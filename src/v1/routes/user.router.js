const userController = require('../controllers/user.controller');
const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const uploadCloud = require('../middlewares/uploader');


router.get('/getAll', verify, isAdmin, userController.getAllUsers);

router.get('/getCurrent', verify, userController.getCurrent);

router.put(
   '/',
   verify,
   uploadCloud.single('avatar'),
   userController.updateUser
);

router.post('/savedPosts', verify, userController.savedPosts);

router.delete('/', verify, isAdmin, userController.deleteUser);

router.get('/:uid', userController.getOneUser);

module.exports = router;
