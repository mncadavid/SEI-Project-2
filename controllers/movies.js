const Movie = require('../models').Movie;
const User = require('../models').User;

const axios = require('axios');
const { Op } = require("sequelize");


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}

const searchForMovie = (req, res) => {

    // search for movies in movies table
    Movie.findAll({
        where: {
            Title: {
                [Op.iLike]: `%${req.body.title}%`
            }  
        }
    })
    .then( movies => {
        console.log(movies);
        
        // if found, return and 
        if(movies) {
            // render page with movies information
            res.render('movies/index.ejs', {
                movies: movies
            });
        } else {
            // if not found make API call

            // if found in api call add to db
                // create call add short info from results to db
                    // then search for movies in movies table
                        // if found
                            // render page
    
                        // if not found error has occurred
    
            // not found 
            // return not found message
        }
    })
    .catch (err => {
        console.log(err);
    });




    // axios({
    //     url: `http://www.omdbapi.com/?s=${req.body.title}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
    //     method: 'get'
    // }).then((response) => {
    //     const foundMovies = response.data.Search;
    //     console.log(foundMovies);

    //     for( let i = 0 ; i < foundMovies.length ; i ++ ) {

    //     }




    //     if(response.data) {
    //         res.render('movies/index.ejs', {
    //             movies: foundMovies
    //         });
    //     }
    // }).catch((err) => {
    //     console.error(err);
    // });

}


module.exports = {
    renderSearchPage,
    searchForMovie
}