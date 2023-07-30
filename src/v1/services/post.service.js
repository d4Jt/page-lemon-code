const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const {findByIdPost} = require('../models/repositories/find.repositories');

const createPost = ({...body},userId) => new Promise(async (resolve, reject) => {
    try {
        const data = new postModel({userId: userId,...body});
        await data.save();

        if(data) {
            await userModel.findByIdAndUpdate(data.userId, {$push: {posts: data.id}});
        }

        resolve({
            err: 0,
            message: data? "Created post successfully": "Failed to create post",
            data: data? data: null,
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const updatePost = ({pid,...body}) => new Promise(async (resolve, reject) => {
    try {
        const post = await findByIdPost(pid);
        if(!post) {
            resolve({
                err: 1,
                message: "Post not found",
            })
        }

        const data = await postModel.findByIdAndUpdate(post.id,{
            ...body
        }, {new : true});
        


        resolve({
            err: 0,
            message: data? "Update post successfully": "Failed to update post",
            data
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const deletePost = (pid,userId) => new Promise(async (resolve, reject) => {
    try {
        const post = await findByIdPost(pid);
        if(!post) {
            resolve({
                err: 1,
                message: "Post not found",
            })
        }

        const data = await postModel.findByIdAndDelete(post.id);

        if(data){
            await userModel.findByIdAndUpdate(userId,{$pull: {posts: pid}});
        }
        


        resolve({
            err: 0,
            message: data? "Delete post successfully": "Failed to delete post",
            data
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const softDeletePost = (pid) => new Promise(async (resolve, reject) => {
    try {
        const post = await findByIdPost(pid);
        if(!post) {
            resolve({
                err: 1,
                message: "Post not found",
            })
        }

        const data = await postModel.findByIdAndUpdate(post.id, {isDeleted: true}, {new : true});

        resolve({
            err: 0,
            message: data? "Soft delete post successfully": "Failed to soft delete post",
            data
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

const getAllPosts = () => new Promise(async (resolve, reject) => {
    try {

        const data = await postModel.find({isDeleted: false});

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

const getPosts = ({tags,...query}) => new Promise(async (resolve, reject) => {
    try {
        // (user === 'my') ? userId : user; 
        const data = await postModel.find({tags: {$in: tags},isDeleted: false,...query});
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
    createPost,
    updatePost,
    softDeletePost,
    getAllPosts,
    getPosts,
}