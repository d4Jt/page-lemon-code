'use strict';
// authenticationService.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userModel = require('../models/user.model');
const userVerifiedModel = require('../models/userVerified.model');
const {
   hashPassword,
   confirmPassword,
   createToken,
   convertToObjectIdMongo,
   isCaptchaExpired,
   sendForgotPasswordEmail
} = require('../utils');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { sendCaptchaEmail } = require('../utils');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 6 });
// const {findOneOrCreatePassport} = require('../models/repositories/user.repositories');
// require('dotenv').config();

const URL_SERVER = process.env.URL_SERVER;

// Google OAuth configuration
passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: `${
            URL_SERVER ? URL_SERVER : 'https://lemon-code-page.onrender.com'
         }/api/auth/google/callback`, // Example: 'http://localhost:3000/auth/google/callback'
      },
      (accessToken, refreshToken, profile, done) => {
         // findOneOrCreatePassport(profile);
         // Custom authentication logic if needed
         // For this example, we will just pass the profile to the next step
         return done(null, profile);
      }
   )
);

const authenticateWithGoogle = passport.authenticate('google', {
   scope: ['profile', 'email'],
});

// GitHub OAuth configuration
passport.use(
   new GitHubStrategy(
      {
         clientID: process.env.GITHUB_CLIENT_ID,
         clientSecret: process.env.GITHUB_CLIENT_SECRET,
         callbackURL: `${
            URL_SERVER ? URL_SERVER : 'https://lemon-code-page.onrender.com'
         }/api/auth/github/callback`,
         scope: ['user:email'], // Example: 'http://localhost:3000/auth/github/callback'
      },
      (accessToken, refreshToken, profile, done) => {
         // Custom authentication logic if needed
         // For this example, we will just pass the profile to the next step
         const email = profile.emails ? profile.emails[0].value : null;

         return done(null, profile);
      }
   )
);

const authenticateWithGitHub = passport.authenticate('github', {
   scope: ['user:email'],
});

