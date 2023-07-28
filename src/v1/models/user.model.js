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
      email: {
         type: String,
         required: true,
         unique: true,
      },
      msisdn: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         enum: ['user', 'admin'],
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
