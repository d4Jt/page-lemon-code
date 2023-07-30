const userService = require('../services/user.service');

const getAllUsers = async(req, res) => {
    const user = await userService.getAllUsers();
    res.status(200).json(user);
}

const getCurrent = async(req, res) => {
    const user = await userService.getCurrent(req.user.id);
    res.status(200).json(user);
};

const getOneUser = async(req, res) => {
    const user = await userService.getOneUser(req.query.uid);
    res.status(200).json(user);
};

const updateUser = async(req, res) => {
    const user = await userService.updateUser(req.body,req.user.id)
    res.status(200).json(user);
};

const deleteUser = async(req, res) => {
    const user = await userService.deleteUser(req.body.uid);
    res.status(200).json(user);
};

module.exports = {
    getAllUsers,
    getCurrent,
    getOneUser,
    updateUser,
    deleteUser,
}