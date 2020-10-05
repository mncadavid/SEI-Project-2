const Movie = require('../models').Movie;
const User = require('../models').User;

const axios = require('axios');
const { Op } = require("sequelize");
const { Sequelize } = require('../models');


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
                        let userPromises = [];
                        for( let i = 0 ; i < foundMovies.length ; i++) {
                            console.log('adding ' + foundMovies[i].Title);
                            userPromises.push(Movie.upsert(foundMovies[i]))
                        }

                        console.log(userPromises);
                        Promise.all(userPromises)
                        .then(
                            results => {
                                console.log(results)
                                Movie.findAll({
                                    where: {
                                        Title: {
                                            [Op.iLike]: `%${req.body.title}%`
                                        }  
                                    }
                                })
                                .then( foundMoviesFromDb => {
                                    console.log(foundMoviesFromDb[0]);
            
                                    // render page
                                    if(foundMoviesFromDb) {
                                        console.log('rendering movies from database');
                                        res.render('movies/index.ejs', {
                                            movies: foundMoviesFromDb
                                        });
                                    } else {
                                        // if not found error has occurred
                                        res.render('movies/index.ejs', {
                                            message: "An error has occurred, please try again later."
                                        });
                                    }
                                })
                                .catch (err => {
                                    console.log(err);
                                })
                            }
                        )
                        .catch (err => {
                            console.log(err);
                        })
                    // then search for movies in movies table
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