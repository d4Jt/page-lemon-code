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

module.exports = {
  handleGoogleCallback,
  authenticateWithGoogle: authenticationService.authenticateWithGoogle,
};
