const bcrypt = require('bcryptjs');
const movies = require('./movies');

const User = require('../models').User;
const Genre = require('../models').Genre;
const Movie = require('../models').Movie;
const UserMovie = require('../models').UserMovie;


const renderUserProfile = (req,res) => {
    message = req.query.message;
    req.query = {};
    User.findByPk(req.user.id)
    .then(user => {
        Genre.findAll()
        .then(genres => {
            res.render('users/profile.ejs', {
                user: user,
                genres: genres,
                message: message
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
}

const renderUserLists = (req,res) => {
    User.findByPk(req.user.id, {
        include: [
            {
                model: Movie,
                attributes: ['imdbID', 'Title', 'Poster', 'Year', 'Director', 'Plot'],
                include: [{
                    model: Genre,
                    attributes: ['genre'] 
                }]
            }
        ],
        attributes: ['username']
    })
    .then(foundUser => {
        const pickedList = [];
        const watchedList = [];
        for(let i =0; i<foundUser.Movies.length; i++){
            if(foundUser.Movies[i].UserMovie.haveSeen){
                watchedList.push(foundUser.Movies[i]);
            }
            else{
                pickedList.push(foundUser.Movies[i]);
            }
        }
        res.render("users/lists.ejs", {
            pickedMovies: pickedList,
            watchedMovies: watchedList
        });
    })
    .catch(err => {
        console.log(err);
    })
}

const addUserMovie = (req, res) => {

}



const editUserProfile = (req,res) => {
    User.update(req.body, {
        where: {id: req.user.id},
        returning: true
    })
    .then(updatedUser => {
        res.redirect(`/users/profile`);
    })
    .catch(err => {
        console.log(err);
    })
}

const changeUserPassword = (req, res) => {
    User.findByPk(req.user.id)
    .then(
        user => {
            bcrypt.compare(req.body.currentPassword, user.password, (err, match) => {
                if(match){
                    if(req.body.newPassword === req.body.newPasswordRepeat){
                        bcrypt.genSalt(10, (err, salt) => {
                            if(err){
                                return res.send(err);
                            }
                            bcrypt.hash(req.body.newPassword, salt, (err, hashedPwd) => {
                                if(err){
                                    return res.send(err);
                                }
                                req.body.password = hashedPwd;
                                console.log(hashedPwd);
                                User.update({
                                    password: `${hashedPwd}`
                                }, {
                                    where: {id: req.user.id},
                                    returning: true
                                })
                                .then(updatedUser => {
                                    message = "Password Updated Successfully"
                                    res.redirect(`/users/profile?message=${message}`);
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            })
                        })
                    }
                    else{
                        message ="Passwords Must Match";
                        res.redirect(`/users/profile?message=${message}`)
                    }
                }
                else{
                    message="Incorrect Password";
                    res.redirect(`/users/profile?message=${message}`);
                }
            })
        }
    )
    .catch(err => {
        console.log(err);
    })

}

const markMovieFavorite = (req, res) => {
    User.findByPk(req.user.id, {
        include: [
            {
                model: Movie,
                attributes: ['id','imdbID'],
                where: {
                    imdbID: req.body.imdbId
                }
            }
        ],
        attributes: ['id','username']
    })
    .then(foundUser => {
        let favorited;
        if(foundUser.Movies[0].UserMovie.favorite){
            favorited = {
                favorite: 'false'
            }
        }
        else{
            favorited = {
                favorite: 'true'
            }
        }
        UserMovie.update(favorited, {
            where: {
                userId: foundUser.id,
                movieId: foundUser.Movies[0].id
            },
            returning: true
        })
        .then(updatedUserMovie => {
            console.log("Favorited");
            res.redirect('/users/lists');
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
}

const changeMovieList = (req, res) => {

}

const deleteUserProfile = (req, res) => {
    User.destroy({
        where: {id: req.user.id}
    })
    .then(() => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    })
}

const deleteUserMovie = (req, res) => {

}


module.exports = {
    renderUserProfile,
    renderUserLists,
    addUserMovie,
    editUserProfile,
    changeUserPassword,
    markMovieFavorite,
    changeMovieList,
    deleteUserProfile,
    deleteUserMovie
}