const Movie = require('../models').Movie;
const User = require('../models').User;


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}


module.exports = {
    renderSearchPage
}