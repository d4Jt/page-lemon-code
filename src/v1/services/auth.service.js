'use strict';
// authenticationService.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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






module.exports = {
  authenticateWithGoogle,
};
