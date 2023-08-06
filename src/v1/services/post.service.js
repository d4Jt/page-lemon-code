const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const commentModel = require('../models/comment.model');
const slugify = require('slugify');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 4 });
const { findByIdPost } = require('../models/repositories/find.repositories');
const { convertToObjectIdMongo } = require('../utils');
const cloudinary = require('cloudinary').v2;

const createPost = (payload, userId, fileData) =>
   new Promise(async (resolve, reject) => {
      try {
         console.log(userId);
         const { title } = payload;

         const data = new postModel({
            user: userId,
            slug: slugify(`${title} ${uid()}`),
            image: fileData?.path,
            imageName: fileData?.filename,
            ...payload,
         });
         await data.save();

         if (data) {
            await userModel.findByIdAndUpdate(userId, {
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
         if (fileData) cloudinary.uploader.destroy(fileData.filename);
      }
   });

const updatePost = ({ pid, ...body }, userId, fileData) =>
   new Promise(async (resolve, reject) => {
      try {
         const post = await findByIdPost(pid);
         if (!post) {
            resolve({
               err: 1,
               message: 'Post not found',
            });
            if (fileData) cloudinary.uploader.destroy(fileData.filename);
         }

         if (!post.user.equals(userId)) {
            resolve({
               err: 1,
               message: 'You do not have permission to update',
            });
            if (fileData) cloudinary.uploader.destroy(fileData.filename);
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
         if (fileData) cloudinary.uploader.destroy(fileData.filename);
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
               $pull: {
                  posts: post.id,
                  likedPosts: post.id,
                  savedPosts: post.id,
               },
            });
         }

         cloudinary.api.delete_resources(data.imageName);

         const comments = await commentModel
            .find({ postId: post.id })
            .select('id');

         comments.map(async (comment) => {
            const deleteComment = await commentModel.findByIdAndDelete(
               comment.id
            );
            cloudinary.api.delete_resources(deleteComment.imageName);
         });

         //
         resolve({
            err: 0,
            message: post
               ? 'Delete post successfully'
               : 'Failed to delete post',
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const softDeletePost = (pid, userId) =>
   new Promise(async (resolve, reject) => {
      try {
         const post = await findByIdPost(pid);
         if (!post) {
            resolve({
               err: 1,
               message: 'Post not found',
            });
         }

         if (!post.user.equals(userId)) {
            resolve({
               err: 1,
               message: 'You do not have permission to delete',
            });
         }

         const data = await postModel.findByIdAndUpdate(
            post.id,
            { isDeleted: true },
            { new: true }
         );

         if (data) {
            await userModel.findByIdAndUpdate(userId, {
               $pull: {
                  posts: post.id,
                  likedPosts: post.id,
                  savedPosts: post.id,
               },
            });
         }

         await commentModel.updateMany(
            { postId: data.id },
            { isDeleted: true }
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
         const data = await postModel
            .find({ isDeleted: false, isPublished: true })
            .populate({
               path: 'user',
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
               path: 'user',
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
            isDeleted: false,
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

const getAllTags = () =>
   new Promise(async (resolve, reject) => {
      try {
         // (user === 'my') ? userId : user;
         const data = await postModel.find({ isDeleted: false });

         const allTags = [];

         data.forEach((post) => {
            if (post.tags && post.tags.length > 0) {
               allTags.push(...post.tags);
            }
         });

         // Loại bỏ các tag trùng lặp (nếu có)
         const uniqueTags = [...new Set(allTags)];

         resolve({
            err: 0,
            message:
               uniqueTags.length > 0
                  ? 'Get all tags success'
                  : 'There are no tags',
            data: uniqueTags,
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const getPostsOfUser = (userId, currentUser = '') =>
   new Promise(async (resolve, reject) => {
      try {
         let data;

         if (userId === currentUser) {
            data = await postModel
               .find({ user: userId, isDeleted: false })
               .populate({
                  path: 'user',
                  select: 'avatar firstName lastName',
               })
               .lean();
         } else
            data = await postModel
               .find({ user: userId, isPublished: true, isDeleted: false })
               .populate({
                  path: 'user',
                  select: 'avatar firstName lastName',
               })
               .lean(); // FIXME: drop data and add isPublished: true

         resolve({
            err: 0,
            message: data
               ? 'Get posts of user success'
               : 'Failed to get posts of user',
            data,
         });
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const reactPost = (pid, userId, { quantity, save }) => {
   return new Promise(async (resolve, reject) => {
      try {
         const post = await postModel.findById(pid);
         if (!post) {
            resolve({
               err: 1,
               message: 'Post not found',
            });
         }
         if (quantity !== 1 && quantity !== -1) {
            resolve({
               err: 1,
               message: 'Quantity must be 1 or -1',
            });
         } else {
            let data;
            let likedPost;

            if (data && (+quantity === 1 || save === true)) {
               const user = await userModel.findById(userId);
               if (!user) {
                  resolve({
                     err: 1,
                     message: 'User not found',
                  });
               }
               const isInUse = user.likedPosts.some(
                  (id) => id.toString() === pid.toString()
               );

               if (isInUse)
                  resolve({
                     err: 1,
                     message: "You've already liked this post",
                  });
               data = await postModel.findByIdAndUpdate(
                  pid,
                  {
                     $inc: { likes: quantity },
                  },
                  { new: true }
               );

               likedPost = await userModel
                  .findByIdAndUpdate(
                     userId,
                     {
                        $addToSet: { likedPosts: convertToObjectIdMongo(pid) },
                     },
                     { new: true }
                  )
                  .select([
                     'likedPosts',
                     '_id',
                     'firstName',
                     'lastName',
                     'savedPosts',
                     'likedComments',
                  ]);
            } else if (data && (+quantity === -1 || save === false)) {
               const user = await userModel.findById(userId);
               if (!user) {
                  resolve({
                     err: 1,
                     message: 'User not found',
                  });
               }
               data = await postModel.findByIdAndUpdate(
                  pid,
                  {
                     $inc: { likes: quantity },
                  },
                  { new: true }
               );

               likedPost = await userModel
                  .findByIdAndUpdate(
                     userId,
                     {
                        $pull: { likedPosts: convertToObjectIdMongo(pid) },
                     },
                     { new: true }
                  )
                  .select(['likedPosts', '_id', 'firstName', 'lastName']);
            }

            resolve({
               err: 0,
               message: data
                  ? 'React post successfully'
                  : 'Failed to react post',
               data: { post: data, likedPost },
            });
         }
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });
};

module.exports = {
   createPost,
   updatePost,
   softDeletePost,
   getAllPosts,
   getPosts,
   deletePost,
   getAPost,
   getAllTags,
   getPostsOfUser,
   reactPost,
};
