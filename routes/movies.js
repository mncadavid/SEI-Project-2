const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');


router.get('/', ctrl.movies.renderSearchPage);
router.get('/favorites', ctrl.movies.renderFavoritesPage);
router.get('/:imdbID', ctrl.movies.renderMovieShowPage);

router.post('/search', ctrl.movies.searchForMovie);
router.post('/search/web', ctrl.movies.searchforMovieWeb);


module.exports = router;
