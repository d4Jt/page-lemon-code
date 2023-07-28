'use strict';
// authenticationService.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userModel = require('../models/user.model');
const {hashPassword, confirmPassword} = require('../utils');
// const {findOneOrCreatePassport} = require('../models/repositories/user.repositories');
// require('dotenv').config();

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/api/auth/google/callback`, // Example: 'http://localhost:3000/auth/google/callback'
    },
     (accessToken, refreshToken, profile, done) => {
      // findOneOrCreatePassport(profile);
      // Custom authentication logic if needed
      // For this example, we will just pass the profile to the next step
      return done(null, profile);
    }
  )
);

const authenticateWithGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });


// GitHub OAuth configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/api/auth/github/callback`,
      scope: ['user:email'] // Example: 'http://localhost:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // Custom authentication logic if needed
      // For this example, we will just pass the profile to the next step
      const email = profile.emails ? profile.emails[0].value : null;

      return done(null, profile);
    }
  )
);

const authenticateWithGitHub = passport.authenticate('github', { scope: ['user:email'] });

const  register = ({email,password,confirmPassword,...body}) => new Promise(async (resolve, reject) => {
  try {
      
      const findOneUser = await userModel.findOne({email})
      if(findOneUser) resolve({
          err: 0,
          message: "User already registered"
      })

      if(password !== confirmPassword) resolve({
        err: 1,
        message: "Wrong password!"
      })

      const data = new userModel({
        email: email,
        password: hashPassword(password),
        ...body
      })
      await data.save();
      resolve({
          err: data ? 0 : 1,
          message: data ? 'Registration successful' : 'Registration',
          data,
      })
      
  } catch (error) {
      console.log(error);
      reject(error);
  }
})

module.exports = {
  authenticateWithGitHub,
  authenticateWithGoogle,
  register,
};