const userModel = require('../models/user.model');
const cloudinary = require('cloudinary').v2;

const getAllUsers = () => new Promise(async (resolve, reject) => {
   try {
        const data = await userModel.find().select('-refreshToken -password -role');
        resolve({
            err: data? 0 : 1,
            message: data ? "Get all users" : "get failed",
            data: data ? data: null,
        })
   } catch (error) {
    reject(error);
   }
});

const getOneUser = (userId) => new Promise(async (resolve, reject) => {
    try {
        const data = await userModel.findById(userId).select('-refreshToken -password -role');
        resolve({
            err: data? 0 : 1,
            message: data ? "Get all users" : "get failed",
            data: data ? data: null,
        })
    } catch (error) {
        reject(error);
    }
});

const updateUser = ({...body},userId, fileData) => new Promise(async (resolve, reject) => {
    try {
        const data = await userModel.findByIdAndUpdate(userId, {...body}, {new: true}).select('-refreshToken -password -role');
        resolve({
            err: data? 0 : 1,
            message: data ? "update success" : "update failure",
            data: data ? data: null,
        })
    } catch (error) {
        reject(error);
        if(fileData) cloudinary.uploader.destroy(fileData.filename)
    }
});

const deleteUser = (userId) => new Promise(async (resolve, reject) => {
    try {
        const data = await userModel.findByIdAndDelete(userId);
        cloudinary.api.delete_resources(data.imageName);
        resolve({
            err: data? 0 : 1,
            message: data ? "delete users" : "delete user failed",
            data: data ? data: null,
        })
    } catch (error) {
        reject(error);
    }
});

const getCurrent = (userId) => new Promise(async (resolve, reject) => {
    try {
        const data = await userModel.findById(userId)
        .select('-refreshToken -password -role')
        .populate({
            path: 'posts',
            select: '-isDeleted'
        });
        resolve({
            err: data? 0 : 1,
            message: data ? "delete users" : "delete user failed",
            data: data ? data: null,
        })
    } catch (error) {
        reject(error);
    }
});

module.exports ={
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser,
    getCurrent,
}

 