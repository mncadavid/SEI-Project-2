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
        if(movies.length != 0) {
            // render page with movies information
            res.render('movies/index.ejs', {
                movies: movies
            });
        } else {
            // if not found make API call
            axios({
                url: `http://www.omdbapi.com/?s=${req.body.title}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                method: 'get'
            }).then((response) => {
                const foundMovies = response.data.Search;
                console.log(foundMovies);
                // if found in api call add to db
                if(foundMovies != undefined) {
                    // create call add short info from results to db
                        // then search for movies in movies table
                            // if found
                                // render page
        
                            // if not found error has occurred
                    res.render('movies/index.ejs', {
                        movies: foundMovies
                    });
                } else {
                    // return not found message
                    res.render('movies/index.ejs', {
                        message: `Unable to find any movies matching ${req.body.title}`
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
        }
    })
    .catch (err => {
        console.log(err);
    });






}


module.exports = {
    renderSearchPage,
    searchForMovie
}