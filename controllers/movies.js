const Movie = require('../models').Movie;

const axios = require('axios');
const { Op } = require("sequelize");


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}

const renderMovieShowPage = (req, res) => {
    Movie.findAll({
        where: {
            imdbID: req.params.imdbID
        }
    })
    .then(foundMovie => {
        console.log(foundMovie);

        if(foundMovie.length != 0) {
            movieData = foundMovie[0].dataValues

            if(movieData.Director && movieData.Plot) {
                console.log('data complete');

                res.render('movies/showMovie.ejs' , {
                 movie: movieData    
                })
    
            } else {
                console.log('data incomplete');

                // api call to get complete data
                axios({
                    url: `http://www.omdbapi.com/?i=${req.params.imdbID}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                    method: 'get'
                })
                .then(response => {
                    console.log(response.data);

                    // update movie entry
                    Movie.update(response.data, {
                        where: {imdbID: req.params.imdbID},
                        returning: true
                    })
                    .then(updateMovie => {
                        // find movie in db by imdbID
                        Movie.findAll({
                            where: {
                                imdbID: req.params.imdbID
                            }
                        })
                        .then(foundMovie => {
                            res.render('movies/showMovie.ejs', {
                                movie: foundMovie[0].dataValues
                            });
                        })
                        .catch (err => {
                            console.log(err);
                        });
                    })
                    .catch (err => {
                        console.log(err);
                    });
                })
                .catch (err => {
                    console.log(err);
                });
            }
        } else {
            console.log('movie not found');

            // api call to get complete data
            axios({
                url: `http://www.omdbapi.com/?i=${req.params.imdbID}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                method: 'get'
            })
            .then(response => {
                console.log(response.data)
                // create movie entry
                Movie.create(response.data)
                .then(newMovie => {
                    // find movie in db by imdbID
                    Movie.findAll({
                        where: {
                            imdbID: req.params.imdbID
                        }
                    })
                    .then(foundMovie => {
                        // render
                        res.render('movies/showMovie.ejs', {
                            movie: foundMovie[0].dataValues
                        });
                    })
                })
                .catch (err => {
                    console.log(err);
                });
            })
            .catch (err => {
                console.log(err);
            });

            // res.redirect('/movies');
        }
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