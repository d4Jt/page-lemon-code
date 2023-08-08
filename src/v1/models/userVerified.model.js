'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

const userVerifiedSchema = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      captcha: {
         type: String,
         required: true,
      },
      createdAt: {
         type: Date,
         default: Date.now(),
      },
      expireAt: {
         type: Date,
         default: Date.now() + 1 * 60 * 1000,
      },
   },
   {
      timestamps: true,
      collection: 'UsersVerified',
   }
);

userVerifiedSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1 * 60 });

module.exports = model('UserVerified', userVerifiedSchema);
