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
         default: ' ',
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      msisdn: {
         type: String
      },
      password: {
         type: String,
      },
      role: {
         type: String,
         enum: ['user', 'admin'],
         default: 'user',
      },
      posts: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Post',
         },
      ],
      isActivated: {
         type: Boolean,
         default: false,
      },
      refreshToken: {
         type: String,
         default: '',
      }
   },
   {
      collection: 'Users',
      timestamps: true,
   }
);

//Export the model
module.exports = model('User', userSchema);
