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
      },
      resetCaptcha: {
         type: String,
      },
      resetPassword: {
         type: String,
      },
      createdAt: {
         type: Date,
         default: Date.now(),
      },
      expireAt: {
         type: Date,
         default: Date.now() + 15 * 60 * 1000,
      },
   },
   {
      timestamps: true,
      collection: 'UsersVerified',
   }
);

userVerifiedSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 });

module.exports = model('UserVerified', userVerifiedSchema);
