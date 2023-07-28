'use strict';
const router = require('express').Router();
const authenticationController = require('../controllers/auth.controller');

router.get('/google', authenticationController.authenticateWithGoogle);

// Route to handle Google callback
router.get('/google/callback', authenticationController.authenticateWithGoogle, authenticationController.handleGoogleCallback, (req, res) => {
    res.json(req.user);
});

module.exports = router;
