const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');


router.get('/', ctrl.movies.renderSearchPage);

router.put('/search', ctrl.movies.searchForMovie);

module.exports = router;
