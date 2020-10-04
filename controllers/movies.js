const Movie = require('../models').Movie;
const User = require('../models').User;

const axios = require('axios');


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}

const searchForMovie = (req, res) => {

    // search for movie in movies table
    
    // if found, return and render page with movie information
   
    // if not found make API call
    
    // if found in api call add to db

    // make db call
    // render page
    
    // not found 
    // return not found message




    axios({
        url: `http://www.omdbapi.com/?s=${req.body.title}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
        method: 'get',
        headers: {
            'x-api-key': process.env.OMDB_API_KEY
        }
    }).then((response) => {
        console.log(response.data.Search);

        if(response.data) {
            res.render('movies/index.ejs', {
                movies: response.data.Search
            });
        }
    }).catch((err) => {
        console.error(err);
    });


    // Movie.findAll()
    // .then(movies => {
    //     console.log(movies);
    //     if(movies) {
    //         res.render('movies/index.ejs', {
    //             movies: movies
    //         });
    //     } else {

    //     }
       
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.send(err);
    // });




}


module.exports = {
    renderSearchPage,
    searchForMovie
}