const express = require('express');
const ctrl = require('../controllers');
const router = express.Router();


router.get('/profile', ctrl.users.renderUserProfile);

router.put('/profile/edit', ctrl.users.editUserProfile);

router.delete('/profile/delete', ctrl.users.deleteUserProfile);

router.put('/profile/changePassword', ctrl.users.changeUserPassword);

router.get('/lists', ctrl.users.renderUserLists);


module.exports = router;