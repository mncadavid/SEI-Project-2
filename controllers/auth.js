require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models').User;
const Genre = require('../models').Genre;


const renderSignUp = (req,res) => {
    let message = req.query.message;
    Genre.findAll()
    .then(genres => {
        res.render('auth/signup.ejs', {
            genres: genres,
            message: message
        });
    })
    .catch(err => {
        console.log(err);
    })
}

const renderLogIn = (req,res) => {
    res.render('auth/login.ejs');
}

const signUpUser = (req,res) => {
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
               res.redirect(`/users/profile`);
           })
           .catch(err => {
               if(err.name === 'SequelizeUniqueConstraintError'){
                    let message = "Username Taken";
                    res.redirect(`/auth/signup?message=${message}`);
               }
               else{
                    console.log(err);
               }
           })
       })
    })
}

const logInUser = (req,res) => {
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
                    res.redirect(`/movies`);
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
        res.render('auth/login.ejs', {
            message: err
        })
    })
}

const logOutUser = (req, res) => {
    res.cookie("jwt", "");
    res.redirect('/auth/login');
}

module.exports ={
    renderSignUp,
    renderLogIn,
    signUpUser,
    logInUser,
    logOutUser
}