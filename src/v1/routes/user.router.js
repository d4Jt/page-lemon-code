const userController = require('../controllers/user.controller');
const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const uploadCloud = require('../middlewares/uploader');




// get
router.get('/getAll', verify, isAdmin, userController.getAllUsers);

router.get('/getCurrent', verify, userController.getCurrent);

router.get('/:uid', userController.getOneUser);

//post

router.post('/savedPosts/:pid', verify, userController.savedPosts);


// put
router.put(
   '/',
   verify,
   uploadCloud.single('avatar'),
   userController.updateUser
);

// delete

router.delete('/', verify, isAdmin, userController.deleteUser);


module.exports = router;
