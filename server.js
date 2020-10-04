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

    console.log(`Token: ${token}`);

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if(err || !decodedUser) {
            return res.send(err);
        }
        req.user = decodedUser;

        next();
    });
}

// new routes
app.use('/movies', routes.movies);
app.use('/users', verifyToken, routes.users);
app.use('/auth', routes.auth);

// splash page
app.get('/', (req, res) => {
    res.render('auth/login.ejs')
})


app.listen(process.env.PORT, () => {
    console.log(`I am listening on port ${process.env.PORT} whats up?`);
});
