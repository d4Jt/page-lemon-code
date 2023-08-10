'use strict';
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const verify = require('../middlewares/verifyToken');
const uploadCloud = require('../middlewares/uploader');

// auth google and github
router.get('/google', authController.authenticateWithGoogle);
router.get('/github', authController.authenticateWithGitHub);

// Route to handle Google callback
router.get(
   '/google/callback',
   authController.handleGoogleCallback,
   authController.createUserPassport
);

// Route to handle GitHub callback
router.get(
   '/github/callback',
   authController.handleGitHubCallback,
   authController.createUserPassport
);

//get
router.get('/refresh', verify, authController.refreshToken);
router.get('/resetCaptcha', authController.resetCaptcha);
router.get('/handleCaptcha/:captcha', authController.handleVerifyCaptcha);
router.get('/forgotPassword', authController.forgotPassword);
router.get('/forgotPasswordCaptcha/:captcha', authController.handleForgotPasswordCaptcha);

//post
router.post('/register', authController.register);
router.post('/updatePassword', authController.updatePassword);


router.post('/login', authController.login);

module.exports = router;
