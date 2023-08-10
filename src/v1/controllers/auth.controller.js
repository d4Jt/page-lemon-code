'use strict';
// authenticationController.js
const passport = require('passport');

const authenticationService = require('../services/auth.service');

const {
   findOneOrCreatePassport,
} = require('../models/repositories/user.repositories');

const { internalServerError } = require('../middlewares/handle_error');

const handleGoogleCallback = (req, res, next) => {
   passport.authenticate('google', (err, profile) => {
      req.user = profile;
      return next();
   })(req, res, next);
};

const handleGitHubCallback = (req, res, next) => {
   passport.authenticate('github', (err, profile) => {
      req.user = profile;
      next();
   })(req, res, next);
};

const createUserPassport = async (req, res) => {
   try {
      console.log('req.user', req.user);
      const user = await findOneOrCreatePassport(req.user);
      return res.json(user);
   } catch (error) {
      return internalServerError(res);
   }
};

const register = async (req, res) => {
   try {
      const user = await authenticationService.register(req.body);
      res.cookie('reset_token', user.reset_token, { maxAge: 15 * 60 * 1000 }  )       
      res.json(user);
   } catch (error) {
      return internalServerError(res);
   }
};

const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await authenticationService.login({ email, password });
      return res.json(user);
   } catch (error) {
      return internalServerError(res);
   }
};

const refreshToken = async (req, res) => {
   const response = await authenticationService.refreshToken(
      req.body.refreshToken
   );
   res.status(200).json(response);
};

const resetCaptcha = async (req, res) => {
   try {
      const user = await authenticationService.resetCaptcha(req.cookies.reset_token); 
      res.cookie('reset_token', user.reset_token, { maxAge: 15 * 60 * 1000 }) 
      res.status(200).json(user);
   } catch (error) {
      return internalServerError(res);
   }
};

const handleVerifyCaptcha = async (req, res) => {
   try {
      const isActive = await authenticationService.handleVerifyCaptcha(
         req.params.captcha
      );
      return res.json(isActive);
   } catch (e) {
      return internalServerError(res);
   }
};

const forgotPassword = async (req, res) => {
   try {
      const { email } = req.query;
      const user = await authenticationService.forgotPassword(email);
      res.cookie('reset_token', user.reset_token, { maxAge: 15 * 60 * 1000 } )
      res.status(200).json(user); 
   } catch (error) {
      return internalServerError(res);
   }
};

const handleForgotPasswordCaptcha = async (req, res) => {
   try {
      const user = await authenticationService.handleForgotPasswordCaptcha(
         req.params.captcha
      );
      res.cookie('reset_password_token', user.reset_password_token, { maxAge: 15 * 60 * 1000 })
      res.status(200).json(user);
   } catch (e) {
      return internalServerError(res);
   }
};

const updatePassword = async (req, res) => {
   try {
      const user = await authenticationService.updatePassword(
         req.cookies.reset_password_token,
         req.body.password
      );
      res.status(200).json(user);
   } catch (e) {
      return internalServerError(res);
   }
};

module.exports = {
   handleGoogleCallback,
   handleGitHubCallback,
   authenticateWithGoogle: authenticationService.authenticateWithGoogle,
   authenticateWithGitHub: authenticationService.authenticateWithGitHub,
   createUserPassport,
   register,
   login,
   refreshToken,
   resetCaptcha,
   handleVerifyCaptcha,
   forgotPassword,
   handleForgotPasswordCaptcha,
   updatePassword,
};
