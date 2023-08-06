const userService = require('../services/user.service');
const { internalServerError } = require('../middlewares/handle_error');


// get user models
const getAllUsers = async (req, res) => {
   const user = await userService.getAllUsers();
   res.status(200).json(user);
};

const getCurrent = async (req, res) => {
   const user = await userService.getCurrent(req.user.id);
   res.status(200).json(user);
};

const getOneUser = async (req, res) => {
   const user = await userService.getOneUser(req.params.uid);
   res.status(200).json(user);
};

// update user post

const updateUser = async (req, res) => {
   const fileData = req.file;
   const user = await userService.updateUser(req.body, req.user.id, fileData);
   res.status(200).json(user);
};

const deleteUser = async (req, res) => {
   const user = await userService.deleteUser(req.body.uid);
   res.status(200).json(user);
};

const savedPosts = async (req, res) => {
   try {
      const { save } = req.body;
      const { pid } = req.params; 
      const posts = await userService.savedPosts({ save, pid }, req.user.id);
      return res.status(200).json(posts);
   } catch (error) {
      return internalServerError(res);
   }
};

module.exports = {
   getAllUsers,
   getCurrent,
   getOneUser,
   updateUser,
   deleteUser,
   savedPosts,
};
