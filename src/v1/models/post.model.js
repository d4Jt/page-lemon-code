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
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      image: {
         type: String,
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
      likes: {
         type: Number,
         default: 0,
      },
      comments: {
         type: Number,
         default: 0,
      },
      views: {
         type: Number,
         default: 0,
      },
      isPublished: {
         type: Boolean,
         default: true,
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

postSchema.index({ title: 'text', content: 'text' });

//Export the model
module.exports = model('Post', postSchema);
