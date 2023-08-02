const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const commentModel = require('../models/comment.model');
const { findByIdComment } = require('../models/repositories/find.repositories');

const createComment = ({pid,...body}, userId, fileData) => new Promise(async (resolve, reject) => {
    try {
        const data = new commentModel({userId: userId, postId: pid,...body, image: fileData.path, imageName: fileData.filename});
        await data.save();

        resolve({
            err: 0,
            message: data? "Created comment successfully": "Failed to create comment",
            data: data? data: null,
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const updateComment = ({cid,...body}) => new Promise(async (resolve, reject) => {
    try {
        const comment = await commentModel.findById(cid);
        if(!comment) {
            resolve({
                err: 1,
                message: "Comment not found",
            })
        }

        const data = await commentModel.findByIdAndUpdate(comment.id,{
            ...body
        }, {new : true});
        
        resolve({
            err: 0,
            message: data? "Update comment successfully": "Failed to update comment",
            data
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const deleteComment = (cid) => new Promise(async (resolve, reject) => {
    try {
        const comment = await commentModel.findById(cid);
        if(!comment) {
            resolve({
                err: 1,
                message: "Comment not found",
            })
        }

        const data = await commentModel.findByIdAndDelete(comment.id);

        resolve({
            err: 0,
            message: data? "Delete comment successfully": "Failed to delete comment",
            data
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const softDeleteComment = (cid) => new Promise(async (resolve, reject) => {
    try {
        const comment = await findByIdComment(cid);
        if(!comment) {
            resolve({
                err: 1,
                message: "Comment not found",
            })
        }

        const data = await commentModel.findByIdAndUpdate(comment.id, {isDeleted: true}, {new : true});

        resolve({
            err: 0,
            message: data? "Soft delete comment successfully": "Failed to soft delete comment",
            data
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const getAllComment = () => new Promise(async (resolve, reject) => {
    try {

        const data = await commentModel.find({isDeleted: false});

        resolve({
            err: 0,
            message: data? "Get all": "Hãy làm thêm post cho chúng tôi",
            data
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const getComment = ({...query}) => new Promise(async (resolve, reject) => {
    try {
        // (user === 'my') ? userId : user; 

        const data = await commentModel.find({isDeleted: false,...query});
        resolve({
            err: 0,
            message: data.length > 0 ? "Get post": "not found",
            data : data.length > 0 ? data : null,
        })
        
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    softDeleteComment,
    getComment,
    getAllComment,
}