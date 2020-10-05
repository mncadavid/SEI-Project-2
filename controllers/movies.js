const Movie = require('../models').Movie;

const axios = require('axios');
const { Op } = require("sequelize");


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}

const renderMovieShowPage = (req, res) => {
    //find movie in db by imdbID
    Movie.findAll({
        where: {
            imdbID: req.params.imdbID
        }
    })
    .then(foundMovie => {
        console.log(foundMovie[0].dataValues);
        res.render('movies/showMovie.ejs', {
            movie: foundMovie[0].dataValues
        });

        // found
            // if incomplete data - director string empty
                // api call to get complete data
                    // update movie entry
                        // find movie in db by imdbID
                            // render

            // if complete data    
                // res.render('movies/showMovie.ejs' , {
                //  foundMovie    
                // })

        // not found
            // api call to get complete data
                // update movie entry
                    // find movie in db by imdbID
                        // render




    })
    .catch (err => {
        console.log(err);
    });
}

const searchForMovie = (req, res) => {
    Movie.findAll({
        where: {
            Title: {
                [Op.iLike]: `%${req.body.title}%`
            }  
        }
    })
    .then( movies => {
        if(movies.length != 0) {
            res.render('movies/index.ejs', {
                movies: movies
            });
        } else {
            axios({
                url: `http://www.omdbapi.com/?s=${req.body.title}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                method: 'get'
            })
            .then((response) => {
                const foundMovies = response.data.Search;

                if(foundMovies != undefined) {
                    let userPromises = [];

                    for( let i = 0 ; i < foundMovies.length ; i++) {
                        userPromises.push(Movie.upsert(foundMovies[i]))
                    }

                    Promise.all(userPromises)
                    .then(results => {
                        Movie.findAll({
                            where: {
                                Title: {
                                    [Op.iLike]: `%${req.body.title}%`
                                }  
                            }
                        })
                        .then(foundMoviesFromDb => {    
                            if(foundMoviesFromDb) {
                                res.render('movies/index.ejs', {
                                    movies: foundMoviesFromDb
                                });
                            } else {
                                res.render('movies/index.ejs', {
                                    message: "An error has occurred, please try again later."
                                });
                            }
                        })
                        .catch (err => {
                            console.log(err);
                        })
                    })
                    .catch (err => {
                        console.log(err);
                    })
                } else {
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
    renderMovieShowPage,
    searchForMovie
}