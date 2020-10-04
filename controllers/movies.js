const Movie = require('../models').Movie;
const User = require('../models').User;

const axios = require('axios');


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}



const searchForMovie = (req, res) => {
    const title = 'Alien';

    // search for movie in movies table
        // if found, return and render page with movie information

        // if not found make API call
            // if found add to db
                // make db call
                // render page

            // not found 
                // return not found message

    axios({
        url: `http://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`,
        method: 'get',
        headers: {
            'x-api-key': process.env.OMDB_API_KEY
        }
    }).then((response) => {
        console.log(response.data);
        res.render('movies/index.ejs', {
            movie: response.data
        });
        
    }).catch((err) => {
        console.error(err);
    })


}







module.exports = {
    renderSearchPage,
    searchForMovie
}