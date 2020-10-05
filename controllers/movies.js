const Movie = require('../models').Movie;
const Genre = require('../models').Genre;

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
        if(foundMovie.length != 0) {
            movieData = foundMovie[0].dataValues

            if(movieData.Director && movieData.Plot) {
                res.render('movies/showMovie.ejs' , {
                 movie: movieData    
                })
            } else {
                axios({
                    url: `http://www.omdbapi.com/?i=${req.params.imdbID}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                    method: 'get'
                })
                .then(response => {
                    Movie.update(response.data, {
                        where: {imdbID: req.params.imdbID},
                        returning: true
                    })
                    .then(updateMovie => {
                        genres = response.data.Genre.split(',');
                        let userPromises = [];

                        for( let i = 0 ; i < genres.length ; i++) {
                            userPromises.push(Genre.upsert({
                                genre: genres[i].split(" ").join("")
                            }))
                        }
    
                        Promise.all(userPromises)
                        .then(addedGenres => {
                            console.log("Genres added");
                        })
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
            axios({
                url: `http://www.omdbapi.com/?i=${req.params.imdbID}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                method: 'get'
            })
            .then(response => {
                Movie.create(response.data)
                .then(newMovie => {
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
                })
                .catch (err => {
                    console.log(err);
                });
            })
            .catch (err => {
                console.log(err);
            });
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