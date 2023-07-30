const userController = require('../controllers/user.controller');
const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const {isAdmin} = require('../middlewares/verifyRole');

router.get('/getAll', userController.getAllUsers);

router.get('/getCurrent',verify, userController.getCurrent);

router.get('/getOne', userController.getOneUser);

router.put('/',verify, userController.updateUser);

router.delete('/',verify,isAdmin, userController.deleteUser);


module.exports = router;