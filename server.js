require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');


const routes = require('./routes');
const app = express();

const User = require('./models').User;


app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(cookieParser());

const verifyToken = (req, res, next) => {
    let token = req.cookies.jwt;

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if(err || !decodedUser) {
            if(err.name == "JsonWebTokenError"){
                return res.render('auth/login.ejs', {
                    message: "Please Log In"
                });
            }
            return res.send(err);
        }
        req.user = decodedUser;

        next();
    });
}

const redirectLoggedInUser = (req, res, next) => {
    let token = req.cookies.jwt;
    if(req.url === '/logout'){
        return next()
    }
    if(token !== undefined){
        if(token === ''){
            next();
        }
        else{
            return res.redirect('/movies');
        }
    }
    else{
        next();
    }
}

// new routes
app.use('/movies', verifyToken, routes.movies);
app.use('/users', verifyToken, routes.users);
app.use('/auth', redirectLoggedInUser, routes.auth);

// splash page
app.get('/', (req, res) => {
    res.render('auth/login.ejs')
})


app.listen(process.env.PORT, () => {
    console.log(`I am listening on port ${process.env.PORT} whats up?`);
});
