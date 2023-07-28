'use strict';
// authenticationController.js
const passport = require('passport');

const authenticationService = require('../services/auth.service');

const {findOneOrCreatePassport} = require('../models/repositories/user.repositories');


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

const createUserPassport = async (req, res) => {

  // const {} = req.user

  const user = await findOneOrCreatePassport(req.user);

  res.json(user);
}

const register = async (req, res) => {
  const user = await authenticationService.register(req.body);
  res.json(user);
}

module.exports = {
  handleGoogleCallback,
  handleGitHubCallback,
  authenticateWithGoogle: authenticationService.authenticateWithGoogle,
  authenticateWithGitHub: authenticationService.authenticateWithGitHub,
  createUserPassport,
  register,
};
