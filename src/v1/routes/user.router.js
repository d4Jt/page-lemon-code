const userController = require('../controllers/user.controller');
const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const {isAdmin} = require('../middlewares/verifyRole');
const uploadCloud = require('../middlewares/uploader');

router.get('/getAll',verify, isAdmin, userController.getAllUsers);

router.get('/getCurrent',verify, userController.getCurrent);

router.get('/getOne',verify, userController.getOneUser);

router.put('/',verify,uploadCloud.single('avatar'), userController.updateUser);

router.delete('/',verify,isAdmin, userController.deleteUser);

module.exports = router;