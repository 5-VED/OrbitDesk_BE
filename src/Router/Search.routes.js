const router = require('express').Router();
const SearchController = require('../Controllers/Search.controller');

router.get('/', SearchController.search);

module.exports = router;
