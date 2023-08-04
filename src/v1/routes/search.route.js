'use strict';

const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/verifyRole');
const SearchController = require('../controllers/search.controller');

router.post('/:keySearch', SearchController.querySearch);

module.exports = router;
