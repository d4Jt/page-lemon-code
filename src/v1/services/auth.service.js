'use strict';
// authenticationService.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userModel = require('../models/user.model');
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
      callbackURL: `http://localhost:${process.env.PORT}/api/auth/github/callback`, // Example: 'http://localhost:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // Custom authentication logic if needed
      // For this example, we will just pass the profile to the next step

      return done(null, profile);
    }
  )
);

const authenticateWithGitHub = passport.authenticate('github', { scope: ['user:email'] });

const  register = (user) => new Promise(async (resolve, reject) => {
  try {

      const findOneUser = await userModel.findOne({firstName: user.firstName, lastName: user.lastName})
      if(findOneUser) resolve({
          err: 0,
          msg: "User already registered"
      })

      const newUser = new userModel(user)
      await newUser.save();
      resolve({
          err: newUser ? 0 : 1,
          msg: newUser ? 'Registration successful' : 'Registration',
          newUser,
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