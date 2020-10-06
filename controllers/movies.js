const Movie = require('../models').Movie;
const Genre = require('../models').Genre;
const MovieGenre = require('../models').MovieGenre;

const axios = require('axios');
const { Op } = require("sequelize");


const renderSearchPage = (req, res) => {
    res.render('movies/index.ejs');
}

const renderMovieShowPage = (req, res) => {
    Movie.findAll({
        where: {
            imdbID: req.params.imdbID,
        },
        include: [{
            model: Genre,
            attributes: ['genre'] 
        }]
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
                    url: `http://www.omdbapi.com/?i=${req.params.imdbID}&plot=full&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                    method: 'get'
                })
                .then(response => {
                    console.log(response.data);
                    Movie.update(response.data, {
                        where: {imdbID: req.params.imdbID},
                        returning: true
                    })
                    .then(updateMovie => {
                        genres = response.data.Genre.split(',');
                        let userGenrePromises = [];
                        for( let i = 0 ; i < genres.length ; i++) {
                            genres[i] = genres[i].split(" ").join("");
                            userGenrePromises.push(Genre.upsert({
                                genre: genres[i]
                            }))
                        }
                        Promise.all(userGenrePromises)
                        .then(addedGenres => {
                            console.log("Genres added");
                        })
                        .catch(err => {
                            console.log(err.name);
                        })

                        Movie.findAll({
                            where: {
                                imdbID: req.params.imdbID
                            }
                        })
                        .then(foundMovie => {
                            for( let i=0; i<genres.length; i++){
                                Genre.findAll({
                                    where: {
                                        genre: genres[i]
                                    }
                                })
                                .then(foundGenre => {
                                    MovieGenre.create({
                                        movieId: foundMovie[0].id,
                                        genreId: foundGenre[0].id
                                    })
                                    .then(createdMovieGenre => {

                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            }

                            //todo page renders before genres are found causing error when initially loading

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
        },
        include: [{
            model: Genre,
            attributes: ['genre'] 
        }]
    })
    .then( movies => {
        if(movies.length != 0) {
            console.log(movies[0]);
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