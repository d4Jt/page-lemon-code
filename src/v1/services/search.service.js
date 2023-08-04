'use strict';

const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');

class SearchService {
   static querySearchPosts = (regexSearch, tags = []) =>
      PostModel.find(
         {
            isDeleted: false,
            $text: { $search: regexSearch },
            tags: { $in: tags },
         },
         {
            score: { $meta: 'textScore' },
         }
      )
         .select(Object.fromEntries(['slug'].map((i) => [i, 0])))
         .populate({
            path: 'user',
            select: 'avatar firstName lastName',
         })
         .sort({ score: { $meta: 'textScore' } })
         .lean();

   static querySearchUsers = (regexSearch) =>
      UserModel.find(
         {
            isDeleted: false,
            $text: { $search: regexSearch },
         },
         {
            score: { $meta: 'textScore' },
         }
      )
         .select(
            Object.fromEntries(
               ['-refreshToken', '-password', '-isActived', '-isDeleted'].map(
                  (i) => [i, 0]
               )
            )
         )
         .sort({ score: { $meta: 'textScore' } })
         .lean();

   static querySearch = ({ keySearch }, { q, tags }) =>
      new Promise(async (resolve, reject) => {
         try {
            const regexSearch = new RegExp(keySearch);

            if (q === 'posts' && q.includes('posts')) {
               console.log('1');
               const results = await this.querySearchPosts(regexSearch, tags);

               resolve({
                  err: 0,
                  message: results
                     ? 'Search posts successfully'
                     : 'Failed to search posts',
                  data: results || null,
               });
            } else if (q === 'users' && q.includes('users')) {
               console.log('2');
               const results = await this.querySearchUsers(regexSearch);
               resolve({
                  err: 0,
                  message: results
                     ? 'Search users successfully'
                     : 'Failed to search users',
                  data: results || null,
               });
            } else {
               console.log('3');
               const users = await this.querySearchUsers(regexSearch, tags);
               const posts = await this.querySearchPosts(regexSearch);

               const results = users.concat(posts);
               resolve({
                  err: 0,
                  message: results
                     ? 'Search all successfully'
                     : 'Failed to search all',
                  data: results || null,
               });
            }
         } catch (error) {
            console.log(error);
            reject(error);
         }
      });
}

module.exports = SearchService;
