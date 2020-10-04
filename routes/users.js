const express = require('express');
const ctrl = require('../controllers');
const router = express.Router();


router.get('/profile/:index', ctrl.users.renderUserProfile);

router.put('/profile/:index/edit', ctrl.users.editUserProfile);

router.delete('/profile/:index/delete', ctrl.users.deleteUserProfile);


module.exports = router;