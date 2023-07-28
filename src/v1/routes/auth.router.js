'use strict';
const router = require('express').Router();
const authenticationController = require('../controllers/auth.controller');

router.get('/google', authenticationController.authenticateWithGoogle);

// Route to handle Google callback
router.get('/google/callback', authenticationController.handleGoogleCallback, (req, res) => {
    res.json(req.user);
});

// routes.js
// Route to initiate GitHub OAuth
router.get('/github', authenticationController.authenticateWithGitHub);

// Route to handle GitHub callback
router.get('/github/callback', authenticationController.handleGitHubCallback,(req, res) => {
    res.json(req.user);
});


module.exports = router;
