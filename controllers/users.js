const User = require('../models').User;
const Genre = require('../models').Genre;

const show = (req,res) => {
    User.findByPk(req.user.id)
    .then(user => {
        Genre.findAll()
        .then(genres => {
            res.render('users/profile.ejs', {
                user: user,
                genres: genres
            })
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