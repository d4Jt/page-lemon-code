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
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      msisdn: {
         type: String,
         unique: true,
         required: true,
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
   },
   {
      collection: 'Users',
      timestamps: true,
   }
);

//Export the model
module.exports = model('User', userSchema);
