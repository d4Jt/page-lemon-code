'use strict';
// authenticationService.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
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



module.exports = {
  authenticateWithGitHub,
  authenticateWithGoogle
};