'use strict';
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const verify = require('../middlewares/verifyToken');
// const { create } = require('../models/comment.model');

router.get('/google', authController.authenticateWithGoogle);

// Route to handle Google callback
router.get('/google/callback', authController.handleGoogleCallback, authController.createUserPassport);

// routes.js
// Route to initiate GitHub OAuth
router.get('/github', authController.authenticateWithGitHub);

// Route to handle GitHub callback
router.get('/github/callback', authController.handleGitHubCallback, authController.createUserPassport);

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/refresh',verify, authController.refreshToken);

module.exports = router;