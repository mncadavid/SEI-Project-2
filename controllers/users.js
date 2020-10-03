const User = require('../models').User;

const show = (req,res) => {
    User.findByPk(req.user.id)
    .then(user => {
        res.render('users/profile.ejs', {
            user: user
        })
    })
}
const editProfile = (req,res) => {
    User.update(req.body, {
        where: {id: req.params.index},
        returning: true
    })
    .then(updatedUser => {
        res.redirect(`/users/profile/${req.params.index}`);
    })
}

const deleteProfile = (req, res) => {
    User.destroy({
        where: {id: req.params.index}
    })
    .then(() => {
        res.redirect('/');
    })
}


module.exports = {
show,
editProfile,
deleteProfile,
}