const register = ({ email, password, ...body }) =>
   new Promise(async (resolve, reject) => {
      try {
         const findOneUser = await userModel.findOne({ email });
         if (findOneUser) {
            resolve({
               err: 0,
               message: 'User already registered',
            });
         }

         const data = await userModel.create({
            email,
            password: hashPassword(password),
            ...body,
         });

         const objectData = data.toObject();

         delete objectData.password;
         delete objectData.role;

         const captcha = uid();

         const userVerify = await userVerifiedModel.create({
            userId: data._id,
            captcha,
         });

         if (userVerify) {
             sendCaptchaEmail(email, captcha);
         }

         const accessToken = data
            ? createToken(
                 {
                    id: data._id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    msisdn: data.msisdn,
                 },
                 '1d'
              )
            : null;
         const refreshToken = data
            ? createToken(
                 {
                    id: data._id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    msisdn: data.msisdn,
                 },
                 '3d'
              )
            : null;

         // delete jsonData.password;

         resolve({
            err: accessToken ? 0 : 1,
            message: accessToken ? 'Registered successful' : 'Registered fail',
            data: data ? objectData : null,
            access_token: accessToken ? `${accessToken}` : null,
            refresh_token: refreshToken ? refreshToken : null,
         });

         if (refreshToken) {
            await userModel.updateOne({ email }, { refreshToken });
         }
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const login = ({ email, password }) =>
   new Promise(async (resolve, reject) => {
      try {
         let data = await userModel
            .findOne({ email }, { refreshToken: 0, role: 0 })
            .lean();
         //.populate('-refreshToken -password -role')

         if (!data) {
            resolve({
               err: 1,
               message: 'Email is not registered',
            });
         }

         const checkPassword = confirmPassword(password, data.password);

         console.log(data);

         const accessToken = checkPassword
            ? createToken(
                 {
                    id: data._id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    avatar: data.avatar,
                    msisdn: data.msisdn,
                 },
                 '1d'
              )
            : null;
         const refreshToken = checkPassword
            ? createToken(
                 {
                    id: data._id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    avatar: data.avatar,
                    msisdn: data.msisdn,
                 },
                 '3d'
              )
            : null;

         delete data.password;
         console.log('after:: ', data);
         resolve({
            err: accessToken ? 0 : 1,
            message: accessToken ? 'Login successful' : 'Password is wrong',
            data: checkPassword ? data : null,
            access_token: accessToken ? `${accessToken}` : null,
            refresh_token: refreshToken ? refreshToken : null,
         });

         if (refreshToken) {
            await userModel.updateOne({ email }, { refreshToken });
         }
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const refreshToken = (refresh_token) =>
   new Promise(async (resolve, reject) => {
      try {
         const data = await userModel.findOne({ refreshToken: refresh_token });

         if (data) {
            jwt.verify(
               refresh_token,
               process.env.JWT_SECRET_REFRESH_TOKEN,
               (err) => {
                  if (err) {
                     resolve({
                        err: 1,
                        message: 'Refresh token expired.',
                     });
                  } else {
                     const accessToken = createToken(
                        {
                           id: data.id,
                           email: data.email,
                           firstName: data.firstName,
                           lastName: data.lastName,
                           avatar: data.avatar,
                           msisdn: data.msisdn,
                        },
                        '1d'
                     );
                     resolve({
                        err: accessToken ? 0 : 1,
                        message: accessToken
                           ? 'Ok'
                           : 'Fail to generate access token.',
                        access_token: accessToken
                           ? `Bearer ${accessToken}`
                           : null,
                        refresh_token: refresh_token,
                     });
                  }
               }
            );
         }
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });

const registerEmail = (email) =>
   new Promise(async (resolve, reject) => {
      const captcha = uid();

      const sendCaptcha = sendCaptchaEmail(email, captcha);
      resolve({
         err: 0,
         message: sendCaptcha,
      });
   });

const handleVerifyCaptcha = (captcha) =>
   new Promise(async (resolve) => {
      const captchaData = await userVerifiedModel.findOne({ captcha });

      if (captchaData) {
         const isHetHan = isCaptchaExpired(captchaData.expireAt);

         if (isHetHan) {
            resolve({
               err: 1,
               message: 'Captcha is expired',
            });
         }

         const user = await userModel.findByIdAndUpdate(
             captchaData.userId,
            {
               isActivated: true,
            }
         );
         if (user) resolve({ err: 0, message: 'Verify captcha success' });
      }
   });

   const forgotPassword = (email) => new Promise(async (resolve, reject) => {
      const captcha = uid();
         const user = await userModel.findOne({email});
         if(!user){
            resolve({
               err: 1,
               message: 'User not found',
               });
            }else{
            const userVerify = await userVerifiedModel.create({
               userId: user?.id,
               captcha,
               });
      
            if (userVerify) {
               sendForgotPasswordEmail(email, captcha);
               resolve({
                  err: 0,
                  message: "Send captcha email successfully",
                  });
               }
               else{
                  resolve({
                     err: 1,
                     message: 'create captcha email failed',
                  })
               }
            }
            
   });

   const handleForgotPasswordCaptcha = (captcha, password) =>
      new Promise(async (resolve) => {
      const captchaData = await userVerifiedModel.findOne({ captcha });

      if (captchaData) {
         const isHetHan = isCaptchaExpired(captchaData.expireAt);

         if (isHetHan) {
            resolve({
               err: 1,
               message: 'Captcha is expired',
            });
         }

         const user = await userModel.updateOne(
            { _id: captchaData.userId },
            {
               password: hashPassword(password),
            }
         );
         if (user) resolve({ err: 0, message: 'reset password success' })
         else{
            resolve({ err: 1, message: 'reset password failed' })
         }
      }
   });

module.exports = {
   authenticateWithGitHub,
   authenticateWithGoogle,
   register,
   login,
   refreshToken,
   registerEmail,
   handleVerifyCaptcha,
   forgotPassword,
   handleForgotPasswordCaptcha,
};
