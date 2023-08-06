const commentModel = require('../models/comment.model');
const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const {convertToObjectIdMongo} = require('../utils');

// get user model
const getAllUsers = () =>
   new Promise(async (resolve, reject) => {
      try {
         const data = await userModel
            .find()
            .select('-refreshToken -password -role');
         resolve({
            err: data ? 0 : 1,
            message: data ? 'Get all users' : 'get failed',
            data: data ? data : null,
         });
      } catch (error) {
         reject(error);
      }
   });

const getOneUser = (userId) =>
   new Promise(async (resolve, reject) => {
      try {
         const data = await userModel
            .findById(userId)
            .select('-refreshToken -password -isDeleted -isActived')
            .populate([
               {
                  path: 'posts',
                  select: '-isDeleted -isPublished',
               },
               {
                  path: 'likedPosts',
                  select: '-isDeleted -isPublished',
                  populate: {
                     path: 'user',
                     select: 'firstName lastName avatar',
                  },
               },
               {
                  path: 'likedComments',
                  select: '-isDeleted -isPublished',
                  populate: {
                     path: 'user',
                     select: 'firstName lastName avatar',
                  },
               },
               {
                  path: 'savedPosts',
                  select: '-isDeleted -isPublished',
                  populate: {
                     path: 'user',
                     select: 'firstName lastName avatar',
                  },
               },
            ]);
         resolve({
            err: data ? 0 : 1,
            message: data ? 'Get all users' : 'get failed',
            data: data ? data : null,
         });
      } catch (error) {
         reject(error);
      }
   });

const getCurrent = (userId) =>
   new Promise(async (resolve, reject) => {
      try {

         const data = await userModel
            .findById(userId)
            .select('-refreshToken -password -role')
            .populate([
               {
                  path: 'posts',
                  select: '-isDeleted',
               },
               {
                  path: 'savedPosts',
                  select: '-isDeleted',
               },
            ]);
         resolve({
            err: data ? 0 : 1,
            message: data ? 'Get current users' : 'Get current user failed',
            data: data ? data : null,
         });
      } catch (error) {
         reject(error);
      }
   });

// update user model
const updateUser = ({ ...body }, userId, fileData) =>
   new Promise(async (resolve, reject) => {
      try {
         const user = await userModel.findById(userId).lean();

         if (!user._id.equals(userId)) {
            resolve({
               err: 1,
               message: 'You do not have permission to update',
            });
         }

         cloudinary.api.delete_resources(user.imageName);

         const data = await userModel
            .findByIdAndUpdate(
               userId,
               {
                  ...body,
                  avatar: fileData?.path,
                  imageName: fileData?.filename,
               },
               { new: true }
            )
            .select('-refreshToken -password -role');

         resolve({
            err: data ? 0 : 1,
            message: data ? 'update success' : 'update failure',
            data: data ? data : null,
         });
      } catch (error) {
         reject(error);
         if (fileData) cloudinary.uploader.destroy(fileData.filename);
      }
   });

   const savedPosts = ({ save, pid }, userId) =>
   new Promise(async (resolve, reject) => {
      try {
         const posts = await postModel.findById(pid);

         if (save) {
            await userModel.findByIdAndUpdate(userId, {
               $addToSet: { savedPosts: posts.id },
            });
         } else {
            await userModel.findByIdAndUpdate(userId, {
               $pull: { savedPosts: posts.id },
            });
         }

         resolve({
            err: 0,
            message: posts ? 'Save posts successfully' : 'Save posts failed',
         });
      } catch (error) {
         reject(error);
      }
   });

const softDelete = (userId) => new Promise(async (resolve, reject) => {
   try {
      const user = await userModel.findByIdAndUpdate(userId,{
         isDeleted: true,
      });
      
      if(user.posts.length > 0){
         user.posts.map(async (post) => {
            await postModel.findByIdAndUpdate(post.id, {isDeleted: true});
            await commentModel.updateMany({postId: post.id}, {isDeleted: true});
         })
      }

      resolve({
         err: user? 0: 1,
         messages: user? 'User deleted successfully': 'User deleted failed',
         user,
      })

      
   } catch (error) {
      reject(error);
   }
})

// delete user model
const deleteUser = (userId) =>
   new Promise(async (resolve, reject) => {
      try {
         const data = await userModel.findByIdAndDelete(userId).lean();
         console.log(data.imageName);
         if (data.imageName) {
            cloudinary.api.delete_resources(data.imageName);
         }

         data.posts.map(async (post) => {
            const deletePost = await postModel.findByIdAndDelete(post);
            if (deletePost?.imageName) {
               cloudinary.api.delete_resources(deletePost.imageName);
            }
            const comments = await commentModel
               .find({ postId: deletePost.id })
               .select('id');
            if (comments.length > 0) {
               comments.map(async (comment) => {
                  const deleteComment = await commentModel.findByIdAndDelete(
                     comment.id
                  );
                  if (deleteComment.imageName) {
                     cloudinary.api.delete_resources(deleteComment.imageName);
                  }
               });
            }
         });

         resolve({
            err: data ? 0 : 1,
            message: data ? 'delete users' : 'delete user failed',
            data: data ? data : null,
         });
      } catch (error) {
         reject(error);
      }
   });



module.exports = {
   getAllUsers,
   getOneUser,
   deleteUser,
   updateUser,
   getCurrent,
   savedPosts,
   softDelete,
};
