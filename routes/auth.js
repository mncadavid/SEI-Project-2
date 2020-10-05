const express = require('express');
const ctrl = require('../controllers');
const router = express.Router();


router.get('/signup', ctrl.auth.renderSignUp);
router.get('/login', ctrl.auth.renderLogIn);

router.post('/signup', ctrl.auth.signUpUser);
router.post('/login', ctrl.auth.logInUser);

router.get('/logout', ctrl.auth.logOutUser);


module.exports = router;