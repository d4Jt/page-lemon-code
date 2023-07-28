'use strict';
// authenticationController.js
const passport = require('passport');

const authenticationService = require('../services/auth.service');


const handleGoogleCallback =  (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next) 
};


const handleGitHubCallback = (req, res, next) => {
  passport.authenticate('github', (err, profile) => {
      req.user = profile
      next()
  })(req, res, next) 
};


module.exports = {
  handleGoogleCallback,
  handleGitHubCallback,
  authenticateWithGoogle: authenticationService.authenticateWithGoogle,
  authenticateWithGitHub: authenticationService.authenticateWithGitHub
};
