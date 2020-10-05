const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');


router.get('/', ctrl.movies.renderSearchPage);
router.get('/:imdbID', ctrl.movies.renderMovieShowPage);


router.put('/search', ctrl.movies.searchForMovie);

module.exports = router;
