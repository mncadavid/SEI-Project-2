const bcrypt = require('bcryptjs');

const User = require('../models').User;
const Genre = require('../models').Genre;


const renderUserProfile = (req,res) => {
    message = req.query.message;
    req.query = {};
    User.findByPk(req.user.id)
    .then(user => {
        Genre.findAll()
        .then(genres => {
            res.render('users/profile.ejs', {
                user: user,
                genres: genres,
                message: message
            })
        })
    })
}
const editUserProfile = (req,res) => {
    User.update(req.body, {
        where: {id: req.user.id},
        returning: true
    })
    .then(updatedUser => {
        res.redirect(`/users/profile`);
    })
}

const deleteUserProfile = (req, res) => {
    User.destroy({
        where: {id: req.user.id}
    })
    .then(() => {
        res.redirect('/');
    })
}

const changeUserPassword = (req, res) => {
    User.findByPk(req.user.id)
    .then(
        user => {
            bcrypt.compare(req.body.currentPassword, user.password, (err, match) => {
                if(match){
                    if(req.body.newPassword === req.body.newPasswordRepeat){
                        bcrypt.genSalt(10, (err, salt) => {
                            if(err){
                                return res.send(err);
                            }
                            bcrypt.hash(req.body.newPassword, salt, (err, hashedPwd) => {
                                if(err){
                                    return res.send(err);
                                }
                                req.body.password = hashedPwd;
                                console.log(hashedPwd);
                                User.update({
                                    password: `${hashedPwd}`
                                }, {
                                    where: {id: req.user.id},
                                    returning: true
                                })
                                .then(updatedUser => {
                                    message = "Password Updated Successfully"
                                    res.redirect(`/users/profile?message=${message}`);
                                })
                            })
                        })
                    }
                    else{
                        message ="Passwords Must Match";
                        res.redirect(`/users/profile?message=${message}`)
                    }
                }
                else{
                    message="Incorrect Password";
                    res.redirect(`/users/profile?message=${message}`);
                }
            })
        }
    )

}

module.exports = {
    renderUserProfile,
    editUserProfile,
    deleteUserProfile,
    changeUserPassword
}