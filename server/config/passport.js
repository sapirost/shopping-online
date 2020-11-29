const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

module.exports = passport => {
    passport.use('local-login',
        new localStrategy({ usernameField: 'usernameMail' }, (username, password, done) => {
            User.findOne({ usernameMail: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'user does not exist' })
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'password incorrect' });
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    )


    passport.use('local-register',
        new localStrategy({ usernameField: 'numberID', passReqToCallback: true },

            function (req, numberID, password, done) {
                var generateHash = function (password) {
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                };

                User.findOne({ where: { numberID: numberID } }).then(function (user) {

                    if (user) {
                        return done(null, false, { message: 'That ID already exist' });
                    }

                    else {
                        var userPassword = generateHash(password);
                        var data =
                        {
                            numberID: numberID,
                            password: userPassword,
                            usernameMail: req.body.usernameMail,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            city: req.body.city,
                            street: req.body.street,
                            role: 'user'
                        };

                        User.create(data).then(function (newUser, created) {
                            if (!newUser) {
                                return done(null, false);
                            }

                            if (newUser) {
                                return done(null, newUser);

                            }
                        });
                    }
                });
            }
        ))

    passport.serializeUser((user, done) => {
            done(null, user.id);
        })

    passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        });
}