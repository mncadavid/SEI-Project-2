const Movie = require('../models').Movie;
const Genre = require('../models').Genre;
const MovieGenre = require('../models').MovieGenre;
const UserMovie = require('../models').UserMovie;

const axios = require('axios');
const { Op } = require("sequelize");
const { sequelize } = require('../models');


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
                    movie: movieData,
                    genresObjects: movieData.Genres
                })
            } else {
                axios({
                    url: `http://www.omdbapi.com/?i=${req.params.imdbID}&plot=full&type=movie&apikey=${process.env.OMDB_API_KEY}`,
                    method: 'get'
                })
                .then(response => {
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

                            res.render('movies/showMovie.ejs', {
                                movie: foundMovie[0].dataValues,
                                genres: genres
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
                url: `http://www.omdbapi.com/?i=${req.params.imdbID}&plot=full&type=movie&apikey=${process.env.OMDB_API_KEY}`,
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
                    console.log(err.name);
                });
            })
            .catch (err => {
                console.log(err.name);
            });
        }
    })
    .catch (err => {
        console.log(err.name);
    });
}

const renderFavoritesPage = (req, res) => {
    Genre.findAll({
        order: [
            ['genre','ASC']
        ]
    })
    .then(genres => {
        UserMovie.findAll({
            where: {
                favorite:true
            },
            attributes: ['movieId', [sequelize.fn('count', sequelize.col('UserMovie.favorite')), 'favoriteCount']],
            group: ['UserMovie.movieId'],
            order:[
                [sequelize.col('favoriteCount'), 'DESC']
            ]
        })
        .then(favoriteCounts => {
            let favoriteMovies = [];
            let favoriteCountArray = [];
            let favoritePromises = [];
            for (let i = 0; i< favoriteCounts.length; i++){
                favoritePromises.push(
                    Movie.findByPk(favoriteCounts[i].movieId, {
                        include: [{
                            model: Genre,
                            attributes: ['genre'] 
                        }]
                    })
                    .then(foundMovie => {
                        favoriteMovies[i] = foundMovie;
                        favoriteCountArray[i] = favoriteCounts[i].dataValues.favoriteCount;
                    })
                    .catch(err => {
                        console.log(err.name);
                    })
                )
            }
            Promise.all(favoritePromises)
            .then(resolvedPromises => {
                res.render('movies/favorites.ejs',
                    {
                        movies: favoriteMovies,
                        favorites: favoriteCountArray,
                        genres: genres
                    }
                )
            })
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
}

const renderFavoritesPageFiltered  = (req, res) => {
    Genre.findAll({
        order: [
            ['genre','ASC']
        ]
    })
    .then(genres => {
        UserMovie.findAll({
            where: {
                favorite:true
            },
            attributes: ['movieId', [sequelize.fn('count', sequelize.col('UserMovie.favorite')), 'favoriteCount']],
            group: ['UserMovie.movieId'],
            order:[
                [sequelize.col('favoriteCount'), 'DESC']
            ]
        })
        .then(favoriteCounts => {
            let favoriteMovies = [];
            let favoriteCountArray = [];
            let favoritePromises = [];
            let addedMovies = 0;
            for (let i = 0; i< favoriteCounts.length; i++){
                favoritePromises.push(
                    Movie.findByPk(favoriteCounts[i].movieId, {
                        include: [{
                            model: Genre,
                            attributes: ['genre'] 
                        }]
                    })
                    .then(foundMovie => {
                        if(req.body.pickedGenre == 'allGenres') {
                            favoriteMovies[i] = foundMovie;
                            favoriteCountArray[i] = favoriteCounts[i].dataValues.favoriteCount;
                        } else {
                            for(let j = 0 ; j < foundMovie.Genres.length ; j++) {
                                if(foundMovie.Genres[j].genre == req.body.pickedGenre) {
                                    favoriteMovies[addedMovies] = foundMovie;
                                    favoriteCountArray[addedMovies] = favoriteCounts[i].dataValues.favoriteCount;
                                    addedMovies++;
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                )
            }
            Promise.all(favoritePromises)
            .then(resolvedPromises => {
                res.render('movies/favorites.ejs',
                    {
                        movies: favoriteMovies,
                        favorites: favoriteCountArray,
                        genres: genres,
                        filters: req.body
                    }
                )
            })
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
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
            res.render('movies/index.ejs', {
                movies: movies,
                searchedTitle: req.body.title
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
                                    movies: foundMoviesFromDb,
                                    searchedTitle: req.body.title
                                });
                            } else {
                                res.render('movies/index.ejs', {
                                    message: "An error has occurred, please try again later."
                                });
                            }
                        })
                        .catch (err => {
                            console.log(err.name);
                        })
                    })
                    .catch (err => {
                        console.log(err.name);
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
        console.log(err.name);
    });
}

const searchforMovieWeb = (req, res) => {
    console.log(req.body.searchedTitle);

    axios({
        url: `http://www.omdbapi.com/?s=${req.body.searchedTitle}&type=movie&apikey=${process.env.OMDB_API_KEY}`,
        method: 'get'
    })
    .then(response => {
        const foundMovies = response.data.Search;

        console.log(response);


        if(foundMovies != undefined) {
            let userPromises = [];
            let failedPromises = []

            for( let i = 0 ; i < foundMovies.length ; i++) {
                userPromises.push(
                    Movie.upsert(foundMovies[i])
                    .then(test => {
                    })
                    .catch(err => {
                        failedPromises.push(i);
                    })
                )
            }

            for(let i = failedPromises.length - 1 ; i >= 0 ; i--) {
                userPromises.splice(failedPromises[i], 1)
            }

            Promise.all(userPromises)
            .then(results => {
                Movie.findAll({
                    where: {
                        Title: {
                            [Op.iLike]: `%${req.body.searchedTitle}%`
                        }  
                    }
                })
                .then(foundMoviesFromDb => {    
                    if(foundMoviesFromDb) {
                        res.render('movies/index.ejs', {
                            movies: foundMoviesFromDb,
                            searchedTitle: req.body.searchedTitle
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
        } else if(response.data.Error === 'Too many results.') {
            res.render('movies/index.ejs', {
                message: 'Too many results, please search something more specific'
            });
        } else {
            res.render('movies/index.ejs', {
                message: `Unable to find any movies matching ${req.body.searchedTitle}`
            });
        }
    })
    .catch((err) => {
        console.error(err);
    });
}



module.exports = {
    renderSearchPage,
    renderMovieShowPage,
    renderFavoritesPage,
    renderFavoritesPageFiltered,
    searchForMovie,
    searchforMovieWeb
}