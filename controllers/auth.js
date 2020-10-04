const User = require('../models').User;
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Genre = require('../models').Genre;

const signUpRender = (req,res) => {
    Genre.findAll()
    .then(genres => {
        res.render('auth/signup.ejs', {
            genres: genres
        });
    })
}
const logInRender = (req,res) => {
    res.render('auth/login.ejs',
    {
        message: ' '
    });
}
const signUp = (req,res) => {
    bcrypt.genSalt(10, (err, salt) => {
       if(err){
           return res.send(err);
       } 
       bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
           if(err){
               return res.send(err);
           }
           req.body.password = hashedPwd;
           User.create(req.body)
           .then(newUser => {
               const token = jwt.sign(
                   {
                       username: newUser.username,
                       id: newUser.id
                   },
                   process.env.JWT_SECRET,
                   {
                       expiresIn: "30 days"
                   }
               )
               res.cookie("jwt", token);
               console.log(token);
               res.redirect(`/users/profile/${newUser.id}`);
           })
       })
    })
}
const logIn = (req,res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(foundUser => {
        if(foundUser){
            bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
                if(match){
                    const token = jwt.sign(
                        {
                            id: foundUser.id,
                            username: foundUser.username
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "30 days"
                        }
                    )
                    console.log(token);
                    res.cookie("jwt",token);
                    res.redirect(`/users/profile/${foundUser.id}`);
                } else{
                    res.send('Incorrect Password');
                }
            })
        }
        else if(!foundUser){
            return res.render('auth/login.ejs', {
                message: 'Username or Password Incorrect'
            })
        }
    })
    .catch(err => {
        console.log("caught");
        res.render('auth/login.ejs', {
            message: err
        })
    })
}

module.exports ={
    signUpRender,
    logInRender,
    logIn,
    signUp
}