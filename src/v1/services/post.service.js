const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const slugify = require('slugify');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 4 });
const { findByIdPost } = require('../models/repositories/find.repositories');
const cloudinary = require('cloudinary').v2;

const createPost = (payload, userId, fileData) =>
   new Promise(async (resolve, reject) => {
      try {
         console.log(userId);
         const { title } = payload;

         const data = new postModel({
            userId: userId,
            slug: slugify(`${title} ${uid()}`),
            image: fileData?.path,
            imageName: fileData?.filename,
            ...payload,
         });
         await data.save();

         console.log(data);

         if (data) {
            await userModel.findByIdAndUpdate(data.userId, {
               $push: { posts: data.id },
            });
         }


         resolve({
            err: 0,
            message: data
               ? 'Created post successfully'
               : 'Failed to create post',
            data: data ? data : null,
         });
      } catch (error) {
         console.log(error);
         reject(error);
         if(fileData) cloudinary.uploader.destroy(fileData.filename)
      }
   });

const updatePost = ({ pid, ...body }, fileData) =>
   new Promise(async (resolve, reject) => {
      try {
         const post = await findByIdPost(pid);
         if (!post) {
            resolve({
               err: 1,
               message: 'Post not found',
            });
         }

         cloudinary.api.delete_resources(post.imageName);

         const data = await postModel.findByIdAndUpdate(
            post.id,
            {
               image: fileData?.path,
               imageName: fileData?.filename,
               ...body,
            },
            { new: true }
         );

         resolve({
            err: 0,
            message: data
               ? 'Update post successfully'
               : 'Failed to update post',
            data,
         });
      } catch (error) {
         console.log(error);
         reject(error);
         if(fileData) cloudinary.uploader.destroy(fileData.filename)
      }
   });

const deletePost = (pid, userId) =>
   new Promise(async (resolve, reject) => {
      try {
         const post = await postModel.findById(pid);
         if (!post) {
            resolve({
               err: 1,
               message: 'Post not found',
            });
         }

         const data = await postModel.findByIdAndDelete(post.id);
         
         if (data) {
            await userModel.findByIdAndUpdate(userId, {
               $pull: { posts: post.id },
            });
         }
         
         cloudinary.api.delete_resources(data.imageName);
         //
         //
         resolve({
            err: 0,
            message: post
               ? 'Delete post successfully'
               : 'Failed to delete post',
            post,
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const softDeletePost = (pid) =>
   new Promise(async (resolve, reject) => {
      try {
         const post = await findByIdPost(pid);
         if (!post) {
            resolve({
               err: 1,
               message: 'Post not found',
            });
         }

         const data = await postModel.findByIdAndUpdate(
            post.id,
            { isDeleted: true },
            { new: true }
         );

         resolve({
            err: 0,
            message: data
               ? 'Soft delete post successfully'
               : 'Failed to soft delete post',
            data,
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const getAllPosts = () =>
   new Promise(async (resolve, reject) => {
      try {
         const data = await postModel.find({ isDeleted: false }).populate({
            path: 'userId',
            select: 'avatar firstName lastName',
         });

         resolve({
            err: 0,
            message: data ? 'Get all' : 'Hãy làm thêm post cho chúng tôi',
            data,
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const getPosts = ({ tags, ...query }) =>
   new Promise(async (resolve, reject) => {
      try {
         // (user === 'my') ? userId : user;
         const data = await postModel
            .find({ tags: { $in: tags }, isDeleted: false, ...query })
            .populate({
               path: 'userId',
               select: 'avatar firstName lastName',
            });
         resolve({
            err: 0,
            message: data.length > 0 ? 'Get post' : 'not found',
            data: data.length > 0 ? data : null,
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const getAPost = (slug) =>
   new Promise(async (resolve, reject) => {
      try {
         // (user === 'my') ? userId : user;
         const data = await postModel.findOne({
            slug,
         });
         resolve({
            err: 0,
            message: data ? 'Get a post' : 'not found',
            data: data ? data : null,
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const getAllTags = () => new Promise(async(resolve, reject) =>{
   try {
      // (user === 'my') ? userId : user;
      const data = await postModel.find({});

      const allTags = [];

      data.forEach(post => {
         if(post.tags && post.tags.length > 0){
            allTags.push(...post.tags);
         }
      });

      // Loại bỏ các tag trùng lặp (nếu có)
      const uniqueTags = [...new Set(allTags)];

      resolve({
         err: 0,
         message: uniqueTags.length > 0 ? 'Get all tags success' : 'There are no tags',
         data: uniqueTags,
      });
   } catch (error) {
      console.log(error);
      reject(error);
   }
});

module.exports = {
   createPost,
   updatePost,
   softDeletePost,
   getAllPosts,
   getPosts,
   deletePost,
   getAPost,
   getAllTags,
};
