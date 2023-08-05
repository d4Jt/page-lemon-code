'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const commentSchema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      postId: {
         type: Schema.Types.ObjectId,
         ref: 'Post',
      },
      content: {
         type: String,
         required: true,
      },
      image: {
         type: String,
      },
      imageName: {
         type: String,
      },
      likes: {
         type: Number,
         default: 0,
      },
      isDeleted: {
         type: Boolean,
         default: false,
      },
   },
   {
      collection: 'Comments',
      timestamps: true,
   }
);

//Export the model
module.exports = model('Comment', commentSchema);
