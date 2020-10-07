const express = require('express');
const ctrl = require('../controllers');
const router = express.Router();


router.get('/profile', ctrl.users.renderUserProfile);
router.get('/lists', ctrl.users.renderUserLists);
router.put('/lists/filter', ctrl.users.renderUserListsFiltered);

router.post('/lists/addUserMovie', ctrl.users.addUserMovie);

router.put('/profile/edit', ctrl.users.editUserProfile);
router.put('/profile/changePassword', ctrl.users.changeUserPassword);
router.put('/lists/markMovieFavorite', ctrl.users.markMovieFavorite);
router.put('/lists/changeMovieList', ctrl.users.changeMovieList)

router.delete('/profile/delete', ctrl.users.deleteUserProfile);
router.delete('/lists/delete', ctrl.users.deleteUserMovie);




module.exports = router;