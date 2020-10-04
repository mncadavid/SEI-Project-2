const express = require('express');
const ctrl = require('../controllers');
const router = express.Router();

router.get('/signup', ctrl.auth.signUpRender);
router.get('/login', ctrl.auth.logInRender);
router.post('/login', ctrl.auth.logIn);
router.post('/signup', ctrl.auth.signUp);


module.exports = router;