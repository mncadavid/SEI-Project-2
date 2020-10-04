const express = require('express');
const ctrl = require('../controllers');
const router = express.Router();

router.get('/profile/:index', ctrl.users.show);
router.put('/profile/:index/edit', ctrl.users.editProfile);
router.delete('/profile/:index/delete', ctrl.users.deleteProfile);



module.exports = router;