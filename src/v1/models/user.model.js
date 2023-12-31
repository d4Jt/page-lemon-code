'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new Schema(
   {
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      avatar: {
         type: String,
         default:
            'https://res.cloudinary.com/diip1zrth/image/upload/v1691030887/lemon-page-code/image_processing20201216-8146-1bkbicd_thj77c.png',
      },
      imageName: {
         type: String,
         default: '',
      },
      email: {
         type: String,
         required: true,
         unique: true,
         match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Email không hợp lệ',
         ],
      },
      msisdn: {
         type: String,
      },
      password: {
         type: String,
      },
      role: {
         type: String,
         enum: ['user', 'admin'],
         default: 'user',
      },
      resetPassword: {
         type: String,
         default: '',
      },
      posts: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Post',
         },
      ],
      likedPosts: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Post',
         },
      ],
      likedComments: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
         },
      ],
      savedPosts: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Post',
         },
      ],
      isActivated: {
         type: Boolean,
         default: false,
      },
      isPublishedMsisdn: {
         type: Boolean,
         default: true,
      },
      isPublishedEmail: {
         type: Boolean,
         default: true,
      },
      refreshToken: {
         type: String,
         default: '',
      },
      isDeleted: {
         type: Boolean,
         default: false,
      },
      score: Number,
   },
   {
      collection: 'Users',
      timestamps: true,
   }
);

userSchema.index({ firstName: 'text', lastName: 'text' });

//Export the model
module.exports = model('User', userSchema);
