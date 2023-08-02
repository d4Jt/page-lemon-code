'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const postSchema = new Schema(
   {
      title: {
         type: String,
         required: true,
      },
      content: {
         type: String,
         required: true,
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      image: {
         type: String,
         required: true,
      },
      imageName: {
         type: String,
      },
      tags: {
         type: Array,
      },
      slug: {
         type: String,
         unique: true,
      },
      isDeleted: {
         type: Boolean,
         default: false,
      },
   },
   {
      collection: 'Posts',
      timestamps: true,
   }
);

//Export the model
module.exports = model('Post', postSchema);
